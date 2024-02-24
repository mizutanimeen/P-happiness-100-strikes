import React, { useEffect } from "react";
import './css/body.css';
import { format } from 'date-fns';
import { useState } from "react";
import { useSelector } from "../redux/store";
import { useQuery } from '@tanstack/react-query'
import axios from 'axios';

export function getMonthDays(currentMonth: number): Date[][] {
    const month = new Date().getMonth() + currentMonth;
    const currentYear = new Date().getFullYear();
    const firstDOW = new Date(currentYear, month, 1).getDay();
    // firstDOW = 0 When it is Sunday
    let currentDay = 0 - firstDOW;
    // 5 weeks, 7 days
    const daysMatrix = new Array<Date[]>(5).fill([]).map(() => {
        return new Array<Date>(7).fill(new Date()).map(() => {
            currentDay++;
            return new Date(currentYear, month, currentDay);
        });
    });
    return daysMatrix;
}

export function CalendarBody(): JSX.Element {
    /* TODO:Date情報をキャッシュする */
    const [currentMonthDates, setCurrentMonthDates] = useState<Date[][]>(getMonthDays(0));
    const currentMonthDiff = useSelector((state) => state.calendar.value);

    const formatDate = (date: Date): string => {
        return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
    }

    useEffect(() => {
        setCurrentMonthDates(getMonthDays(currentMonthDiff))

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
                            row.map((day: Date, j: React.Key) => (
                                < td key={j} className={`day ${getCurrentDayClass(day)}`}>
                                    {format(day, "dd")}
                                </td>
                            ))
                        }
                    </tr>
                ))
            }
        </tbody>
    </>
}

function getCurrentDayClass(today: Date): string {
    const currentDate = new Date();
    if (today.getDate() === currentDate.getDate() &&
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear()) {
        return 'currentDay';
    }
    return '';
}
