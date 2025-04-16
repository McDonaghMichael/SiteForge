package routes

import (
	"backend/methods"
	"backend/models"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"log"
	"net/http"
)

func CreatePost(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		var post models.Post
		collection := client.Database(methods.GetDatabaseName()).Collection("posts")
		err := json.NewDecoder(r.Body).Decode(&post)
		if err != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("Error decoding JSON:", err)
			methods.CreateLog(client, models.POST_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			return
		}

		filter := bson.M{"slug": post.Slug}
		var existingPost models.Post

		err = collection.FindOne(context.TODO(), filter).Decode(&existingPost)
		if err == nil {
			http.Error(w, "Slug already exists", http.StatusConflict)
			log.Println("[ERROR] ", post.Slug)
			methods.CreateLog(client, models.POST_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			return
		} else if !errors.Is(err, mongo.ErrNoDocuments) {
			http.Error(w, "Database error", http.StatusInternalServerError)
			log.Println("[ERROR] Slug already exists: ", err)
			methods.CreateLog(client, models.POST_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			return
		}

		res, err := collection.InsertOne(context.TODO(), bson.M{
			"title":           post.Title,
			"html":            post.Html,
			"slug":            post.Slug,
			"metatitle":       post.MetaTitle,
			"metadescription": post.MetaDescription,
			"metakeywords":    post.MetaKeywords,
			"created_date":    post.CreatedDate,
			"updated_date":    post.UpdatedDate,
		})
		if err != nil {
			log.Println("MongoDB Insert Error:", err)
			http.Error(w, "Failed to create post", http.StatusInternalServerError)
			methods.CreateLog(client, models.POST_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			return
		}

		response := map[string]interface{}{
			"message": "Post created successfully",
			"userID":  res.InsertedID,
			"user":    post,
		}

		methods.CreateLog(client, models.POST_CATEGORY, models.SUCCESS_STATUS, models.CREATED, "Created post "+post.Title+" with the slug: "+post.Slug)
		json.NewEncoder(w).Encode(response)
	}
}

func DeletePost(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		collection := client.Database(methods.GetDatabaseName()).Collection("posts")

		var post models.Post
		err := json.NewDecoder(r.Body).Decode(&post)

		if err != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("[ERROR] ", err)
			methods.CreateLog(client, models.POST_CATEGORY, models.FAIL_STATUS, models.DELETED, err.Error())
			return
		}
		log.Println("[INFO] Deleting post:", post.Slug)
		filter := bson.D{{"slug", post.Slug}}
		_, err = collection.DeleteOne(context.TODO(), filter)
		methods.CreateLog(client, models.POST_CATEGORY, models.SUCCESS_STATUS, models.DELETED, "Deleted post with slug: "+post.Slug)

		if err != nil {
			http.Error(w, "Error deleting", http.StatusBadRequest)
			fmt.Println("[ERROR] ", err)
			methods.CreateLog(client, models.POST_CATEGORY, models.FAIL_STATUS, models.DELETED, err.Error())
			return
		}
	}
}

func FindPostBySlug(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		collection := client.Database(methods.GetDatabaseName()).Collection("posts")

		var result models.Post

		filter := bson.D{{"slug", vars["slug"]}}

		err := collection.FindOne(context.TODO(), filter).Decode(&result)

		if err != nil {
			methods.CreateLog(client, models.POST_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())
			log.Print(err)
		}

		json.NewEncoder(w).Encode(result)
	}
}

func EditPost(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		collection := client.Database(methods.GetDatabaseName()).Collection("posts")

		var post map[string]interface{}
		err := json.NewDecoder(r.Body).Decode(&post)
		if err != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("[ERROR] ", err)
			methods.CreateLog(client, models.POST_CATEGORY, models.FAIL_STATUS, models.UPDATED, err.Error())

			return
		}

		if post["newSlug"] != nil {
			if post["oldSlug"] != post["newSlug"] {

				filter := bson.M{"slug": post["newSlug"]}
				var existingPost models.Post

				err = collection.FindOne(context.TODO(), filter).Decode(&existingPost)
				if err == nil {
					http.Error(w, "Slug already exists", http.StatusConflict)
					log.Println("[ERROR] Slug already exists: ", post["newSlug"])
					methods.CreateLog(client, models.POST_CATEGORY, models.FAIL_STATUS, models.UPDATED, err.Error())
					return
				} else if !errors.Is(err, mongo.ErrNoDocuments) {
					http.Error(w, "Database error", http.StatusInternalServerError)
					methods.CreateLog(client, models.POST_CATEGORY, models.FAIL_STATUS, models.UPDATED, err.Error())
					log.Println("[ERROR] ", err)
					return
				}
			}
		}

		filter := bson.D{{"slug", post["oldSlug"]}}

		update := bson.D{{"$set", bson.D{
			{"title", post["title"]},
			{"word_count", post["word_count"]},
			{"html", post["html"]},
			{"focus_keyword", post["focus_keyword"]},
			{"css", post["css"]},
			{"slug", post["slug"]},
			{"meta_title", post["meta_title"]},
			{"meta_description", post["meta_description"]},
			{"meta_keywords", post["meta_keywords"]},
			{"type", post["type"]},
			{"updated_date", post["updated_date"]},
		}}}

		_, err2 := collection.UpdateOne(context.TODO(), filter, update)

		methods.CreateLog(client, models.POST_CATEGORY, models.SUCCESS_STATUS, models.UPDATED, "Updated post "+post["title"].(string)+" with the slug: "+post["slug"].(string))

		if err2 != nil {
			log.Print(err2)
		}
	}
}

func FindPostById(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id, _ := bson.ObjectIDFromHex(vars["id"])

		collection := client.Database(methods.GetDatabaseName()).Collection("posts")

		var result models.Post

		filter := bson.D{{"_id", id}}

		err := collection.FindOne(context.TODO(), filter).Decode(&result)

		if err != nil {
			methods.CreateLog(client, models.POST_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())
			log.Print(err)
		}

		json.NewEncoder(w).Encode(result)
	}
}

func FetchPosts(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		coll := client.Database(methods.GetDatabaseName()).Collection("posts")

		cursor, err := coll.Find(context.TODO(), bson.D{})
		if err != nil {

			log.Print(err)
		}

		var results []bson.M
		if err = cursor.All(context.TODO(), &results); err != nil {
			methods.CreateLog(client, models.POST_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())
			log.Print(err)
		}

		json.NewEncoder(w).Encode(results)
	}
}
