import React, { useEffect, useState } from "react";
import { useSelector } from "../redux/store";
import { BackHomeHeader } from "../header/header";
import { formatTime } from "../util/util";
import "./css/record.css";
import "../util/css/util.css";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useParams } from "react-router-dom";

export function DetailRecord() {
    const selectDate = useSelector((state) => state.selectDate.value);
    const [dateTime, setDateTime] = useState(selectDate + " " + formatTime(new Date()));
    const [investmentMoney, setInvestmentMoney] = useState(0);
    const [recoveryMoney, setRecoveryMoney] = useState(0);
    const step = 100;
    const { id } = useParams();

    const postRecord = () => {
        if (investmentMoney < 0 || recoveryMoney < 0) {
            alert("投資額と回収額は0以上で入力してください");
            return;
        }
    }

    const setInputInvestmentMoney = (value: string) => {
        let n = Number(value);
        if (isNaN(n)) {
            return;
        }
        if (n < 0) {
            n = 0;
        }
        setInvestmentMoney(n);
    }
    const setInputRecoveryMoney = (value: string) => {
        let n = Number(value);
        if (isNaN(n)) {
            return;
        }
        if (n < 0) {
            n = 0;
        }
        setRecoveryMoney(n);
    }

    return (
        <div className="container">
            <BackHomeHeader />
            <div className="recordContainer contentBody">
                <h1>記録作成</h1>
                <div className="dateBox">
                    <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
                </div>
                <div>
                    <h2>回転数記録</h2>
                    <div>
                        {
                            Array(5).fill(1).map((data: number, i: number) => (
                                <RPMRecord key={i} id={i + 1} />
                            ))
                        }
                    </div>
                    <button className="button">回転数記録を追加</button>
                </div>
                <div className="incomeExpendContainer">
                    <h2>収支記録</h2>
                    <div className="incomeExpendBox">
                        <label>投資額</label>
                        <input className="box" type="text" value={investmentMoney} onChange={(e) => setInputInvestmentMoney(e.target.value)} />
                        <input className="bar" type="range" value={investmentMoney} step={step} min={0} max={200000} onChange={(e) => setInvestmentMoney(Number(e.target.value))} />
                    </div>
                    <div className="incomeExpendBox">
                        <label>回収額</label>
                        <input className="box" type="text" value={recoveryMoney} onChange={(e) => setInputRecoveryMoney(e.target.value)} />
                        <input className="bar" type="range" value={recoveryMoney} step={step} min={0} max={200000} onChange={(e) => setRecoveryMoney(Number(e.target.value))} />
                    </div>
                </div>
                <div className="recordButton">
                    <button className="button" onClick={postRecord}>記録</button>
                </div>
            </div >
        </div >
    )
}


function RPMRecord(props: { id: number }): JSX.Element {
    const id = props.id;
    const [recoveryMoney, setRecoveryMoney] = useState(0);

    return <>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={id.toString()}
                id={id.toString()}
            >
                記録{id}
            </AccordionSummary>
            <AccordionDetails>
                <input className="box" type="number" value={recoveryMoney} onChange={(e) => setRecoveryMoney(Number(e.target.value))} />
            </AccordionDetails>
        </Accordion>
    </>
}
