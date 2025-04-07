package models

import (
	"time"
)

const (
	FAIL_STATUS = 0

	SUCCESS_STATUS = 1

	PAGE_CATEGORY = 0

	POST_CATEGORY = 1

	THEME_CATEGORY = 2

	ACCOUNT_CATEGORY  = 3
	SETTINGS_CATEGORY = 4

	DELETED = 0

	UPDATED = 1

	CREATED = 2

	FETCH = 3
)

type Logger struct {
	Category   int       `json:"category"`
	StatusCode int       `json:"status_code"`
	ActionCode int       `json:"action_code"`
	Message    string    `json:"message"`
	Timestamp  time.Time `json:"timestamp"`
}
