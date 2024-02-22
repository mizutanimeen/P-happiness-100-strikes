import React from "react";
import './css/header.css';
import { useDispatch } from "react-redux";
import { increment, decrement } from "../redux/slice";
import { useSelector } from "../redux/store";


export function CalendarHeader(): JSX.Element {
    const currentMonthDiff = useSelector((state) => state.calendar.value);
    const currentMonthDispatch = useDispatch();
    const currentYearMonth = yearMonthToString(currentMonthDiff);

    return <>
        <div className="header">
            <div>{currentYearMonth}</div>
            <div>+10000円</div>
            <button onClick={() => currentMonthDispatch(increment())}>++++</button>
            <button onClick={() => currentMonthDispatch(decrement())}>-----</button>
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
