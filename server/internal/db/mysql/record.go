package mysql

import (
	"database/sql"
	"fmt"
	"os"
	"time"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db/model"
)

var (
	dayRecordTable     = os.Getenv("MYSQL_DAY_RECORD_TABLE")
	dayRecordUserID    = os.Getenv("MYSQL_USERS_ID")
	dayRecordDate      = os.Getenv("MYSQL_DAY_RECORD_DATE")
	dayRecordHappiness = os.Getenv("MYSQL_DAY_RECORD_HAPPINESS")
)

func (s *Mysql) DayRecordGet(userID string, startDate time.Time, endDate time.Time) ([]*model.DayRecord, error) {
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s = ? AND %s >= ? AND %s <= ?", dayRecordTable, dayRecordUserID, dayRecordDate, dayRecordDate)
	rows, err := s.DB.Query(query, userID, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("error query: %w", err)
	}
	defer rows.Close()

	var dayRecords []*model.DayRecord
	for rows.Next() {
		var dayRecord model.DayRecord
		if err := rows.Scan(&dayRecord.ID, &dayRecord.UserID, &dayRecord.Date, &dayRecord.Happiness, &dayRecord.Create_at, &dayRecord.Update_at); err != nil {
			return nil, fmt.Errorf("error scan: %w", err)
		}
		dayRecords = append(dayRecords, &dayRecord)
	}
	return dayRecords, nil
}

func (s *Mysql) DayRecordGetOne(userID string, date time.Time) (*model.DayRecord, error) {
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s = ? AND %s = ?", dayRecordTable, dayRecordUserID, dayRecordDate)
	row := s.DB.QueryRow(query, userID, date)

	var dayRecord model.DayRecord
	if err := row.Scan(&dayRecord.ID, &dayRecord.UserID, &dayRecord.Date, &dayRecord.Happiness, &dayRecord.Create_at, &dayRecord.Update_at); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("error scan: %w", err)
	}
	return &dayRecord, nil
}

func (s *Mysql) DayRecordCreate(userID string, date time.Time, happiness int) error {
	query := fmt.Sprintf("INSERT INTO %s(%s, %s, %s) VALUES(?,?,?)", dayRecordTable, dayRecordUserID, dayRecordDate, dayRecordHappiness)
	insert, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := insert.Exec(userID, date, happiness); err != nil {
		return fmt.Errorf("error insert: %w", err)
	}
	return nil
}

func (s *Mysql) DayRecordUpdate(id string, happiness int) error {
	query := fmt.Sprintf("UPDATE %s SET %s = ? WHERE %s = ?", dayRecordTable, dayRecordHappiness, dayRecordUserID)
	update, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := update.Exec(happiness, id); err != nil {
		return fmt.Errorf("error update: %w", err)
	}
	return nil
}

func (s *Mysql) DayRecordDelete(id string) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE %s = ?", dayRecordTable, dayRecordUserID)
	delete, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := delete.Exec(id); err != nil {
		return fmt.Errorf("error delete: %w", err)
	}
	return nil
}
