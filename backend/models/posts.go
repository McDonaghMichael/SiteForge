package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Post struct {
	ID              bson.ObjectID `bson:"_id" json:"id,omitempty"`
	Author          string        `json:"author"`
	CreatedDate     string        `json:"created_date"`
	UpdatedDate     string        `json:"updated_date"`
	Title           string        `json:"title"`
	Html            string        `json:"html"`
	Slug            string        `json:"slug"`
	Status          int           `json:"status"`
	FeaturedImage   string        `json:"featured_image"`
	MetaTitle       string        `json:"meta_title"`
	MetaDescription string        `json:"meta_description"`
	MetaKeywords    string        `json:"meta_keywords"`
}
