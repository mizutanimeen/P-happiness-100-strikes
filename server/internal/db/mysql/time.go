package mysql

import (
	"database/sql"
	"fmt"
	"os"
	"time"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db/model"
)

var (
	timeRecordTable           = os.Getenv("MYSQL_TIME_RECORD_TABLE")
	timeRecordID              = os.Getenv("MYSQL_TIME_RECORD_ID")
	timeRecordUserID          = os.Getenv("MYSQL_USERS_ID")
	timeRecordTime            = os.Getenv("MYSQL_TIME_RECORD_TIME")
	timeRecordInvestmentMoney = os.Getenv("MYSQL_TIME_RECORD_INVESTMENT_MONEY")
	timeRecordRecoveryMoney   = os.Getenv("MYSQL_TIME_RECORD_RECOVERY_MONEY")
)

func (s *Mysql) TimeRecordGet(userID string, startDate time.Time, endDate time.Time) ([]*model.TimeRecord, error) {
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s = ? AND %s >= ? AND %s <= ?", timeRecordTable, timeRecordUserID, timeRecordTime, timeRecordTime)
	rows, err := s.DB.Query(query, userID, startDate, endDate)
	if err != nil {
		return nil, fmt.Errorf("error query: %w", err)
	}
	defer rows.Close()

	var timeRecords []*model.TimeRecord
	for rows.Next() {
		var timeRecord model.TimeRecord
		if err := rows.Scan(&timeRecord.ID, &timeRecord.UserID, &timeRecord.Time, &timeRecord.InvestmentMoney, &timeRecord.RecoveryMoney, &timeRecord.Create_at, &timeRecord.Update_at); err != nil {
			return nil, fmt.Errorf("error scan: %w", err)
		}
		timeRecords = append(timeRecords, &timeRecord)
	}
	return timeRecords, nil
}

func (s *Mysql) TimeRecordGetByID(id string, userID string) (*model.TimeRecord, error) {
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s = ? AND %s = ?", timeRecordTable, timeRecordID, timeRecordUserID)
	row := s.DB.QueryRow(query, id, userID)

	var timeRecord model.TimeRecord
	if err := row.Scan(&timeRecord.ID, &timeRecord.UserID, &timeRecord.Time, &timeRecord.InvestmentMoney, &timeRecord.RecoveryMoney, &timeRecord.Create_at, &timeRecord.Update_at); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}

		return nil, fmt.Errorf("error scan: %w", err)
	}
	return &timeRecord, nil
}

func (s *Mysql) TimeRecordCreate(userID string, time time.Time, investmentMoney int, recoveryMoney int) error {
	query := fmt.Sprintf("INSERT INTO %s(%s, %s, %s, %s) VALUES(?,?,?,?)", timeRecordTable, timeRecordUserID, timeRecordTime, timeRecordInvestmentMoney, timeRecordRecoveryMoney)
	insert, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := insert.Exec(userID, time, investmentMoney, recoveryMoney); err != nil {
		return fmt.Errorf("error insert: %w", err)
	}
	return nil
}

func (s *Mysql) TimeRecordUpdate(id string, time time.Time, investmentMoney int, recoveryMoney int) error {
	query := fmt.Sprintf("UPDATE %s SET %s=?, %s=?, %s=? WHERE %s=?", timeRecordTable, timeRecordTime, timeRecordInvestmentMoney, timeRecordRecoveryMoney, timeRecordID)
	update, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := update.Exec(time, investmentMoney, recoveryMoney, id); err != nil {
		return fmt.Errorf("error update: %w", err)
	}
	return nil
}

func (s *Mysql) TimeRecordDelete(id string) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE %s=?", timeRecordTable, timeRecordID)
	delete, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}

	if _, err := delete.Exec(id); err != nil {
		return fmt.Errorf("error delete: %w", err)
	}
	return nil
}