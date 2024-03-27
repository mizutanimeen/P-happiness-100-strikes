package mysql

import (
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

func (s *Mysql) CreateDateRecordTable() error {
	query := fmt.Sprintf("CREATE TABLE IF NOT EXISTS %s (%s int(16) AUTO_INCREMENT, %s varchar(32) NOT NULL, %s DATETIME NOT NULL, %s int(16) NOT NULL, %s DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, %s DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (%s), UNIQUE (%s, %s), FOREIGN KEY (%s) REFERENCES %s(%s));",
		dateRecordTable, dateRecordID, dateRecordUserID, dateRecordDate, dateRecordHappiness, createAt, updateAt, dateRecordID, dateRecordUserID, dateRecordDate, dateRecordUserID, userTable, userID)
	if _, err := s.DB.Exec(query); err != nil {
		return fmt.Errorf("error exec: %w", err)
	}

	return nil
}

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

func (s *Mysql) DateRecordUpdate(userID string, id string, happiness int) error {
	query := fmt.Sprintf("UPDATE %s SET %s = ? WHERE %s = ? AND %s = ?", dateRecordTable, dateRecordHappiness, dateRecordUserID, dateRecordID)
	update, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := update.Exec(happiness, userID, id); err != nil {
		return fmt.Errorf("error update: %w", err)
	}
	return nil
}

func (s *Mysql) DateRecordDelete(userID, id string) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE %s = ? AND %s = ?", dateRecordTable, dateRecordUserID, dateRecordID)
	delete, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := delete.Exec(userID, id); err != nil {
		return fmt.Errorf("error delete: %w", err)
	}
	return nil
}
