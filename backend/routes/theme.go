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

func CreateTheme(client *mongo.Client, name string, description string, navbar string, footer string, css string, standardPage string) {
	collection := client.Database("test").Collection("themes")

	theme := models.Theme{Name: name, Description: description, Navbar: navbar, Footer: footer, CSS: css, StandardPage: standardPage}

	res, err := collection.InsertOne(context.Background(), theme)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(res.InsertedID)
}

func FetchTheme(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		coll := client.Database("test").Collection("themes")

		cursor, err := coll.Find(context.TODO(), bson.D{})
		if err != nil {
			panic(err)
		}

		var results []models.Theme
		if err = cursor.All(context.TODO(), &results); err != nil {
			panic(err)
		}

		json.NewEncoder(w).Encode(results)
	}
}

func FetchThemeById(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")

		vars := mux.Vars(r)
		id, _ := bson.ObjectIDFromHex(vars["id"])

		collection := client.Database("test").Collection("themes")

		filter := bson.D{{"_id", id}}

		var result models.Theme
		err := collection.FindOne(context.TODO(), filter).Decode(&result)

		if err != nil {
			log.Fatal(err)
		} else {

			response := map[string]interface{}{
				"id":             id.Hex(),
				"name":           result.Name,
				"description":    result.Description,
				"css":            result.CSS,
				"navbar":         result.Navbar,
				"footer":         result.Footer,
				"standard_page":  result.StandardPage,
				"not_found_page": result.NotFoundPage,
			}

			json.NewEncoder(w).Encode(response)

		}
	}
}

func ImportTheme(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		var newTheme models.Theme
		err := json.NewDecoder(r.Body).Decode(&newTheme)
		if err != nil {
			http.Error(w, "Invalid JSON request", http.StatusBadRequest)
			fmt.Println("Error decoding JSON:", err)
			return
		}
		fmt.Printf("Received Theme: %+v\n", newTheme)

		collection := client.Database("test").Collection("themes")
		res, err := collection.InsertOne(context.TODO(), bson.M{
			"name":           newTheme.Name,
			"description":    newTheme.Description,
			"navbar":         newTheme.Navbar,
			"footer":         newTheme.Footer,
			"css":            newTheme.CSS,
			"standard_page":  newTheme.StandardPage,
			"not_found_page": newTheme.NotFoundPage,
		})
		if err != nil {
			log.Println("MongoDB Insert Error:", err)
			http.Error(w, "Failed to create theme", http.StatusInternalServerError)
			return
		}

		response := map[string]interface{}{
			"message": "Theme created successfully",
			"userID":  res.InsertedID,
			"user":    newTheme,
		}
		json.NewEncoder(w).Encode(response)
	}
}
