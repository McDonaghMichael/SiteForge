package routes

import (
	"backend/methods"
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

func FetchTheme(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		themesCollection := client.Database(methods.GetDatabaseName()).Collection("themes")
		settingsCollection := client.Database(methods.GetDatabaseName()).Collection("settings")

		var settings bson.M
		err := settingsCollection.FindOne(context.TODO(), bson.D{}).Decode(&settings)
		if err != nil {
			http.Error(w, "Failed to fetch settings", http.StatusInternalServerError)
			log.Println("Error fetching settings:", err)
			methods.CreateLog(client, models.THEME_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())
			return
		}

		themeID, _ := bson.ObjectIDFromHex(settings["default_theme"].(string))

		if err != nil {
			http.Error(w, "Invalid theme ID format", http.StatusBadRequest)
			log.Println("Invalid ObjectID:", err)
			methods.CreateLog(client, models.THEME_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())
			return
		}

		var theme bson.M
		err = themesCollection.FindOne(context.TODO(), bson.M{"_id": themeID}).Decode(&theme)
		if err != nil {
			http.Error(w, "Theme not found", http.StatusNotFound)
			log.Println("Error fetching theme:", err)
			methods.CreateLog(client, models.THEME_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(theme)
	}
}

func FetchThemes(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		coll := client.Database(methods.GetDatabaseName()).Collection("themes")

		cursor, err := coll.Find(context.TODO(), bson.D{})
		if err != nil {
			methods.CreateLog(client, models.THEME_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())
			panic(err)
		}

		var results []models.Theme
		if err = cursor.All(context.TODO(), &results); err != nil {
			methods.CreateLog(client, models.THEME_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())
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

		collection := client.Database(methods.GetDatabaseName()).Collection("themes")

		filter := bson.D{{"_id", id}}

		var result models.Theme
		err := collection.FindOne(context.TODO(), filter).Decode(&result)

		if err != nil {
			log.Print(err)
			methods.CreateLog(client, models.THEME_CATEGORY, models.FAIL_STATUS, models.FETCH, err.Error())
		} else {

			response := map[string]interface{}{
				"id":                id.Hex(),
				"name":              result.Name,
				"author":            result.Author,
				"description":       result.Description,
				"featured_image":    result.FeaturedImage,
				"website":           result.Website,
				"github":            result.Github,
				"css":               result.CSS,
				"navbar":            result.Navbar,
				"footer":            result.Footer,
				"standard_page":     result.StandardPage,
				"not_found_page":    result.NotFoundPage,
				"x_profile":         result.XProfile,
				"facebook_profile":  result.FacebookProfile,
				"instagram_profile": result.InstagramProfile,
				"linkedin_profile":  result.LinkedInProfile,
				"github_profile":    result.GithubProfile,
				"tiktok_profile":    result.TikTokProfile,
			}

			json.NewEncoder(w).Encode(response)
			methods.CreateLog(client, models.THEME_CATEGORY, models.SUCCESS_STATUS, models.FETCH, "Fetched theme with name: "+result.Name)

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
			methods.CreateLog(client, models.THEME_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			return
		}

		collection := client.Database(methods.GetDatabaseName()).Collection("themes")
		res, err := collection.InsertOne(context.TODO(), bson.M{
			"name":              newTheme.Name,
			"author":            newTheme.Author,
			"description":       newTheme.Description,
			"featured_image":    newTheme.FeaturedImage,
			"website":           newTheme.Website,
			"github":            newTheme.Github,
			"navbar":            newTheme.Navbar,
			"footer":            newTheme.Footer,
			"css":               newTheme.CSS,
			"standard_page":     newTheme.StandardPage,
			"not_found_page":    newTheme.NotFoundPage,
			"x_profile":         newTheme.XProfile,
			"facebook_profile":  newTheme.FacebookProfile,
			"instagram_profile": newTheme.InstagramProfile,
			"linkedin_profile":  newTheme.LinkedInProfile,
			"github_profile":    newTheme.GithubProfile,
			"tiktok_profile":    newTheme.TikTokProfile,
		})
		if err != nil {
			log.Println("MongoDB Insert Error:", err)
			http.Error(w, "Failed to create theme", http.StatusInternalServerError)
			methods.CreateLog(client, models.THEME_CATEGORY, models.FAIL_STATUS, models.CREATED, err.Error())
			return
		}

		response := map[string]interface{}{
			"message": "Theme created successfully",
			"userID":  res.InsertedID,
			"user":    newTheme,
		}
		methods.CreateLog(client, models.THEME_CATEGORY, models.SUCCESS_STATUS, models.CREATED, "Imported theme "+newTheme.Name)
		json.NewEncoder(w).Encode(response)
	}
}
