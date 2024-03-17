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
	DateRecordCreate(userID string, date time.Time, happiness int) error
	DateRecordUpdate(userID string, id string, happiness int) error
	DateRecordDelete(userID, id string) error

	TimeRecordsGet(userID string, startDate time.Time, endDate time.Time) ([]*model.TimeRecord, error)
	TimeRecordGetByID(userID, id string) (*model.TimeRecord, error)
	TimeRecordCreate(userID string, time time.Time, investmentMoney int, recoveryMoney int) (int64, error)
	TimeRecordUpdate(userID string, id string, time time.Time, investmentMoney int, recoveryMoney int) error
	TimeRecordDelete(userID, id string) error

	MachinesGet(userID string) ([]*model.Machine, error)
	MachineGetByID(userID, id string) (*model.Machine, error)
	MachineCreate(userID string, name string, rate int) (int64, error)
	MachineUpdate(userID string, id string, name string, rate int) error
	MachineDelete(userID string, id string) error

	RPMRecordsGet(userID, timeRecordID string) ([]*model.RPMRecord, error)
	RPMRecordCreate(userID string, timeRecordID string, investmentMoney int, investmentBall int, startRPM int, endRPM int, machineID int) error
	RPMRecordUpdate(userID string, timeRecordID string, id string, investmentMoney int, investmentBall int, startRPM int, endRPM int, machineID int) error
	RPMRecordDelete(userID string, timeRecordID string, id string) error

	Close() error
}
