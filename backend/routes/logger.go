package routes

import (
	"backend/methods"
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"log"
	"net/http"
)

func FetchLogs(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		coll := client.Database(methods.GetDatabaseName()).Collection("logs")

		cursor, err := coll.Find(context.TODO(), bson.D{})
		if err != nil {

			log.Print(err)
		}

		var results []bson.M
		if err = cursor.All(context.TODO(), &results); err != nil {
			log.Print(err)
		}

		json.NewEncoder(w).Encode(results)
	}
}
