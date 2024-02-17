import React from "react";
import './css/header.css';

export function CalendarHeader(props: { currentMonthDiff: number }): JSX.Element {
    const currentYearMonth = yearMonthToString(props.currentMonthDiff);
    return <>
        <div className="header">
            <div>{currentYearMonth}</div>
            <div>+10000円</div>
        </div>
    </>
}

function yearMonthToString(currentMonthDiff: number): string {
    const currentYear = new Date().getFullYear();
    const month = new Date().getMonth() + currentMonthDiff;
    const date = new Date(currentYear, month, 1)
    const ansMonth = date.getMonth() + 1; // 0-indexed
    const ansYear = date.getFullYear();
    return ansYear + "年" + ansMonth + "月"
}
