import React from "react";
import './css/header.css';
import { useDispatch } from "react-redux";
import { increment, decrement } from "../redux/slice";
import { useSelector } from "../redux/store";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";


export function CalendarHeader(): React.ReactElement {
    const currentMonthDiff = useSelector((state) => state.calendar.value);
    const currentYearMonth = yearMonthToString(currentMonthDiff);
    const currentMonthDispatch = useDispatch();

    return <>
        <div className="header">
            <div>{currentYearMonth}</div>
            <div>+10000円</div> {/* serverで計算する */}
            <button onClick={() => currentMonthDispatch(decrement())}><FaArrowLeft /></button>
            <button onClick={() => currentMonthDispatch(increment())}><FaArrowRight /></button>
        </div>
    </>
}

function yearMonthToString(currentMonthDiff: number): string {
    const currentYear = new Date().getFullYear();
    const month = new Date().getMonth() + currentMonthDiff;
    const date = new Date(currentYear, month, 1)
    const ansMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1; // 1月 = 0
    const ansYear = date.getFullYear();
    return ansYear + "年" + ansMonth + "月"
}
