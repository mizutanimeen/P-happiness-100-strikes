import { MachineGet, MachineGetRequest } from "../../axios/machine";
import { MachineDialog } from "../machine/machine";
import { Machine } from "../machine/model";
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useEffect, useState, useRef } from "react";
import { RPMRecordGet, RPMRecordUpdate, RPMRecordUpdateRequest } from "../../axios/rpm";
import axios from "axios";
import "./css/rpm.css";
import "../../util/css/util.css";
import { InvestmentForm, RPMForm } from "./form";

export function RPMRecord(props: { data: RPMRecordGet, id: number, loading: boolean }): JSX.Element {
    const id = props.id;
    const rpmRecord = props.data;
    // formの値
    const [investmentMoney, setInvestmentMoney] = useState(0);
    const [investmentBall, setInvestmentBall] = useState(0);
    const [startRPM, setStartRPM] = useState(0);
    const [endRPM, setEndRPM] = useState(0);
    const [rpm, setRPM] = useState<number>(0);
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const machineGet = async () => {
        if (rpmRecord.machine_id === undefined || rpmRecord.machine_id === 0) {
            return;
        }
        setIsLoading(true);
        await axios(MachineGetRequest(rpmRecord.machine_id)).then((result) => {
            setGetMachine(result.data);
        }).catch((error) => {
            if (error.response.status !== 401) {
                console.log(error);
            }
        });
        setIsLoading(false);
    };

    const call = useRef(false);
    useEffect(() => {
        setInvestmentMoney(rpmRecord.investment_money);
        setInvestmentBall(rpmRecord.investment_ball);
        setStartRPM(rpmRecord.start_rpm);
        setEndRPM(rpmRecord.end_rpm);
    }, [rpmRecord]);

    useEffect(() => {
        if (!call.current) {
            if (props.loading) {
                return;
            }
            call.current = true;
            machineGet();
        }
    }, [props.loading]);

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
            if (error.response.status !== 401) {
                console.log(error);
            }
        });
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
                <InvestmentForm props={{ target: "money", rate: machine.rate, investment: investmentMoney, setInvestment: setInvestmentMoney }} />
                <InvestmentForm props={{ target: "ball", rate: machine.rate, investment: investmentBall, setInvestment: setInvestmentBall }} />
                <RPMForm props={{ target: "start", rpm: startRPM, setRPM: setStartRPM }} />
                <RPMForm props={{ target: "end", rpm: endRPM, setRPM: setEndRPM }} />
                <div>
                    <button className="button" onClick={() => setIsDialogOpen(true)}>機種を設定</button>
                    <MachineDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} setMachine={setMachine} />
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

