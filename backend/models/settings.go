package models

type NavbarItems struct {
	Page string `json:"page_id"`
}
type Settings struct {
	SiteTitle    string        `json:"site_title"`
	DefaultTheme string        `json:"default_theme"`
	NavbarItems  []NavbarItems `json:"navbar_items"`
}
