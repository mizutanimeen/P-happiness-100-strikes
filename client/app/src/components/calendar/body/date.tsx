import React, { useEffect, useState } from "react";
import { format } from 'date-fns';
import { useSelector } from "../../redux/store";
import { useDispatch } from "react-redux";
import { select } from "../../redux/slice/calendar";
import { formatDate } from '../../util/util';
import { TimeRecordGet } from '../../axios/time';
import { DateRecordGet } from '../../axios/date';
import { Icon } from './icon';
import '../css/body.css';

export function CalendarDate(props: { date: Date, timeRecord: TimeRecordGet[] | undefined, dateRecord: DateRecordGet | undefined, setOnModal: (value: boolean) => void }): JSX.Element {
    const dispatch = useDispatch();
    const selectedDate = useSelector((state) => state.selectDate.value);
    // TODO: モーダルを表示する
    const selectDate = (formatDate: string) => {
        if (selectedDate === formatDate) {
            props.setOnModal(true);
        }
        dispatch(select(formatDate));
    }

    const date = props.date;
    const fomatDate = formatDate(props.date);
    return <td key={fomatDate} className={`date ${getTodayClass(fomatDate)} ${getSelectClass(fomatDate, selectedDate)}`} onClick={() => selectDate(fomatDate)}>
        <div>
            <div className="dateDate">
                {format(date, "dd")}
            </div>
            <div className="dateTR">
                {
                    props.timeRecord?.map((timeRecord: TimeRecordGet, i: number) => (
                        <TimeRecordComponent key={timeRecord.id} i={i} money={timeRecord.recovery_money - timeRecord.investment_money} />
                    ))
                }
            </div>
            <div className="dateDR">
                {
                    (props.dateRecord !== undefined) ?
                        <Icon happiness={props.dateRecord?.happiness} /> : <></>
                }
            </div>
        </div >
    </td>
}

function getTodayClass(fomatDate: string): string {
    const today = new Date();
    if (fomatDate === formatDate(today)) {
        return 'today';
    }
    return '';
}

function getSelectClass(fomatDate: string, selectedDate: string): string {
    if (selectedDate === fomatDate) {
        return 'selected';
    }
    return '';
}

function TimeRecordComponent(props: { i: number, money: number }): JSX.Element {
    if (props.i > 2) {
        return <></>
    }
    const money = props.money;
    return <>
        <div className={`timeRecord ${money >= 0 ? "plus" : ""}`}>{money}</div >
    </>
}
