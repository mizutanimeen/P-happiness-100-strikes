import React, { useEffect } from "react";
import './css/body.css';
import { useState } from "react";
import { useSelector } from "../../redux/store";
import { useDispatch } from "react-redux";
import { formatDate } from '../../util/util';
import axios from 'axios';
import { DateRecordsGetRequest, DateRecordsGet } from '../../axios/date';
import { TimeRecordsGetRequest, TimeRecordsGet, TimeRecordGet } from '../../axios/time';
import { login, setTotalMoney } from "../../redux/slice/calendar";
import { TimeRecordsByMonthDiff, setTimeRecordsByMonthDiff, setTRCache, CacheByMonthDiff, DateRecordsByMonthDiff, setDateRecordsByMonthDiff, setDRCache } from "../../redux/slice/calendar";
import { Modal } from './../modal/modal';
import { CalendarDate } from './date';

export function getMonthDates(currentMonthDiff: number): Date[][] {
    const newDate = new Date();
    const month = newDate.getMonth() + currentMonthDiff;
    const year = newDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    // firstDOW = 0 When it is Sunday
    let currentDate = 0 - firstDay;
    // 5 weeks, 7 days
    const datesMap = new Array<Date[]>(5).fill([]).map(() => {
        return new Array<Date>(7).fill(newDate).map(() => {
            currentDate++;
            return new Date(year, month, currentDate);
        });
    });
    return datesMap;
}

export function CalendarBody(): JSX.Element {
    return <>
        <table className="calendarBody">
            <thead>
                <tr>
                    <th>日</th>
                    <th>月</th>
                    <th>火</th>
                    <th>水</th>
                    <th>木</th>
                    <th>金</th>
                    <th>土</th>
                </tr>
            </thead>
            <TableBody />
        </table>
    </ >
}

function TableBody(): JSX.Element {
    const dispatch = useDispatch();
    const call = React.useRef(false);
    const currentMonthDiff = useSelector((state) => state.monthDiff.value);

    const [currentMonthDates, setCurrentMonthDates] = useState<Date[][]>(getMonthDates(0));

    const [onModal, setOnModal] = useState<boolean>(false);

    // timeRecords
    const [timeRecords, setTimeRecords] = useState<TimeRecordsGet>();
    const cacheTR: CacheByMonthDiff = useSelector((state) => state.timeRecords.cache);
    const cacheTRData: TimeRecordsByMonthDiff = useSelector((state) => state.timeRecords.value);
    // dateRecords
    const [dateRecords, setDateRecords] = useState<DateRecordsGet>();
    const cacheDR: CacheByMonthDiff = useSelector((state) => state.dateRecords.cache);
    const cacheDRData: DateRecordsByMonthDiff = useSelector((state) => state.dateRecords.value);

    const dateRecordsGet = (start: string, end: string) => {
        return axios(DateRecordsGetRequest(start, end)).then((result) => {
            dispatch(login(true));
            setDateRecords(result.data);
        }).catch((error) => {
            if (error.response.status === 401) {
                dispatch(login(false));
            } else {
                console.log(error);
            }
        });
    }

    const timeRecordsGet = (start: string, end: string) => {
        return axios(TimeRecordsGetRequest(start, end)).then((result) => {
            dispatch(login(true));
            setTimeRecords(result.data);
        }).catch((error) => {
            if (error.response.status === 401) {
                dispatch(login(false));
            } else {
                console.log(error);
            }
        });
    };

    const recordsUpdate = async (start: string, end: string) => {
        const monthDiff: string = currentMonthDiff.toString();

        if (cacheTR[monthDiff] && cacheTRData[monthDiff]) {
            setTimeRecords(cacheTRData[monthDiff])
        } else {
            await timeRecordsGet(start, end);
        }

        if (cacheDR[monthDiff] && cacheDRData[monthDiff]) {
            setDateRecords(cacheDRData[monthDiff])
        } else {
            await dateRecordsGet(start, end);
        }
        call.current = false;
    }

    // 月が替わったら日付マップを更新、レコードを更新
    useEffect(() => {
        const dateMap = getMonthDates(currentMonthDiff)
        setCurrentMonthDates(dateMap)

        if (!call.current) {
            call.current = true;

            const start = formatDate(dateMap[0][0]);
            const end = formatDate(dateMap[4][6]);

            recordsUpdate(start, end);
        }
    }, [currentMonthDiff]);

    // happyのためにmodalが閉じたらレコードを更新
    useEffect(() => {
        if (!call.current && !onModal) {
            call.current = true;

            const start = formatDate(currentMonthDates[0][0]);
            const end = formatDate(currentMonthDates[4][6]);

            recordsUpdate(start, end);
        }
    }, [onModal]);

    const totalMoneyCount = () => {
        const currentMonth = currentMonthDates[2][3].getMonth();
        let totalMoney = 0;
        currentMonthDates.forEach((row: Date[]) => {
            row.forEach((date: Date) => {
                if (currentMonth !== date.getMonth()) {
                    return;
                }
                timeRecords?.[formatDate(date)]?.map((timeRecord: TimeRecordGet) => (
                    totalMoney += (timeRecord.recovery_money - timeRecord.investment_money)
                ))
            })
        })
        dispatch(setTotalMoney(totalMoney));
    }
    const totalMoney = async () => {
        await totalMoneyCount();
    }

    // タイムレコードが更新されたら合計金額を更新、タイムレコードをキャッシュ
    useEffect(() => {
        totalMoney();

        if (!cacheTR[currentMonthDiff.toString()] && timeRecords) {
            dispatch(setTimeRecordsByMonthDiff({ monthDiff: currentMonthDiff.toString(), data: timeRecords }));
            dispatch(setTRCache({ monthDiff: currentMonthDiff.toString(), data: true }));
        }
    }, [timeRecords])

    // 日付レコードが更新されたら日付レコードをキャッシュ
    useEffect(() => {
        if (!cacheDR[currentMonthDiff.toString()] && dateRecords) {
            dispatch(setDateRecordsByMonthDiff({ monthDiff: currentMonthDiff.toString(), data: dateRecords }));
            dispatch(setDRCache({ monthDiff: currentMonthDiff.toString(), data: true }));
        }
    }, [dateRecords]);

    return <>
        <Modal timeRecords={timeRecords} dateRecords={dateRecords} onModal={onModal} setOnModal={setOnModal} />
        <tbody>
            {
                currentMonthDates.map((row: Date[], i: number) => (
                    <tr key={i}>
                        {
                            row.map((date: Date, j: number) => (
                                <CalendarDate key={j} date={date} timeRecord={timeRecords?.[formatDate(date)]} dateRecord={dateRecords?.[formatDate(date)]} setOnModal={setOnModal} />
                            ))
                        }
                    </tr>
                ))
            }
        </tbody>
    </>
}

