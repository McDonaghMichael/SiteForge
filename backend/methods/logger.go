package methods

import (
	"backend/models"
	"context"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"log"
	"time"
)

func CreateLog(client *mongo.Client, category int, statusCode int, actionCode int, message string) {
	collection := client.Database("test").Collection("logs")

	data := models.Logger{Category: category, StatusCode: statusCode, ActionCode: actionCode, Message: message, Timestamp: time.Now()}

	_, err := collection.InsertOne(context.Background(), data)

	if err != nil {
		log.Print(err)
	}

}
