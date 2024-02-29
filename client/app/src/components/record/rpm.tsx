import { MachineGet, MachineGetRequest } from "../axios/machine";
import { FullScreenDialog } from "./machine";
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useEffect, useState, useRef } from "react";
import { RPMRecordGet, RPMRecordUpdate, RPMRecordUpdateRequest } from "../axios/rpm";
import axios from "axios";
import "./css/rpm.css";
import "../util/css/util.css";
import { Machine } from "./machine";


export function RPMRecord(props: { data: RPMRecordGet, id: number }): JSX.Element {
    // TODO: まとめる。machineとか特にまとめられる
    const id = props.id;
    const rpmRecord = props.data;
    // formの値
    const [investmentMoney, setInvestmentMoney] = useState(0);
    const [investmentBall, setInvestmentBall] = useState(0);
    const [startRPM, setStartRPM] = useState(0);
    const [endRPM, setEndRPM] = useState(0);
    const [rpm, setRPM] = useState<number>(0);
    // strict modeのための対策
    const firstCallDone = useRef(false);
    // マシーン情報
    const [isLoading, setIsLoading] = useState(false);
    const [getMachine, setGetMachine] = useState<MachineGet>();
    const [machine, setMachine] = useState<Machine>(
        {
            id: 0,
            name: "",
            rate: 4
        }
    );
    // マシーンダイアログ
    const [isMachineDialogOpen, setIsMachineDialogOpen] = useState(false);

    const machineGet = async () => {
        if (rpmRecord.machine_id === undefined || rpmRecord.machine_id === 0) {
            return;
        }
        setIsLoading(true);
        await axios(MachineGetRequest(rpmRecord.machine_id)).then((result) => {
            if (result.status === 200) {
                setGetMachine(result.data);
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
    }, [rpmRecord]);

    useEffect(() => {
        if (getMachine === undefined) {
            return;
        }
        setMachine(
            {
                id: getMachine.id,
                name: getMachine.machine_name,
                rate: getMachine.rate
            }
        );
    }, [getMachine]);

    const setInput = (value: string, set: (value: number) => void) => {
        let n = Number(value);
        if (isNaN(n)) {
            return;
        }
        if (n < 0) {
            n = 0;
        }
        set(n);
    }

    useEffect(() => {
        if (!(investmentMoney || investmentBall) || !(startRPM || endRPM) || (startRPM > endRPM)) {
            setRPM(0);
            return;
        }

        // 玉 * 玉の値段 + お金 = 投資額
        const cost = (investmentBall * machine.rate) + investmentMoney;
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
            machine_id: machine.id === undefined ? 0 : machine.id
        }

        axios(RPMRecordUpdateRequest(rpmRecord.time_record_id, data)).then((result) => {
            if (result.status === 200) {
                alert("更新しました");
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
                    <input className="box" type="text" pattern="[0-9]*" value={investmentMoney} onChange={(e) => setInput(e.target.value, setInvestmentMoney)} />
                    <div className="investmentButtonBox">
                        <InvestmentButton target="money" rate={machine.rate} investment={investmentMoney} setInvestment={setInvestmentMoney} />
                    </div>
                </div>
                <div>
                    <label>投資玉</label>
                    <input className="box" type="text" pattern="[0-9]*" value={investmentBall} onChange={(e) => setInput(e.target.value, setInvestmentBall)} />
                    <div className="investmentButtonBox">
                        <InvestmentButton target="ball" rate={machine.rate} investment={investmentBall} setInvestment={setInvestmentBall} />
                    </div>
                </div>
                <div>
                    <label>開始回転数</label>
                    <input className="box" type="text" pattern="[0-9]*" value={startRPM} onChange={(e) => setInput(e.target.value, setStartRPM)} />
                    <input className="bar" type="range" value={startRPM} step={1} min={0} max={2000} onChange={(e) => setStartRPM(Number(e.target.value))} />
                </div>
                <div>
                    <label>終了回転数</label>
                    <input className="box" type="text" pattern="[0-9]*" value={endRPM} onChange={(e) => setInput(e.target.value, setEndRPM)} />
                    <input className="bar" type="range" value={endRPM} step={1} min={0} max={2000} onChange={(e) => setEndRPM(Number(e.target.value))} />
                </div>
                <div>
                    <button className="button" onClick={() => setIsMachineDialogOpen(true)}>機種を設定</button>
                    <FullScreenDialog isMachineDialogOpen={isMachineDialogOpen} setIsMachineDialogOpen={setIsMachineDialogOpen} setMachine={setMachine} />
                    {!machine.id || isLoading ?
                        <></>
                        :
                        <div>
                            <div>機種: {machine.name}</div>
                            <div>レート: {machine.rate}</div>
                        </div>
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

type target = "money" | "ball"

function InvestmentButton(props: { target: target, rate: number, investment: number, setInvestment: (value: number) => void }): JSX.Element {
    const target = props.target;
    const rate = props.rate;
    const investment = props.investment;
    const setInvestment = props.setInvestment;

    const values: { [key: number]: { [key in target]: number } } = {
        1: { money: 200, ball: 200 },
        4: { money: 500, ball: 125 }
    }

    const value = values[rate][target];

    return <>
        <button className="button" onClick={() => setInvestment(investment - value < 0 ? 0 : investment - value)}>-{value}</button>
        <button className="button" onClick={() => setInvestment(investment + value)}>+{value}</button>
    </>
}
