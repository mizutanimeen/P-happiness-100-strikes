package api

import (
	"fmt"
	"net/http"
	"time"
)

const (
	START_DATE_QUERY = "start"
	END_DATE_QUERY   = "end"
)

func getStartEndDayQuery(r *http.Request) (time.Time, time.Time, int, error) {
	startDate := r.URL.Query().Get(START_DATE_QUERY)
	endDate := r.URL.Query().Get(END_DATE_QUERY)

	// 日付を解析
	startTime, err := time.Parse("2006-01-02", startDate)
	if err != nil {
		return time.Time{}, time.Time{}, http.StatusBadRequest, fmt.Errorf("invalid start date")
	}

	endTime, err := time.Parse("2006-01-02", endDate)
	if err != nil {
		return time.Time{}, time.Time{}, http.StatusBadRequest, fmt.Errorf("invalid end date")
	}

	return startTime, endTime, 0, nil
}
