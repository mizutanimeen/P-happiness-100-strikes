import React, { useEffect, useState } from "react";
import './css/footer.css';
import { Link } from 'react-router-dom';
import { CiCirclePlus } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import axios from 'axios';
import { IsLoginRequest } from '../axios/auth';
import { TimeRecordCreateRequest, CreateTimeRecord } from '../axios/time';
import { formatDate, formatTime } from '../util/util';
import { useNavigate } from 'react-router-dom';

// TODO: ログアウトしたときにフッターが変わらない
export function CalendarFooter(): JSX.Element {
    const [isLoading, setIsLoading] = useState(true);
    const [isLogined, setIsLogined] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const check = async () => {
            await axios(IsLoginRequest).then((result) => {
                if (result.status === 200) {
                    setIsLogined(true);
                } else {
                    console.log(result);
                }
            }).catch((error) => {
                if (error?.response?.status === 401) {
                    setIsLogined(false);
                }
                console.log(error);
            });

            setIsLoading(false);
        };
        check();
    }, []);

    const navigate = useNavigate();
    const createTimeRecord = () => {
        const now = new Date();
        const date: string = formatDate(now) + " " + formatTime(now);
        const data: CreateTimeRecord = {
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

    if (!isLoading && isLogined) {
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


