package mysql

import (
	"database/sql"
	"fmt"
	"os"
	"time"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db/model"
)

var (
	dateRecordTable     = os.Getenv("MYSQL_DATE_RECORD_TABLE")
	dateRecordID        = os.Getenv("MYSQL_DATE_RECORD_ID")
	dateRecordUserID    = os.Getenv("MYSQL_USERS_ID")
	dateRecordDate      = os.Getenv("MYSQL_DATE_RECORD_DATE")
	dateRecordHappiness = os.Getenv("MYSQL_DATE_RECORD_HAPPINESS")
)

func (s *Mysql) DateRecordsGet(userID string, startDate time.Time, endDate time.Time) ([]*model.DateRecord, error) {
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s = ? AND %s >= ? AND %s <= ? ORDER BY %s ASC", dateRecordTable, dateRecordUserID, dateRecordDate, dateRecordDate, dateRecordDate)
	rows, err := s.DB.Query(query, userID, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("error query: %w", err)
	}
	defer rows.Close()

	var dateRecords []*model.DateRecord
	for rows.Next() {
		var dateRecord model.DateRecord
		if err := rows.Scan(&dateRecord.ID, &dateRecord.UserID, &dateRecord.Date, &dateRecord.Happiness, &dateRecord.Create_at, &dateRecord.Update_at); err != nil {
			return nil, fmt.Errorf("error scan: %w", err)
		}
		dateRecords = append(dateRecords, &dateRecord)
	}
	return dateRecords, nil
}

func (s *Mysql) DateRecordGetByID(id string, userID string) (*model.DateRecord, error) {
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s = ? AND %s = ?", dateRecordTable, dateRecordID, dateRecordUserID)
	row := s.DB.QueryRow(query, id, userID)

	var dateRecord model.DateRecord
	if err := row.Scan(&dateRecord.ID, &dateRecord.UserID, &dateRecord.Date, &dateRecord.Happiness, &dateRecord.Create_at, &dateRecord.Update_at); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("error scan: %w", err)
	}
	return &dateRecord, nil
}

func (s *Mysql) DateRecordCreate(userID string, date time.Time, happiness int) error {
	query := fmt.Sprintf("INSERT INTO %s(%s, %s, %s) VALUES(?,?,?)", dateRecordTable, dateRecordUserID, dateRecordDate, dateRecordHappiness)
	insert, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := insert.Exec(userID, date, happiness); err != nil {
		return fmt.Errorf("error insert: %w", err)
	}
	return nil
}

func (s *Mysql) DateRecordUpdate(id string, happiness int) error {
	query := fmt.Sprintf("UPDATE %s SET %s = ? WHERE %s = ?", dateRecordTable, dateRecordHappiness, dateRecordUserID)
	update, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := update.Exec(happiness, id); err != nil {
		return fmt.Errorf("error update: %w", err)
	}
	return nil
}

func (s *Mysql) DateRecordDelete(id string) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE %s = ?", dateRecordTable, dateRecordUserID)
	delete, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := delete.Exec(id); err != nil {
		return fmt.Errorf("error delete: %w", err)
	}
	return nil
}
