import React, { useEffect } from "react";
import './css/body.css';
import { format } from 'date-fns';
import { useState } from "react";

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

export function CalendarBody(props: { currentMonthDiff: number }): JSX.Element {
    const [currentMonthDays, setCurrentMonthDays] = useState<Date[][]>(getMonthDays(0));
    useEffect(() => {
        setCurrentMonthDays(getMonthDays(props.currentMonthDiff))
    }, [props.currentMonthDiff]);

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
            <TableBody currentMonthDays={currentMonthDays} />
        </table>
    </ >
}

function TableBody(props: { currentMonthDays: Date[][] }): JSX.Element {
    const currentMonthDays = props.currentMonthDays;
    return <>
        <tbody>
            {
                currentMonthDays.map((row: Date[], i: React.Key) => (
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
