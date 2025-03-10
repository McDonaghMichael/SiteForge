package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Page struct {
	ID              bson.ObjectID `bson:"_id" json:"id,omitempty"`
	Title           string        `json:"title"`
	WordCount       int           `json:"word_count"`
	Html            string        `json:"html"`
	CSS             string        `json:"css"`
	Slug            string        `json:"slug"`
	FocusKeyword    string        `json:"focus_keyword"`
	Status          int           `json:"status"`
	Author          string        `json:"author"`
	CreatedDate     string        `json:"created_date"`
	UpdatedDate     string        `json:"updated_date"`
	FeaturedImage   string        `json:"featured_image"`
	MetaTitle       string        `json:"meta_title"`
	MetaDescription string        `json:"meta_description"`
	MetaKeywords    string        `json:"meta_keywords"`
	Type            int           `json:"type"`
}
