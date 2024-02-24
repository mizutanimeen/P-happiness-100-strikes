import React, { useEffect, useState } from "react";
import './css/footer.css';
import { Link } from 'react-router-dom';
import { CiCirclePlus } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";
import axios from 'axios';
import { IsLoginRequest } from '../axios/auth';

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
                } else {
                    console.log(error);
                }
            });

            setIsLoading(false);
        };
        check();
    }, []);

    if (!isLoading && isLogined) {
        return <>
            <div className="footer login">
                <Link to="/account" className="account"><button><MdAccountCircle /></button></Link>
                <Link to="/" className="statistics"><button>統計</button></Link>
                <Link to="/records/create" className="plus"> <button> <CiCirclePlus /></button></Link>
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


