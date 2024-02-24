import React, { useEffect } from "react";
import './css/body.css';
import { format } from 'date-fns';
import { useState } from "react";
import { useSelector } from "../redux/store";
import { useQuery } from '@tanstack/react-query'
import axios from 'axios';
import { useDispatch } from "react-redux";
import { select } from "../redux/slice/calendar";
import { formatDate } from '../util/util';

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
    /* TODO:Date情報をキャッシュする */
    const [currentMonthDates, setCurrentMonthDates] = useState<Date[][]>(getMonthDates(0));
    const currentMonthDiff = useSelector((state) => state.monthDiff.value);

    useEffect(() => {
        setCurrentMonthDates(getMonthDates(currentMonthDiff))

        const start = formatDate(currentMonthDates[0][0]);
        const end = formatDate(currentMonthDates[4][6]);

        /* TanStack Query を用いて並列処理で実行し、キャッシュする */
    }, [currentMonthDiff]);

    return <>
        <table className="body">
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
            <TableBody currentMonthDates={currentMonthDates} />
        </table>
    </ >
}

function TableBody(props: { currentMonthDates: Date[][] }): JSX.Element {
    const currentMonthDates = props.currentMonthDates;
    return <>
        <tbody>
            {
                currentMonthDates.map((row: Date[], i: React.Key) => (
                    <tr key={i}>
                        {
                            row.map((date: Date, j: React.Key) => (
                                <CalendarDate date={date} k={j} />
                            ))
                        }
                    </tr>
                ))
            }
        </tbody>
    </>
}

function CalendarDate(props: { date: Date, k: React.Key }): JSX.Element {
    const dispatch = useDispatch();
    const selectDate = (date: Date) => {
        dispatch(select(formatDate(date)));
    }

    const date = props.date;
    const key = props.k;
    return <td key={key} className={`date ${GetTodayClass(date)} ${GetSelectClass(date)}`} onClick={() => selectDate(date)}>
        <div>
            {format(date, "dd")}
        </div>
    </td>
}

function GetTodayClass(date: Date): string {
    const today = new Date();
    if (formatDate(date) === formatDate(today)) {
        return 'today';
    }
    return '';
}

function GetSelectClass(date: Date): string {
    const selectedDate = useSelector((state) => state.selectDate.value);
    if (selectedDate === formatDate(date)) {
        return 'selected';
    }
    return '';
}
