package db

import (
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db/model"
)

type DB interface {
	UserGet(id string) (*model.User, error)
	UserCreate(id string, password string) error
	DayRecordGet(userID string, startDate time.Time, endDate time.Time) ([]*model.DayRecord, error)
	DayRecordGetOne(userID string, date time.Time) (*model.DayRecord, error)
	DayRecordCreate(userID string, date time.Time, happiness int) error
	DayRecordUpdate(id string, happiness int) error
	DayRecordDelete(id string) error
	Close() error
}
