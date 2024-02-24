import React, { useState } from "react";
import { useSelector } from "../redux/store";
import { BackHomeHeader } from "../header/header";
import { formatTime } from "../util/util";
import "./css/record.css";
import "../util/css/util.css";

export function CreateRecord() {
    const selectDate = useSelector((state) => state.selectDate.value);
    const [dateTime, setDateTime] = useState(selectDate + " " + formatTime(new Date()));
    const [investmentMoney, setInvestmentMoney] = useState(0);
    const [recoveryMoney, setRecoveryMoney] = useState(0);

    return (
        <div className="container">
            <BackHomeHeader />
            <div className="contentBody">
                <h1>記録作成</h1>
                <div>
                    <label>日時</label>
                    <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
                </div>
                <div>
                    <h2>回転数記録</h2>
                </div>
                <div>
                    <h2>収支記録</h2>
                    <label>投資額</label>
                    <input type="number" value={investmentMoney} onChange={(e) => setInvestmentMoney(Number(e.target.value))} />
                    <label>回収額</label>
                    <input type="number" value={recoveryMoney} onChange={(e) => setRecoveryMoney(Number(e.target.value))} />
                </div>
                <div>
                    <button>記録を作成</button>
                </div>
            </div >
        </div >
    )
}
