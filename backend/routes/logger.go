package routes

import (
	"backend/methods"
	"context"
	"encoding/json"
	"github.com/shirou/gopsutil/mem"
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

func FetchMemoryUsage(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		v, err := mem.VirtualMemory()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		response := map[string]interface{}{
			"total":       v.Total / 1024 / 1024,
			"free":        v.Free / 1024 / 1024,
			"usedPercent": v.UsedPercent,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
