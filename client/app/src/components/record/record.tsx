import { useEffect, useState, useRef } from "react";
import { useSelector } from "../redux/store";
import { RecordHeader } from "../header/header";
import { formatTime } from "../util/util";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TimeRecordGetRequest, TimeRecordGet, TimeRecordUpdateRequest, TimeRecordUpdate } from "../axios/time";
import "./css/record.css";
import "../util/css/util.css";
import { RPMRecordCreateRequest, RPMRecordCreate, RPMRecordGet, RPMRecordGetRequest } from "../axios/rpm";
import { RPMRecord } from "./rpm";
import { useDispatch } from "react-redux";
import { setTRCache } from "../redux/slice/calendar";

export function DetailRecord() {
    const dispatch = useDispatch();
    const currentMonthDiff = useSelector((state) => state.monthDiff.value);
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

    const recordGet = async () => {
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
            rpmRecordGet();
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
        if (id === undefined || id === "undefined" || id === "") {
            navigate("/")
            return;
        }
        await axios(RPMRecordGetRequest(id)).then((result) => {
            if (result.status === 200) {
                setRPMRecords(result.data);
            } else {
                console.log(result);
            }
        }).catch((error) => {
            if (error.response.status === 401) {
                navigate("/");
            }
            console.log(error);
        });
    };

    useEffect(() => {
        // strict modeのための対策
        if (!firstCallDone.current) {
            firstCallDone.current = true;
            recordGet();
            dispatch(setTRCache({ monthDiff: currentMonthDiff.toString(), data: false }));
        }
    }, [id]);

    useEffect(() => {
        if (timeRecords === undefined) {
            return;
        }
        setDateTime(timeRecords.date_time.replace("Z", ""));
        setInvestmentMoney(timeRecords.investment_money);
        setRecoveryMoney(timeRecords.recovery_money);
    }, [timeRecords]);

    // TODO: この関数は共通化
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
            navigate("/");
            alert("更新しました");
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
            <RecordHeader id={id} />
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
