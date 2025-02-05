package methods

import (
	"backend/models"
	"context"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"log"
)

func FindPageById(client *mongo.Client, id string) (string, error) {
	identifier, _ := bson.ObjectIDFromHex(id)

	collection := client.Database("test").Collection("pages")

	var result models.Page

	filter := bson.D{{"_id", identifier}}

	err := collection.FindOne(context.TODO(), filter).Decode(&result)

	if err != nil {
		log.Fatal(err)
	}

	return result.Html, nil
}
