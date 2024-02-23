package mysql

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db/model"
)

var (
	userTable = os.Getenv("MYSQL_USERS_TABLE")
	userID    = os.Getenv("MYSQL_USERS_ID")
	userPass  = os.Getenv("MYSQL_USERS_PASSWORD")
)

func (s *Mysql) UserGet(id string) (*model.User, error) {
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s = ?", userTable, userID)
	row := s.DB.QueryRow(query, id)

	var user model.User
	if err := row.Scan(&user.ID, &user.Password, &user.Create_at, &user.Update_at); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // nil,nilはよくないかな？
		}
		return nil, fmt.Errorf("error scan: %w", err)
	}
	return &user, nil
}

func (s *Mysql) UserCreate(id string, password string) error {
	query := fmt.Sprintf("INSERT INTO %s(%s, %s) VALUES(?,?)", userTable, userID, userPass)
	insert, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := insert.Exec(id, password); err != nil {
		return fmt.Errorf("error insert: %w", err)
	}
	return nil
}