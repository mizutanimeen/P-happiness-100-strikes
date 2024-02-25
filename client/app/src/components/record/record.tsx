import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "../redux/store";
import { BackHomeHeader } from "../header/header";
import { formatDate, formatTime } from "../util/util";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TimeRecordGetRequest, TimeRecordGet, TimeRecordUpdateRequest, TimeRecordUpdate } from "../axios/time";
import "./css/record.css";
import "../util/css/util.css";
import { RPMRecordCreateRequest, RPMRecordCreate, RPMRecordGet, RPMRecordGetRequest } from "../axios/rpm";

export function DetailRecord() {
    const navigate = useNavigate();
    const selectDate = useSelector((state) => state.selectDate.value);
    const [dateTime, setDateTime] = useState(selectDate + " " + formatTime(new Date()));
    const [investmentMoney, setInvestmentMoney] = useState(0);
    const [recoveryMoney, setRecoveryMoney] = useState(0);
    const step = 100;
    const { id } = useParams();
    const firstCallDone = useRef(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timeRecords, setTimeRecords] = useState<TimeRecordGet>();
    const [rpmRecords, setRPMRecords] = useState<RPMRecordGet[]>();
    const [rpmLoading, setRPMLoading] = useState(false);

    const timeRecordGet = async () => {
        if (isLoading) {
            return;
        }
        if (id === undefined || id === "undefined" || id === "") {
            navigate("/")
            return;
        }
        setIsLoading(true);
        await axios(TimeRecordGetRequest(id)).then((result) => {
            if (result.status === 200) {
                setTimeRecords(result.data);
            } else {
                console.log(result);
            }
            setIsLoading(false);
        }).catch((error) => {
            if (error.response.status === 401) {
                navigate("/");
                return;
            }
            console.log(error);
            setIsLoading(false);
        });
    };

    const rpmRecordGet = async () => {
        if (rpmLoading) {
            return;
        }
        if (id === undefined || id === "undefined" || id === "") {
            navigate("/")
            return;
        }
        setRPMLoading(true);
        await axios(RPMRecordGetRequest(id)).then((result) => {
            if (result.status === 200) {
                setRPMRecords(result.data);
            } else {
                console.log(result);
            }
            setRPMLoading(false);
        }).catch((error) => {
            if (error.response.status === 401) {
                navigate("/");
            }
            console.log(error);
            setRPMLoading(false);
        });
    };

    useEffect(() => {
        // strict modeのための対策
        if (!firstCallDone.current) {
            firstCallDone.current = true;
            timeRecordGet();
            rpmRecordGet();
        }
    }, [id]);

    useEffect(() => {
        if (timeRecords === undefined) {
            return;
        }
        setDateTime(timeRecords.date_time.replace("T", " ").replace("Z", ""));
        setInvestmentMoney(timeRecords.investment_money);
        setRecoveryMoney(timeRecords.recovery_money);
    }, [timeRecords]);

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
    const updateTimeRecord = () => {
        if (investmentMoney < 0 || recoveryMoney < 0) {
            alert("投資額と回収額は0以上で入力してください");
            return;
        }
        if (id === undefined || id === "undefined" || id === "") {
            navigate("/")
            return;
        }

        const data: TimeRecordUpdate = {
            id: id,
            date_time: dateTime,
            investment_money: investmentMoney,
            recovery_money: recoveryMoney
        }

        axios(TimeRecordUpdateRequest(data)).then((result) => {
            if (result.status === 200) {
                alert("更新しました");
            } else {
                console.log(result);
            }
        }).catch((error) => {
            console.log(error);
        }
        );
    }
    const createRPMRecord = () => {
        if (id === undefined || id === "undefined" || id === "") {
            navigate("/")
            return;
        }

        const data: RPMRecordCreate = {
            investment_money: 0,
            investment_ball: 0,
            start_rpm: 0,
            end_rpm: 0,
            machine_id: 0,
        }

        const createRPM = async () => {
            await axios(RPMRecordCreateRequest(id, data)).then((result) => {
                if (result.status === 201) {
                    rpmRecordGet();
                } else {
                    console.log(result);
                }
            }).catch((error) => {
                if (error.response.status === 401) {
                    navigate("/");
                    return;
                }
                console.log(error);
            });
        };
        createRPM();
    }

    return (
        <div className="container">
            <BackHomeHeader />
            {
                (isLoading) ?
                    <>
                        Loading....
                    </>
                    :
                    <div className="recordContainer contentBody">
                        <h1>記録作成</h1>
                        <div className="dateBox">
                            <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
                        </div>
                        <div>
                            <h2>回転数記録</h2>
                            <div>
                                {
                                    rpmRecords?.map((data: RPMRecordGet, i: number) => (
                                        <RPMRecord key={i} id={i + 1} />
                                    ))
                                }
                            </div>
                            <button className="button" onClick={createRPMRecord}>回転数記録を追加</button>
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
                            <button className="button" onClick={updateTimeRecord}>更新</button>
                        </div>
                    </div >
            }
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
