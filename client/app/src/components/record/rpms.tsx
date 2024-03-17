import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/record.css";
import "../util/css/util.css";
import { RPMRecordCreateRequest, RPMRecordCreate, RPMRecordGet, RPMRecordGetRequest } from "../axios/rpm";
import { RPMRecord } from "./rpm/rpm";


type rpmRecordProps = {
    data: RPMRecordGet[] | undefined;
    id: string | undefined;
    setRPMRecords: (value: RPMRecordGet[]) => void;
    isLoading: boolean;
}

export function RPMRecords(props: rpmRecordProps) {
    const { data, id, setRPMRecords, isLoading } = props;
    const navigate = useNavigate();
    const [rpmLoading, setRPMLoading] = useState(false);

    // TODO: 401なるから record, rpm, machine のapi調整する。
    useEffect(() => {
        if (isLoading || data !== undefined) {
            return;
        }
        rpmRecordGet();
    }, [isLoading]);

    const rpmRecordGet = async () => {
        if (id === undefined || id === "undefined" || id === "") {
            navigate("/")
            return;
        }
        setRPMLoading(true);
        await axios(RPMRecordGetRequest(id)).then((result) => {
            setRPMRecords(result.data);
        }).catch((error) => {
            if (error.response.status !== 401) {
                console.log(error);
            }
        });
        setRPMLoading(false);
    };

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
                rpmRecordGet();
            }).catch((error) => {
                if (error.response.status !== 401) {
                    console.log(error);
                }
            });
        };
        createRPM();
    }

    return <div>
        <h2>回転数記録</h2>
        <div>
            {
                data?.map((data: RPMRecordGet, i: number) => (
                    <RPMRecord key={i} data={data} id={i + 1} loading={rpmLoading} />
                ))
            }
        </div>
        <button className="button" onClick={createRPMRecord}>回転数記録を追加</button>
    </div>
}
