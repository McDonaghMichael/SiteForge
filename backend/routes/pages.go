package routes

import (
	"backend/methods"
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

func CreatePage(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		var newPage models.Page
		err := json.NewDecoder(r.Body).Decode(&newPage)
		if err != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("Error decoding JSON:", err)
			return
		}

		collection := client.Database(methods.GetDatabaseName()).Collection("pages")
		res, err := collection.InsertOne(context.TODO(), bson.M{
			"title":            newPage.Title,
			"word_count":       newPage.WordCount,
			"html":             newPage.Html,
			"slug":             newPage.Slug,
			"focus_keyword":    newPage.FocusKeyword,
			"status":           newPage.Status,
			"featuredImage":    newPage.FeaturedImage,
			"meta_title":       newPage.MetaTitle,
			"meta_description": newPage.MetaDescription,
			"meta_keywords":    newPage.MetaKeywords,
			"type":             newPage.Type,
			"created_date":     newPage.CreatedDate,
			"updated_date":     newPage.UpdatedDate,
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

		methods.CreateLog(client, models.PAGE_CATEGORY, models.SUCCESS_STATUS, models.CREATED, "Created page "+newPage.Title+" with the slug: "+newPage.Slug)
		json.NewEncoder(w).Encode(response)
	}
}

func FindPageBySlug(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		collection := client.Database(methods.GetDatabaseName()).Collection("pages")

		var result models.Page

		filter := bson.D{{"slug", vars["slug"]}}

		err := collection.FindOne(context.TODO(), filter).Decode(&result)

		if err != nil {
			log.Print(err)
		}

		json.NewEncoder(w).Encode(result)
	}
}

func EditPage(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		collection := client.Database(methods.GetDatabaseName()).Collection("pages")

		var page map[string]interface{}
		errt := json.NewDecoder(r.Body).Decode(&page)
		if errt != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("Error decoding JSON:", errt)
			return
		}

		filter := bson.D{{"slug", page["oldSlug"]}}

		update := bson.D{{"$set", bson.D{
			{"title", page["title"]},
			{"word_count", page["word_count"]},
			{"html", page["html"]},
			{"focus_keyword", page["focus_keyword"]},
			{"css", page["css"]},
			{"slug", page["slug"]},
			{"meta_title", page["meta_title"]},
			{"meta_description", page["meta_description"]},
			{"meta_keywords", page["meta_keywords"]},
			{"type", page["type"]},
			{"updated_date", page["updated_date"]},
		}}}

		_, err := collection.UpdateOne(context.TODO(), filter, update)
		methods.CreateLog(client, models.PAGE_CATEGORY, models.SUCCESS_STATUS, models.UPDATED, "Updated page "+page["title"].(string)+" with the slug: "+page["slug"].(string))

		if err != nil {
			log.Print(err)
		}
	}
}

func FindPageById(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id, _ := bson.ObjectIDFromHex(vars["id"])

		collection := client.Database(methods.GetDatabaseName()).Collection("pages")

		var result bson.M

		filter := bson.D{{"_id", id}}

		err := collection.FindOne(context.TODO(), filter).Decode(&result)

		if err != nil {
			log.Print(err)
		}

		json.NewEncoder(w).Encode(result)
	}
}

func FetchPages(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		coll := client.Database(methods.GetDatabaseName()).Collection("pages")

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
