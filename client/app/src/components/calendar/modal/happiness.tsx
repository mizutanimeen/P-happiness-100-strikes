import { FaRegFaceFrown, FaRegFaceGrin, FaRegFaceGrinBeam, FaRegFaceMeh, FaRegFaceTired } from "react-icons/fa6";
import "../css/happiness.css";
import { DateRecordPostRequest, DateRecordPutRequest } from "../../axios/date";
import { useSelector } from "../../redux/store";
import axios from 'axios';
import { useEffect, useState } from "react";
import { DateRecordGet } from '../../axios/date';
import { useDispatch } from "react-redux";
import { setDRCache } from "../../redux/slice/calendar";

export const icons = [
    <FaRegFaceTired />,
    <FaRegFaceFrown />,
    <FaRegFaceMeh />,
    <FaRegFaceGrin />,
    <FaRegFaceGrinBeam />
]

// TODO: 新規作成 -> 同じ日付を更新 -> エラー
// TODO: happiness が同じ値の場合、削除する

export function Happiness(props: { dateRecord: DateRecordGet | undefined, setOnModal: (value: boolean) => void }): JSX.Element {
    const dispatch = useDispatch();
    const currentMonthDiff = useSelector((state) => state.monthDiff.value);

    const dateRecord = props.dateRecord;
    const selectedDate = useSelector((state) => state.selectDate.value);
    const [happiness, setHappiness] = useState(0);

    useEffect(() => {
        if (dateRecord === undefined) {
            setHappiness(0);
            return;
        }
        setHappiness(dateRecord.happiness);
    }, [dateRecord?.happiness])

    const TouchDateRecord = (value: number) => {
        let request;
        if (dateRecord === undefined) {
            request = DateRecordPostRequest({
                date: selectedDate,
                happiness: value
            });
        } else {
            request = DateRecordPutRequest({
                date_record_id: dateRecord.id,
                happiness: value
            });
        }

        axios(request).then((result) => {
            setHappiness(value);
            dispatch(setDRCache({ monthDiff: currentMonthDiff.toString(), data: false }));
            props.setOnModal(false);
        }).catch((error) => {
            console.log(error);
        });
    }

    const happinessActiveClass = (index: number) => {
        if (happiness === index + 1) {
            return "active";
        } else {
            return "";
        }
    }

    return (
        <div className="happinessContainer">
            <div className="happinessTitle">
                遊戯後の気分
            </div>
            <div className="happinessButtons">
                {
                    icons.map((icon, i: number) => (
                        <button key={i} onClick={() => TouchDateRecord(i + 1)} className={happinessActiveClass(i)}>
                            {icon}
                        </button>
                    ))
                }
            </div>
        </div >
    );
}
