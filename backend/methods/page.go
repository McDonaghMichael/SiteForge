package methods

import (
	"backend/models"
	"context"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"log"
)

func CreatePage(client *mongo.Client, title string, html string, slug string, status int, featuredImage string, metaTitle string, metaDescription string, metaKeywords string, t int) {
	collection := client.Database("test").Collection("pages")

	page := models.Page{Title: title, Html: html, Slug: slug, Status: status, FeaturedImage: featuredImage, MetaTitle: metaTitle, MetaDescription: metaDescription, MetaKeywords: metaKeywords, Type: t}

	_, err := collection.InsertOne(context.Background(), page)

	if err != nil {
		log.Print(err)
	}

}

func FindPageById(client *mongo.Client, id string) (string, error) {
	identifier, _ := bson.ObjectIDFromHex(id)

	collection := client.Database("test").Collection("pages")

	var result models.Page

	filter := bson.D{{"_id", identifier}}

	err := collection.FindOne(context.TODO(), filter).Decode(&result)

	if err != nil {
		log.Print(err)
	}

	return result.Html, nil
}

func FindPageBySlug(client *mongo.Client, slug string) (string, error) {

	collection := client.Database("test").Collection("pages")

	var result models.Page

	filter := bson.D{{"slug", slug}}

	err := collection.FindOne(context.TODO(), filter).Decode(&result)

	if err != nil {
		log.Print(err)
	}

	return result.Html, nil
}
