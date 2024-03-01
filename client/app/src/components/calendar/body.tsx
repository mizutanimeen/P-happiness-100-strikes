import React, { useEffect } from "react";
import './css/body.css';
import { format } from 'date-fns';
import { useState } from "react";
import { useSelector } from "../redux/store";
import { useDispatch } from "react-redux";
import { select } from "../redux/slice/calendar";
import { formatDate } from '../util/util';
import axios from 'axios';
import { DateRecordsGetRequest, DateRecords } from '../axios/date';
import { TimeRecordsGetRequest, TimeRecordsGet, TimeRecordGet } from '../axios/time';
import { login, setTotalMoney } from "../redux/slice/calendar";
import { Modal } from './modal';

export function getMonthDates(currentMonth: number): Date[][] {
    const month = new Date().getMonth() + currentMonth;
    const currentYear = new Date().getFullYear();
    const firstDOW = new Date(currentYear, month, 1).getDay();
    // firstDOW = 0 When it is Sunday
    let currentDate = 0 - firstDOW;
    // 5 weeks, 7 days
    const datesMatrix = new Array<Date[]>(5).fill([]).map(() => {
        return new Array<Date>(7).fill(new Date()).map(() => {
            currentDate++;
            return new Date(currentYear, month, currentDate);
        });
    });
    return datesMatrix;
}

export function CalendarBody(): JSX.Element {
    const [onModal, setOnModal] = useState<boolean>(false);
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
            <TableBody setOnModal={setOnModal} />
        </table>
        <Modal onModal={onModal} setOnModal={setOnModal} />
    </ >
}

function TableBody(props: { setOnModal: (value: boolean) => void }): JSX.Element {
    /* TODO:Date情報をキャッシュする */
    const [currentMonthDates, setCurrentMonthDates] = useState<Date[][]>(getMonthDates(0));
    const currentMonthDiff = useSelector((state) => state.monthDiff.value);
    const firstCallDone = React.useRef(false);
    const [timeRecords, setTimeRecords] = useState<TimeRecordsGet>();
    const dispatch = useDispatch();

    const timeRecordsGet = async (start: string, end: string) => {
        await axios(TimeRecordsGetRequest(start, end)).then((result) => {
            if (result.status === 200) {
                dispatch(login(true));
                setTimeRecords(result.data);
            } else {
                console.log(result);
            }
            firstCallDone.current = false;
        }).catch((error) => {
            if (error.response.status === 401) {
                dispatch(login(false));
            } else {
                console.log(error);
            }
            firstCallDone.current = false;
        });
    };

    useEffect(() => {
        setCurrentMonthDates(getMonthDates(currentMonthDiff))
    }, [currentMonthDiff]);

    useEffect(() => {
        const start = formatDate(currentMonthDates[0][0]);
        const end = formatDate(currentMonthDates[4][6]);

        // strict modeのための対策
        if (!firstCallDone.current) {
            firstCallDone.current = true;
            // date にしてdateの中からtime呼ぶ
            timeRecordsGet(start, end);
        }

        // Reduxにマップ形式でcacheする 
    }, [currentMonthDates]);


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
    useEffect(() => {
        totalMoney();
    }, [timeRecords])

    return <>
        <tbody>
            {
                currentMonthDates.map((row: Date[], i: number) => (
                    <tr key={i}>
                        {
                            row.map((date: Date, j: number) => (
                                <CalendarDate key={j} date={date} timeRecord={timeRecords?.[formatDate(date)]} setOnModal={props.setOnModal} />
                            ))
                        }
                    </tr>
                ))
            }
        </tbody>
    </>
}

function CalendarDate(props: { date: Date, timeRecord: TimeRecordGet[] | undefined, setOnModal: (value: boolean) => void }): JSX.Element {
    const dispatch = useDispatch();
    const selectedDate = useSelector((state) => state.selectDate.value);
    // TODO: モーダルを表示する
    const selectDate = (formatDate: string) => {
        if (selectedDate === formatDate) {
            props.setOnModal(true);
        }
        dispatch(select(formatDate));
    }

    const date = props.date;
    const fomatDate = formatDate(props.date);
    return <td key={fomatDate} className={`date ${getTodayClass(fomatDate)} ${getSelectClass(fomatDate, selectedDate)}`} onClick={() => selectDate(fomatDate)}>
        <div>
            <div className="dateDate">
                {format(date, "dd")}
            </div>
            {
                props.timeRecord?.map((timeRecord: TimeRecordGet, i: number) => (
                    <TimeRecord key={timeRecord.id} i={i} money={timeRecord.recovery_money - timeRecord.investment_money} />
                ))
            }
        </div >
    </td>
}

function getTodayClass(fomatDate: string): string {
    const today = new Date();
    if (fomatDate === formatDate(today)) {
        return 'today';
    }
    return '';
}

function getSelectClass(fomatDate: string, selectedDate: string): string {
    if (selectedDate === fomatDate) {
        return 'selected';
    }
    return '';
}

function TimeRecord(props: { i: number, money: number }): JSX.Element {
    if (props.i > 3) {
        return <></>
    }
    const money = props.money;
    return <>
        <div className={`timeRecord ${money >= 0 ? "plus" : ""}`}>{money}</div >
    </>
}
