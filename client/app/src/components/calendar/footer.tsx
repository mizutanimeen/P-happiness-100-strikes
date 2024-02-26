import React, { useEffect, useState } from "react";
import './css/footer.css';
import { Link } from 'react-router-dom';
import { CiCirclePlus } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import axios from 'axios';
import { TimeRecordCreateRequest, TimeRecordCreate } from '../axios/time';
import { formatDate, formatTime } from '../util/util';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "../redux/store";

export function CalendarFooter(): JSX.Element {
    const login = useSelector((state) => state.login.value);

    const navigate = useNavigate();
    const selectDate: string = useSelector((state) => state.selectDate.value);
    const createTimeRecord = () => {
        const now = new Date();
        const date: string = selectDate + "T" + formatTime(now);
        const data: TimeRecordCreate = {
            date_time: date,
            investment_money: 0,
            recovery_money: 0
        }

        axios(TimeRecordCreateRequest(data)).then((result) => {
            if (result.status === 201) {
                const id: string = result.data.id;
                navigate(`/records/${id}`);
            } else {
                console.log(result);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    if (login) {
        return <>
            <div className="footer login">
                <Link to="/account" className="account"><button><MdAccountCircle /></button></Link>
                <Link to="/" className="statistics"><button>統計</button></Link>
                <div className="plus"> <button onClick={createTimeRecord}> <CiCirclePlus /></button></div>
            </div >
        </>
    } else {
        return <>
            <div className="footer logout">
                <Link to="/register"><button>新規登録</button></Link>
                <Link to="/login"><button>ログイン</button></Link>
            </div >
        </>
    }
}


