package models

import "go.mongodb.org/mongo-driver/v2/bson"

type Theme struct {
	ID               bson.ObjectID `bson:"_id" json:"id,omitempty"`
	Name             string        `json:"name"`
	Author           string        `json:"author"`
	Description      string        `json:"description"`
	FeaturedImage    string        `json:"featured_image"`
	Github           string        `json:"github"`
	Website          string        `json:"website"`
	CSS              string        `json:"css"`
	Navbar           string        `json:"navbar"`
	Footer           string        `json:"footer"`
	StandardPage     string        `json:"standard_page"`
	NotFoundPage     string        `json:"not_found_page"`
	XProfile         string        `json:"x_profile"`
	FacebookProfile  string        `bson:"facebook_profile"`
	InstagramProfile string        `bson:"instagram_profile"`
	TikTokProfile    string        `bson:"tiktok_profile"`
	GithubProfile    string        `bson:"github_profile"`
	LinkedInProfile  string        `bson:"linkedin_profile"`
}
