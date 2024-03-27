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

func (s *Mysql) CreateUserTable() error {
	query := fmt.Sprintf("CREATE TABLE IF NOT EXISTS %s (%s varchar(32) NOT NULL, %s varchar(64) NOT NULL, %s DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, %s DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (%s));",
		userTable, userID, userPass, createAt, updateAt, userID)
	if _, err := s.DB.Exec(query); err != nil {
		return fmt.Errorf("error exec: %w", err)
	}
	return nil
}

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

func (s *Mysql) UserCreate(id string, password string) (int64, error) {
	query := fmt.Sprintf("INSERT INTO %s(%s, %s) VALUES(?,?)", userTable, userID, userPass)
	insert, err := s.DB.Prepare(query)
	if err != nil {
		return -1, fmt.Errorf("error prepare: %w", err)
	}

	r, err := insert.Exec(id, password)
	if err != nil {
		return -1, fmt.Errorf("error insert: %w", err)
	}

	insertID, err := r.LastInsertId()
	if err != nil {
		return -1, nil
	}

	return insertID, nil
}
