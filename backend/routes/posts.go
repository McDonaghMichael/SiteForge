package routes

import (
	"backend/models"
	"context"
	"encoding/json"
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

		var newPage models.Post
		collection := client.Database("test").Collection("posts")
		err := json.NewDecoder(r.Body).Decode(&newPage)
		if err != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("Error decoding JSON:", err)
			return
		}
		fmt.Printf("Received Page: %+v\n", newPage)

		filter := bson.M{"slug": newPage.Slug}
		var existingPost models.Post

		err = collection.FindOne(context.TODO(), filter).Decode(&existingPost)
		if err == nil {
			http.Error(w, "Slug already exists", http.StatusConflict)
			log.Println("Slug conflict:", newPage.Slug)
			return
		} else if err != mongo.ErrNoDocuments {
			http.Error(w, "Database error", http.StatusInternalServerError)
			log.Println("MongoDB FindOne error:", err)
			return
		}

		res, err := collection.InsertOne(context.TODO(), bson.M{
			"title":           newPage.Title,
			"html":            newPage.Html,
			"slug":            newPage.Slug,
			"metatitle":       newPage.MetaTitle,
			"metadescription": newPage.MetaDescription,
			"metakeywords":    newPage.MetaKeywords,
		})
		if err != nil {
			log.Println("MongoDB Insert Error:", err)
			http.Error(w, "Failed to create page", http.StatusInternalServerError)
			return
		}

		response := map[string]interface{}{
			"message": "Page created successfully",
			"userID":  res.InsertedID,
			"user":    newPage,
		}
		json.NewEncoder(w).Encode(response)
	}
}

func FindPostBySlug(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		collection := client.Database("test").Collection("posts")

		var result models.Post

		filter := bson.D{{"slug", vars["slug"]}}

		err := collection.FindOne(context.TODO(), filter).Decode(&result)

		if err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(result)
	}
}

func EditPost(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		collection := client.Database("test").Collection("posts")

		var page map[string]interface{}
		errt := json.NewDecoder(r.Body).Decode(&page)
		if errt != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("Error decoding JSON:", errt)
			return
		}

		if page["oldSlug"] != page["newSlug"] {
			filter2 := bson.M{"slug": page["slug"]}
			var existingPost models.Post

			err := collection.FindOne(context.TODO(), filter2).Decode(&existingPost)
			if err == nil {
				http.Error(w, "Slug already exists", http.StatusConflict)
				log.Println("Slug conflict:", page["slug"])
				return
			} else if err != mongo.ErrNoDocuments {
				http.Error(w, "Database error", http.StatusInternalServerError)
				log.Println("MongoDB FindOne error:", page["slug"])
				return
			}
		}

		fmt.Printf("Received Page: %+v\n", page["oldSlug"])

		filter := bson.D{{"slug", page["oldSlug"]}}

		update := bson.D{{"$set", bson.D{
			{"title", page["title"]},
			{"html", page["html"]},
			{"slug", page["slug"]},
			{"metatitle", page["meta_title"]},
			{"metadescription", page["meta_description"]},
			{"metakeywords", page["meta_keywords"]},
		}}}

		_, err2 := collection.UpdateOne(context.TODO(), filter, update)

		if err2 != nil {
			log.Fatal(err2)
		}
	}
}

func FindPostById(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id, _ := bson.ObjectIDFromHex(vars["id"])

		collection := client.Database("test").Collection("posts")

		var result models.Post

		filter := bson.D{{"_id", id}}

		err := collection.FindOne(context.TODO(), filter).Decode(&result)

		if err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(result)
	}
}

func FetchPosts(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		coll := client.Database("test").Collection("posts")

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
