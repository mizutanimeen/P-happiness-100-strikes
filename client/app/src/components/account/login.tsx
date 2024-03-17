import { useNavigate } from 'react-router-dom';
import { BackHomeHeader } from '../header/header';
import { useState } from 'react';
import { LoginRequest } from '../axios/auth';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { resetTR, resetDR } from "../redux/slice/calendar";
import './css/account.css';
import "../util/css/util.css";

export function Login(): JSX.Element {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');

    const isActive = (): string => {
        if (userID && password) {
            return "Active";
        } else {
            return "Inactive";
        }
    }

    const loginClick = () => {
        if (!(userID && password)) {
            return;
        }

        axios(LoginRequest(userID, password))
            .then(function (response) {
                if (response.status === 200) {
                    dispatch(resetTR());
                    dispatch(resetDR());
                    navigate("/")
                }
            })
            .catch(function (error) {
                // TODO: エラーによってメッセージを変える
                alert("ユーザーIDもしくはパスワードが間違っています。")
            });
    }

    return (
        <>
            <div className="container">
                <BackHomeHeader />
                <div className="contentBody accountBody">
                    <h1 className='accounth1'>ログイン</h1>
                    <div className="accountForm">
                        <label>ユーザーID</label>
                        <input type="text" value={userID} onChange={(e) => setUserID(e.target.value)} />
                    </div>
                    <div className="accountForm">
                        <label>パスワード</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button className={`button ${isActive()}`} onClick={() => loginClick()}>ログイン</button>
                </div>
            </div>
        </>
    )
}
