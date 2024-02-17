import React from "react";
import './css/body.css';
import { format } from 'date-fns';

export function GetMonthDays(month = new Date().getMonth()): Date[][] {
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

export function CalendarBody(props: { currentMonth: Date[][]; }): JSX.Element {
    const { currentMonth } = props;
    return <React.Fragment>
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
            <tbody>
                {currentMonth.map((row: Date[], i: React.Key) => (
                    <tr key={i}>
                        {
                            row.map((day: Date, j: React.Key) => (
                                <td key={j} className="day">
                                    {format(day, "dd")}
                                </td>
                            ))
                        }
                    </tr>
                ))}
            </tbody>
        </table>
    </React.Fragment>
}
