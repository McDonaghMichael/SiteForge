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

func CreatePage(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		collection := client.Database(methods.GetDatabaseName()).Collection("pages")

		var page models.Page
		err := json.NewDecoder(r.Body).Decode(&page)
		if err != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			methods.CreateLog(client, models.PAGE_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			fmt.Println("[ERROR] ", err)
			return
		}

		filter := bson.M{"slug": page.Slug}
		var existingPage models.Page

		err = collection.FindOne(context.TODO(), filter).Decode(&existingPage)
		if err == nil {
			http.Error(w, "Slug already exists", http.StatusConflict)
			methods.CreateLog(client, models.PAGE_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			log.Println("[ERROR] ", page.Slug)
			return
		} else if !errors.Is(err, mongo.ErrNoDocuments) {
			http.Error(w, "Database error", http.StatusInternalServerError)
			methods.CreateLog(client, models.PAGE_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			log.Println("[ERROR] Slug already exists: ", err)
			return
		}

		res, err := collection.InsertOne(context.TODO(), bson.M{
			"title":            page.Title,
			"word_count":       page.WordCount,
			"html":             page.Html,
			"slug":             page.Slug,
			"focus_keyword":    page.FocusKeyword,
			"status":           page.Status,
			"featuredImage":    page.FeaturedImage,
			"meta_title":       page.MetaTitle,
			"meta_description": page.MetaDescription,
			"meta_keywords":    page.MetaKeywords,
			"type":             page.Type,
			"created_date":     page.CreatedDate,
			"updated_date":     page.UpdatedDate,
		})
		if err != nil {
			log.Println("MongoDB Insert Error:", err)
			http.Error(w, "Failed to create page", http.StatusInternalServerError)
			methods.CreateLog(client, models.PAGE_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			return
		}

		response := map[string]interface{}{
			"message": "Page created successfully",
			"userID":  res.InsertedID,
			"user":    page,
		}

		methods.CreateLog(client, models.PAGE_CATEGORY, models.SUCCESS_STATUS, models.CREATED, "Created page "+page.Title+" with the slug: "+page.Slug)
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
			methods.CreateLog(client, models.PAGE_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())
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
		err := json.NewDecoder(r.Body).Decode(&page)

		if err != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("Error decoding JSON:", err)
			methods.CreateLog(client, models.PAGE_CATEGORY, models.FAIL_STATUS, models.UPDATED, err.Error())
			return
		}

		fil := bson.M{"slug": page["slug"]}

		log.Println(page["oldSlug"])
		log.Println(page["slug"])
		var existingPage models.Page

		if page["slug"] != page["oldSlug"] {
			err = collection.FindOne(context.TODO(), fil).Decode(&existingPage)
			if err == nil {
				http.Error(w, "Slug already exists", http.StatusConflict)
				log.Println("[ERROR] ", page["slug"])
				methods.CreateLog(client, models.PAGE_CATEGORY, models.FAIL_STATUS, models.UPDATED, err.Error())
				return
			} else if !errors.Is(err, mongo.ErrNoDocuments) {
				http.Error(w, "Database error", http.StatusInternalServerError)
				log.Println("[ERROR] Slug already exists: ", err)
				methods.CreateLog(client, models.PAGE_CATEGORY, models.FAIL_STATUS, models.UPDATED, err.Error())
				return
			}
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

		_, err = collection.UpdateOne(context.TODO(), filter, update)
		methods.CreateLog(client, models.PAGE_CATEGORY, models.SUCCESS_STATUS, models.UPDATED, "Updated page "+page["title"].(string)+" with the slug: "+page["slug"].(string))

		if err != nil {
			log.Print(err)
		}
	}
}

func DeletePage(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		collection := client.Database(methods.GetDatabaseName()).Collection("pages")

		var page models.Page
		err := json.NewDecoder(r.Body).Decode(&page)

		if err != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("[ERROR] ", err)
			methods.CreateLog(client, models.PAGE_CATEGORY, models.FAIL_STATUS, models.DELETED, err.Error())
			return
		}
		log.Println("[INFO] Deleting page:", page.Slug)
		filter := bson.D{{"slug", page.Slug}}
		_, err = collection.DeleteOne(context.TODO(), filter)
		methods.CreateLog(client, models.PAGE_CATEGORY, models.SUCCESS_STATUS, models.DELETED, "Deleted page with slug: "+page.Slug)

		if err != nil {
			http.Error(w, "Error deleting", http.StatusBadRequest)
			fmt.Println("[ERROR] ", err)
			methods.CreateLog(client, models.PAGE_CATEGORY, models.FAIL_STATUS, models.DELETED, err.Error())
			return
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

			methods.CreateLog(client, models.PAGE_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())

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
			methods.CreateLog(client, models.PAGE_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())
			log.Print(err)
		}

		var results []bson.M
		if err = cursor.All(context.TODO(), &results); err != nil {
			log.Print(err)
		}

		json.NewEncoder(w).Encode(results)
	}
}
