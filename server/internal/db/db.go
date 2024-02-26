package db

import (
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db/model"
)

type DB interface {
	UserGet(id string) (*model.User, error)
	UserCreate(id string, password string) error

	DateRecordsGet(userID string, startDate time.Time, endDate time.Time) ([]*model.DateRecord, error)
	DateRecordGetByID(id string, userID string) (*model.DateRecord, error)
	DateRecordCreate(userID string, date time.Time, happiness int) error
	DateRecordUpdate(id string, happiness int) error
	DateRecordDelete(id string) error

	TimeRecordsGet(userID string, startDate time.Time, endDate time.Time) ([]*model.TimeRecord, error)
	TimeRecordGetByID(id string, userID string) (*model.TimeRecord, error)
	TimeRecordCreate(userID string, time time.Time, investmentMoney int, recoveryMoney int) (int64, error)
	TimeRecordUpdate(id string, time time.Time, investmentMoney int, recoveryMoney int) error
	TimeRecordDelete(id string) error

	MachinesGet(userID string) ([]*model.Machine, error)
	MachineGetByID(id string, userID string) (*model.Machine, error)
	MachineCreate(userID string, name string, rate int) (int64, error)
	MachineUpdate(id string, name string, rate int) error
	MachineDelete(id string) error

	RPMRecordsGet(timeRecordID string, userID string) ([]*model.RPMRecord, error)
	RPMRecordCreate(timeRecordID string, userID string, investmentMoney int, investmentBall int, startRPM int, endRPM int, machineID int) error
	RPMRecordUpdate(id string, timeRecordID string, userID string, investmentMoney int, investmentBall int, startRPM int, endRPM int, machineID int) error
	RPMRecordDelete(id string, timeRecordID string, userID string) error

	Close() error
}
