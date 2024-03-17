package mysql

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/mizutanimeen/P-happiness-100-strikes/internal/db/model"
)

var (
	MYSQL_RPM_RECORD_TABLE            = os.Getenv("MYSQL_RPM_RECORD_TABLE")
	MYSQL_RPM_RECORD_ID               = os.Getenv("MYSQL_RPM_RECORD_ID")
	MYSQL_RPM_TIME_RECORD_ID          = os.Getenv("MYSQL_TIME_RECORD_ID")
	MYSQL_RPM_USER_ID                 = os.Getenv("MYSQL_USERS_ID")
	MYSQL_RPM_RECORD_INVESTMENT_MONEY = os.Getenv("MYSQL_RPM_RECORD_INVESTMENT_MONEY")
	MYSQL_RPM_RECORD_INVESTMENT_BALL  = os.Getenv("MYSQL_RPM_RECORD_INVESTMENT_BALL")
	MYSQL_RPM_RECORD_START_RPM        = os.Getenv("MYSQL_RPM_RECORD_START_RPM")
	MYSQL_RPM_RECORD_END_RPM          = os.Getenv("MYSQL_RPM_RECORD_END_RPM")
	MYSQL_RPM_MACHINE_ID              = os.Getenv("MYSQL_MACHINE_ID")
)

func (s *Mysql) RPMRecordsGet(userID, timeRecordID string) ([]*model.RPMRecord, error) {
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s = ? AND %s = ?", MYSQL_RPM_RECORD_TABLE, MYSQL_RPM_USER_ID, MYSQL_RPM_TIME_RECORD_ID)
	rows, err := s.DB.Query(query, userID, timeRecordID)
	if err != nil {
		return nil, fmt.Errorf("error query: %w", err)
	}
	defer rows.Close()

	var rpmRecords []*model.RPMRecord
	for rows.Next() {
		var rpmRecord model.RPMRecord
		if err := rows.Scan(&rpmRecord.ID, &rpmRecord.TimeRecordID, &rpmRecord.UserID, &rpmRecord.InvestmentMoney, &rpmRecord.InvestmentBall, &rpmRecord.StartRPM, &rpmRecord.EndRPM, &rpmRecord.MachineID, &rpmRecord.Create_at, &rpmRecord.Update_at); err != nil {
			if err == sql.ErrNoRows {
				return nil, nil
			}
			return nil, fmt.Errorf("error scan: %w", err)
		}
		rpmRecords = append(rpmRecords, &rpmRecord)
	}
	return rpmRecords, nil
}

func (s *Mysql) RPMRecordCreate(userID string, timeRecordID string, investmentMoney int, investmentBall int, startRPM int, endRPM int, machineID int) error {
	query := fmt.Sprintf("INSERT INTO %s(%s, %s, %s, %s, %s, %s, %s) VALUES(?,?,?,?,?,?,?)",
		MYSQL_RPM_RECORD_TABLE, MYSQL_RPM_USER_ID, MYSQL_RPM_TIME_RECORD_ID, MYSQL_RPM_RECORD_INVESTMENT_MONEY, MYSQL_RPM_RECORD_INVESTMENT_BALL,
		MYSQL_RPM_RECORD_START_RPM, MYSQL_RPM_RECORD_END_RPM, MYSQL_RPM_MACHINE_ID)
	insert, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}
	_, err = insert.Exec(userID, timeRecordID, investmentMoney, investmentBall, startRPM, endRPM, machineID)
	if err != nil {
		return fmt.Errorf("error exec: %w", err)
	}
	return nil
}

func (s *Mysql) RPMRecordUpdate(userID string, timeRecordID string, id string, investmentMoney int, investmentBall int, startRPM int, endRPM int, machineID int) error {
	query := fmt.Sprintf("UPDATE %s SET %s=?, %s=?, %s=?, %s=?, %s=? WHERE %s=? AND %s=? AND %s=?",
		MYSQL_RPM_RECORD_TABLE, MYSQL_RPM_RECORD_INVESTMENT_MONEY, MYSQL_RPM_RECORD_INVESTMENT_BALL,
		MYSQL_RPM_RECORD_START_RPM, MYSQL_RPM_RECORD_END_RPM, MYSQL_RPM_MACHINE_ID,
		MYSQL_RPM_USER_ID, MYSQL_RPM_TIME_RECORD_ID, MYSQL_RPM_RECORD_ID)
	update, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}
	_, err = update.Exec(investmentMoney, investmentBall, startRPM, endRPM, machineID, userID, timeRecordID, id)
	if err != nil {
		return fmt.Errorf("error exec: %w", err)
	}
	return nil
}

func (s *Mysql) RPMRecordDelete(userID string, timeRecordID string, id string) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE %s = ? AND %s=? AND %s=?", MYSQL_RPM_RECORD_TABLE, MYSQL_RPM_USER_ID, MYSQL_RPM_TIME_RECORD_ID, MYSQL_RPM_RECORD_ID)
	delete, err := s.DB.Prepare(query)
	if err != nil {
		return fmt.Errorf("error prepare: %w", err)
	}
	_, err = delete.Exec(userID, timeRecordID, id)
	if err != nil {
		return fmt.Errorf("error exec: %w", err)
	}
	return nil
}
