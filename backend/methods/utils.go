package methods

import (
	"golang.org/x/crypto/bcrypt"
	"os"
)

// BCRYPT Hash Password Credits: https://medium.com/@rnp0728/secure-password-hashing-in-go-a-comprehensive-guide-5500e19e7c1f

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func VerifyPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func GetDatabaseName() string {
	return os.Getenv("MONGO_DATABASE_NAME")
}
