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
import { RPMRecordCreateRequest, RPMRecordCreate, RPMRecordGet, RPMRecordGetRequest, RPMRecordUpdate, RPMRecordUpdateRequest } from "../axios/rpm";
import { MachineGet, MachineGetRequest } from "../axios/machine";
import { set } from "date-fns";

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
                                        <RPMRecord key={i} data={data} id={i + 1} />
                                    ))
                                }
                            </div>
                            <button className="button" onClick={createRPMRecord}>回転数記録を追加</button>
                        </div>
                        <div className="incomeExpendContainer">
                            <h2>収支記録</h2>
                            <div className="incomeExpendBox">
                                <label>投資額</label>
                                <input className="box" type="text" pattern="[0-9]*" value={investmentMoney} onChange={(e) => setInputInvestmentMoney(e.target.value)} />
                                <input className="bar" type="range" value={investmentMoney} step={step} min={0} max={200000} onChange={(e) => setInvestmentMoney(Number(e.target.value))} />
                            </div>
                            <div className="incomeExpendBox">
                                <label>回収額</label>
                                <input className="box" type="text" pattern="[0-9]*" value={recoveryMoney} onChange={(e) => setInputRecoveryMoney(e.target.value)} />
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


function RPMRecord(props: { data: RPMRecordGet, id: number }): JSX.Element {
    const id = props.id;
    const rpmRecord = props.data;
    const [investmentMoney, setInvestmentMoney] = useState(0);
    const [investmentBall, setInvestmentBall] = useState(0);
    const [startRPM, setStartRPM] = useState(0);
    const [endRPM, setEndRPM] = useState(0);
    const firstCallDone = useRef(false);
    const [isLoading, setIsLoading] = useState(false);
    const [machine, setMachine] = useState<MachineGet>();
    const [machineID, setMachineID] = useState<number>(0);
    const [machineName, setMachineName] = useState<string>("");
    const [machineRate, setMachineRate] = useState<number>(4);
    const [rpm, setRPM] = useState<number>(0);

    const machineGet = async () => {
        if (isLoading) {
            return;
        }
        if (rpmRecord.machine_id === undefined || rpmRecord.machine_id === 0) {
            return;
        }
        setIsLoading(true);
        await axios(MachineGetRequest).then((result) => {
            if (result.status === 200) {
                setMachine(result.data);
            } else {
                console.log(result);
            }
            setIsLoading(false);
        }).catch((error) => {
            if (error.response.status === 401) {
            }
            console.log(error);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        // strict modeのための対策
        if (!firstCallDone.current) {
            firstCallDone.current = true;
            machineGet();
            setInvestmentMoney(rpmRecord.investment_money);
            setInvestmentBall(rpmRecord.investment_ball);
            setStartRPM(rpmRecord.start_rpm);
            setEndRPM(rpmRecord.end_rpm);
        }
    }, [id]);

    useEffect(() => {
        if (machine === undefined) {
            return;
        }
        setMachineName(machine.machine_name);
        setMachineRate(machine.rate);
    }, [machine]);

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

    const setInputInvestmentBall = (value: string) => {
        let n = Number(value);
        if (isNaN(n)) {
            return;
        }
        if (n < 0) {
            n = 0;
        }
        setInvestmentBall(n);
    }

    const setInputStartRPM = (value: string) => {
        let n = Number(value);
        if (isNaN(n)) {
            return;
        }
        if (n < 0) {
            n = 0;
        }
        setStartRPM(n);
    }
    const setInputEndRPM = (value: string) => {
        let n = Number(value);
        if (isNaN(n)) {
            return;
        }
        if (n < 0) {
            n = 0;
        }
        setEndRPM(n);
    }

    useEffect(() => {
        if (investmentMoney === 0 && investmentBall === 0) {
            setRPM(0);
            return;
        }
        if (startRPM === 0 && endRPM === 0 || startRPM > endRPM) {
            setRPM(0);
            return;
        }
        const cost = investmentBall * machineRate + investmentMoney;
        setRPM((endRPM - startRPM) / cost * 1000);
    }, [investmentMoney, investmentBall, startRPM, endRPM]);

    const updateRPMRecord = () => {
        if (investmentMoney < 0 || investmentBall < 0 || startRPM < 0 || endRPM < 0) {
            alert("投資額、投資玉、開始回転数、終了回転数は0以上で入力してください");
            return;
        }

        if (rpmRecord.time_record_id === undefined || rpmRecord.time_record_id === "0" || rpmRecord.time_record_id === "undefined") {
            alert("エラー");
            return;
        }

        const data: RPMRecordUpdate = {
            rpm_record_id: rpmRecord.id,
            investment_money: investmentMoney,
            investment_ball: investmentBall,
            start_rpm: startRPM,
            end_rpm: endRPM,
            machine_id: machineID === undefined ? 0 : machineID
        }

        axios(RPMRecordUpdateRequest(rpmRecord.time_record_id, data)).then((result) => {
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

    return <>
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={id.toString()}
                id={id.toString()}
            >
                記録{id}
            </AccordionSummary>
            <AccordionDetails className="rpmRecordContainer">
                <div>
                    <label>投資額</label>
                    <input className="box" type="text" pattern="[0-9]*" value={investmentMoney} onChange={(e) => setInputInvestmentMoney(e.target.value)} />
                    <div className="investmentButtonBox">
                        <InvestmentMoneyButton rate={machineRate} investmentMoney={investmentMoney} setInvestmentMoney={setInvestmentMoney} />
                    </div>
                </div>
                <div>
                    <label>投資玉</label>
                    <input className="box" type="text" pattern="[0-9]*" value={investmentBall} onChange={(e) => setInputInvestmentBall(e.target.value)} />
                    <div className="investmentButtonBox">
                        <InvestmentBallButton rate={machineRate} investmentBall={investmentBall} setInvestmentBall={setInvestmentBall} />
                    </div>
                </div>
                <div>
                    <label>開始回転数</label>
                    <input className="box" type="text" pattern="[0-9]*" value={startRPM} onChange={(e) => setInputStartRPM(e.target.value)} />
                    <input className="bar" type="range" value={startRPM} step={1} min={0} max={2000} onChange={(e) => setStartRPM(Number(e.target.value))} />
                </div>
                <div>
                    <label>終了回転数</label>
                    <input className="box" type="text" pattern="[0-9]*" value={endRPM} onChange={(e) => setInputEndRPM(e.target.value)} />
                    <input className="bar" type="range" value={endRPM} step={1} min={0} max={2000} onChange={(e) => setEndRPM(Number(e.target.value))} />
                </div>
                <div>
                    <button className="button">機種を設定</button>
                    {machine?.id === undefined ?
                        <></>
                        :
                        <>
                            <p>機種: {machineName}</p>
                            <p>レート: {machineRate}</p>
                        </>
                    }
                </div>
                <div className="rpmText">
                    {rpm.toPrecision(4)} (回転/1000円)
                </div>
                <div>
                    <button className="button" onClick={updateRPMRecord}>更新</button>
                </div>
            </AccordionDetails>
        </Accordion>
    </>
}

function InvestmentMoneyButton(props: { rate: number, investmentMoney: number, setInvestmentMoney: (value: number) => void }): JSX.Element {
    const rate = props.rate;
    const investmentMoney = props.investmentMoney;
    const setInvestmentMoney = props.setInvestmentMoney;

    const getRateMoney = (rate: number): number => {
        if (rate === 4) {
            return 500;
        }
        return 200;
    }
    const rateMoney: number = getRateMoney(rate);

    return (
        <>
            <button className="button" onClick={() => setInvestmentMoney(investmentMoney - rateMoney < 0 ? 0 : investmentMoney - rateMoney)}>-{rateMoney}</button>
            <button className="button" onClick={() => setInvestmentMoney(investmentMoney + rateMoney)}>+{rateMoney}</button>
        </>
    )
}

function InvestmentBallButton(props: { rate: number, investmentBall: number, setInvestmentBall: (value: number) => void }): JSX.Element {
    const rate = props.rate;
    const investmentBall = props.investmentBall;
    const setInvestmentBall = props.setInvestmentBall;

    const getRateBall = (rate: number): number => {
        if (rate === 4) {
            return 125;
        }
        return 200;
    }
    const rateBall: number = getRateBall(rate);

    return (
        <>
            <button className="button" onClick={() => setInvestmentBall(investmentBall - rateBall < 0 ? 0 : investmentBall - rateBall)}>-{rateBall}</button>
            <button className="button" onClick={() => setInvestmentBall(investmentBall + rateBall)}>+{rateBall}</button>
        </>
    )
}

