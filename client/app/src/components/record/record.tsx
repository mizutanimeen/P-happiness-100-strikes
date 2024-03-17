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
import { RPMRecordGet } from "../axios/rpm";
import { useDispatch } from "react-redux";
import { setTRCache } from "../redux/slice/calendar";
import { MoneyForm } from "./form";
import { RPMRecords } from "./rpms";

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
            setTimeRecords(result.data);
        }).catch((error) => {
            if (error.response.status !== 401) {
                console.log(error);
            }
        });
        setIsLoading(false);
    };

    const call = useRef(false);
    useEffect(() => {
        if (!call.current) {
            call.current = true;
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

    return (
        <div className="container">
            <RecordHeader id={id} />
            {
                (isLoading) ?
                    <>Loading....</> :
                    <div className="recordContainer contentBody">
                        <h1>記録作成</h1>
                        <div className="dateBox">
                            <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
                        </div>
                        <RPMRecords data={rpmRecords} id={id} setRPMRecords={setRPMRecords} isLoading={isLoading} />
                        <div className="incomeExpendContainer">
                            <h2>収支記録</h2>
                            <MoneyForm label="投資額" money={investmentMoney} setMoney={setInvestmentMoney} step={step} />
                            <MoneyForm label="回収額" money={recoveryMoney} setMoney={setRecoveryMoney} step={step} />
                        </div>
                        <div className="recordButton">
                            <button className="button" onClick={updateTimeRecord}>更新</button>
                        </div>
                    </div >
            }
        </div >
    )
}
