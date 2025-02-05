package models

type Page struct {
	Title           string `json:"title"`
	Html            string `json:"html"`
	Slug            string `json:"slug"`
	Status          int    `json:"status"`
	FeaturedImage   string `json:"featured-image"`
	MetaTitle       string `json:"meta_title"`
	MetaDescription string `json:"meta_description"`
	MetaKeywords    string `json:"meta_keywords"`
}
