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
			return
		}

		filter := bson.M{"slug": post.Slug}
		var existingPost models.Post

		err = collection.FindOne(context.TODO(), filter).Decode(&existingPost)
		if err == nil {
			http.Error(w, "Slug already exists", http.StatusConflict)
			log.Println("[ERROR] ", post.Slug)
			return
		} else if !errors.Is(err, mongo.ErrNoDocuments) {
			http.Error(w, "Database error", http.StatusInternalServerError)
			log.Println("[ERROR] Slug already exists: ", err)
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

func FindPostBySlug(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		collection := client.Database(methods.GetDatabaseName()).Collection("posts")

		var result models.Post

		filter := bson.D{{"slug", vars["slug"]}}

		err := collection.FindOne(context.TODO(), filter).Decode(&result)

		if err != nil {
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
					return
				} else if !errors.Is(err, mongo.ErrNoDocuments) {
					http.Error(w, "Database error", http.StatusInternalServerError)
					log.Println("[ERROR] ", err)
					return
				}
			}
		}

		filter := bson.D{{"slug", post["oldSlug"]}}

		update := bson.D{{"$set", bson.D{
			{"title", post["title"]},
			{"html", post["html"]},
			{"slug", post["slug"]},
			{"metatitle", post["meta_title"]},
			{"metadescription", post["meta_description"]},
			{"metakeywords", post["meta_keywords"]},
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

			panic(err)
		}

		var results []bson.M
		if err = cursor.All(context.TODO(), &results); err != nil {
			panic(err)
		}

		json.NewEncoder(w).Encode(results)
	}
}
