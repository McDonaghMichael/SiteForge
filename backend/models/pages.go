package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Page struct {
	ID              bson.ObjectID `bson:"_id" json:"id,omitempty"`
	Title           string        `json:"title"`
	Html            string        `json:"html"`
	CSS             string        `json:"css"`
	Slug            string        `json:"slug"`
	Status          int           `json:"status"`
	Date            string        `json:"date"`
	CreatedBy       string        `json:"created_by"`
	FeaturedImage   string        `json:"featured-image"`
	MetaTitle       string        `json:"meta_title"`
	MetaDescription string        `json:"meta_description"`
	MetaKeywords    string        `json:"meta_keywords"`
	Type            int           `json:"type"`
}
