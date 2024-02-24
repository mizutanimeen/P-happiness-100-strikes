import React, { useEffect } from "react";
import './css/footer.css';
import { Link } from 'react-router-dom';
import { IsLoginRequest } from '../axios/auth';
import { useQuery } from '@tanstack/react-query'
import axios from 'axios';
import { CiCirclePlus } from "react-icons/ci";
import { MdAccountCircle } from "react-icons/md";

// TODO: ログアウトしたときにフッターが変わらない
export function CalendarFooter(): JSX.Element {
    const { data, isLoading } = useQuery({
        queryKey: ["logined"],
        queryFn: async () => {
            const data = await axios(IsLoginRequest)
            return data;
        },
        staleTime: Infinity
    });

    if (!isLoading && data?.status === 200) {
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


