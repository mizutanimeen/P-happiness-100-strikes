package mysql

import (
	"database/sql"
	"fmt"
	"os"
	"time"
)

type Mysql struct {
	DB *sql.DB
}

func New() (*Mysql, error) {
	user := os.Getenv("MYSQL_USER")
	pass := os.Getenv("MYSQL_PASSWORD")
	DBName := os.Getenv("MYSQL_DATABASE")
	IP := os.Getenv("MYSQL_IP")
	path := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8&parseTime=true", user, pass, IP, DBName)

	DB, err := sql.Open("mysql", path)
	if err != nil {
		return nil, fmt.Errorf("error DB open: %w", err)
	}

	if err := checkConnect(DB); err != nil {
		return nil, fmt.Errorf("error DB ping: %w", err)
	}

	fmt.Println("DB connected")

	return &Mysql{DB: DB}, nil
}

func checkConnect(DB *sql.DB) error {
	var err error
	for count := 100; count > 0; count-- {
		err = DB.Ping()
		if err != nil {
			time.Sleep(time.Second * 2)
		} else {
			break
		}
	}

	return err
}

func (s *Mysql) Close() error {
	return s.DB.Close()
}
