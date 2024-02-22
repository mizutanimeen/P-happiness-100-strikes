package db

import (
	"database/sql"
	"fmt"
	"os"
	"time"
)

type User struct {
	ID        string
	Password  string
	Create_at time.Time
	Update_at time.Time
}

var (
	userTable = os.Getenv("MYSQL_USERS_TABLE")
	userID    = os.Getenv("MYSQL_USERS_ID")
	userPass  = os.Getenv("MYSQL_USERS_PASSWORD")
)

func UserGet(DB *sql.DB, id string) (*User, error) {
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s = ?", userTable, userID)
	row := DB.QueryRow(query, id)

	var user User
	if err := row.Scan(&user.ID, &user.Password, &user.Create_at, &user.Update_at); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // nil,nilはよくないかな？
		}
		return nil, fmt.Errorf("error scan: %w", err)
	}
	return &user, nil
}

func UserCreate(DB *sql.DB, id string, password string) error {
	query := fmt.Sprintf("INSERT INTO %s(%s, %s) VALUES(?,?)", userTable, userID, userPass)
	insert, err := DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := insert.Exec(id, password); err != nil {
		return fmt.Errorf("error insert: %w", err)
	}
	return nil
}
