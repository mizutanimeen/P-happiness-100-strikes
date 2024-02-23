package app

import (
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db"
	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db/mysql"
	"github.com/mizutanimeen/P-happiness-100-strikes/internal/session"
)

type App struct {
	DB      db.DB
	Session *session.Session
}

func New() (*App, error) {
	DB, err := mysql.New()
	if err != nil {
		return nil, err
	}

	return &App{
		DB:      DB,
		Session: session.New(),
	}, nil
}

func (a *App) Close() error {
	err1 := a.DB.Close()
	err2 := a.Session.Client.Close()
	return fmt.Errorf("DB.Close:%w\nSession.Client.Close:%w", err1, err2)
}
