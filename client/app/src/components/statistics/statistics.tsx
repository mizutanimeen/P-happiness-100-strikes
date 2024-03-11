import "../util/css/util.css";
import { BackHomeHeader } from '../header/header';
import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { DateRecordsGetRequest, DateRecordsGet } from '../axios/date';
import { TimeRecordsGetRequest, TimeRecordsGet, TimeRecordGet } from '../axios/time';
import { formatDate } from '../util/util';
import { BarChart } from './chart';

export function Statistics(): JSX.Element {
    const call = useRef(false);
    const [dateRecords, setDateRecords] = useState<DateRecordsGet>({});
    const [timeRecords, setTimeRecords] = useState<TimeRecordsGet>({});
    const [start, setStart] = useState<string>(formatDate(new Date(new Date().setDate(1))));
    const [end, setEnd] = useState<string>(formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)));

    // TODO: async/await こういう書き方できるから、refactできる場所ありそう。
    const dateTimeRecordsGet = async (start: string, end: string) => {
        await axios(DateRecordsGetRequest(start, end)).then((result) => {
            setDateRecords(result.data)
        }).catch((error) => {
            if (error.response.status === 401) {
            } else {
                console.log(error);
            }
        });
        await axios(TimeRecordsGetRequest(start, end)).then((result) => {
            setTimeRecords(result.data);
        }).catch((error) => {
            if (error.response.status === 401) {
            } else {
                console.log(error);
            }
        });
        call.current = false;
    };

    useEffect(() => {
        if (!call.current) {
            call.current = true;

            dateTimeRecordsGet(start, end);
        }
    }, [start, end]);

    return (
        <div className="container">
            <BackHomeHeader />
            <div className="contentBody">
                <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
                <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
                <BarChart dateRecords={dateRecords} timeRecords={timeRecords} />
            </div>
        </div>
    );
}
