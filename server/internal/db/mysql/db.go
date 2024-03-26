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

// TODO: -> CREATE_AT, UPDATE_AT
var (
	createAt = os.Getenv("MYSQL_CREATEDAT")
	updateAt = os.Getenv("MYSQL_UPDATEDAT")
)

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

func (s *Mysql) TouchTables() error {
	if err := s.CreateUserTable(); err != nil {
		return fmt.Errorf("error create user table: %w", err)
	}
	if err := s.CreateMachineTable(); err != nil {
		return fmt.Errorf("error create machine table: %w", err)
	}
	if err := s.CreateDateRecordTable(); err != nil {
		return fmt.Errorf("error create date record table: %w", err)
	}
	if err := s.CreateTimeRecordTable(); err != nil {
		return fmt.Errorf("error create time record table: %w", err)
	}
	if err := s.CreateRPMRecordTable(); err != nil {
		return fmt.Errorf("error create rpm record table: %w", err)
	}
	return nil
}
