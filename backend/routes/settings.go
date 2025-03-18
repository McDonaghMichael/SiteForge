package routes

import (
	"backend/methods"
	"backend/models"
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"log"
	"net/http"
)

func CreateSettings(client *mongo.Client) {
	themeCollection := client.Database("test").Collection("themes")
	settingsCollection := client.Database("test").Collection("settings")

	var firstTheme models.Theme
	err := themeCollection.FindOne(context.Background(), bson.M{}).Decode(&firstTheme)

	if err != nil {
		log.Print("Error fetching first theme:", err)
	}

	settings := bson.M{
		"site_title":    "Example Site Title",
		"default_theme": firstTheme.ID.Hex(),
		"navbar_items": []models.NavbarItems{
			models.NavbarItems{
				Page: "test",
			},
		},
	}

	res, err := settingsCollection.InsertOne(context.Background(), settings)
	if err != nil {
		log.Print(err)
	}

	fmt.Println("Settings created with ID:", res.InsertedID)
}

func FetchSettings(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		coll := client.Database("test").Collection("settings")

		var result bson.M
		err := coll.FindOne(context.TODO(), bson.D{}).Decode(&result)

		if err != nil {
			log.Print(err)
		}

		json.NewEncoder(w).Encode(result)
	}
}

func EditSettings(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		collection := client.Database("test").Collection("settings")

		var settings map[string]interface{}
		errt := json.NewDecoder(r.Body).Decode(&settings)
		if errt != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("Error decoding JSON:", errt)
			return
		}

		update := bson.D{{"$set", bson.D{
			{"site_title", settings["site_title"]},
			{"updated_date", settings["updated_date"]},
			{"default_theme", settings["default_theme"]},
			{"navbar_items", settings["navbar_items"]},
		}}}

		filter := bson.D{}

		_, err := collection.UpdateOne(context.TODO(), filter, update)

		methods.CreateLog(client, models.SETTINGS_CATEGORY, models.SUCCESS_STATUS, models.UPDATED, "Updated settings")

		if err != nil {
			log.Print(err)
		}
	}
}
