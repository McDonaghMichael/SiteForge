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

func CreatePage(client *mongo.Client, title string, html string, slug string, status int, featuredImage string, metaTitle string, metaDescription string, metaKeywords string) {
	collection := client.Database("test").Collection("pages")

	page := models.Page{Title: title, Html: html, Slug: slug, Status: status, FeaturedImage: featuredImage, MetaTitle: metaTitle, MetaDescription: metaDescription, MetaKeywords: metaKeywords}

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
