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
	"time"
)

func CreatePage(client *mongo.Client, title string, html string, slug string, status int, featuredImage string, metaTitle string, metaDescription string, metaKeywords string, t int) {
	collection := client.Database("test").Collection("pages")

	page := models.Page{Title: title, Date: time.DateOnly, Html: html, Slug: slug, Status: status, FeaturedImage: featuredImage, MetaTitle: metaTitle, MetaDescription: metaDescription, MetaKeywords: metaKeywords, Type: t}

	res, err := collection.InsertOne(context.Background(), page)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(res.InsertedID)
}

func FindPageBySlug(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		collection := client.Database("test").Collection("pages")

		var result models.Page

		filter := bson.D{{"slug", vars["slug"]}}

		err := collection.FindOne(context.TODO(), filter).Decode(&result)

		if err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(result)
	}
}

func EditPage(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		collection := client.Database("test").Collection("pages")

		var page map[string]interface{}
		errt := json.NewDecoder(r.Body).Decode(&page)
		if errt != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("Error decoding JSON:", errt)
			return
		}
		fmt.Printf("Received Page: %+v\n", page["oldSlug"])

		filter := bson.D{{"slug", page["oldSlug"]}}

		update := bson.D{{"$set", bson.D{
			{"title", page["title"]},
			{"html", page["html"]},
			{"css", page["css"]},
			{"slug", page["slug"]},
			{"metatitle", page["meta_title"]},
			{"metadescription", page["meta_description"]},
			{"metakeywords", page["meta_keywords"]},
			{"type", page["type"]},
		}}}

		_, err := collection.UpdateOne(context.TODO(), filter, update)

		if err != nil {
			log.Fatal(err)
		}
	}
}

func FindPageById(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id, _ := bson.ObjectIDFromHex(vars["id"])

		collection := client.Database("test").Collection("pages")

		var result models.Page

		filter := bson.D{{"_id", id}}

		err := collection.FindOne(context.TODO(), filter).Decode(&result)

		if err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(result)
	}
}

func FetchPages(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		coll := client.Database("test").Collection("pages")

		cursor, err := coll.Find(context.TODO(), bson.D{})
		if err != nil {
			panic(err)
		}

		var results []models.Page
		if err = cursor.All(context.TODO(), &results); err != nil {
			panic(err)
		}

		json.NewEncoder(w).Encode(results)
	}
}
