import { useNavigate } from 'react-router-dom';
import { BackHomeHeader } from '../header/header';
import { useState } from 'react';
import { RegisterRequest } from '../axios/auth';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { resetTR, resetDR } from "../redux/slice/calendar";
import './css/account.css';
import "../util/css/util.css";

// TODO: 登録済みの方はこちらを作る。ログインも同様
export function Register(): JSX.Element {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isActive = (): string => {
        if (userID && password && confirmPassword) {
            return "Active";
        } else {
            return "Inactive";
        }
    }

    const registerClick = () => {
        if (!(userID && password && confirmPassword)) {
            return;
        }

        if (password.length < 6) {
            alert('パスワードは6文字以上で設定してください');
            return;
        }
        if (password !== confirmPassword) {
            alert('パスワードが一致しません');
            return;
        }

        axios(RegisterRequest(userID, password))
            .then(function (response) {
                if (response.status === 201) {
                    dispatch(resetTR());
                    dispatch(resetDR());
                    navigate("/")
                }
            })
            .catch(function (error) {
                console.log(error)
                // TODO: エラーによってメッセージを変える
                alert("ユーザーIDが既に存在しています。")
            });
    }

    return (
        <>
            <div className="container">
                <BackHomeHeader />
                <div className="contentBody accountBody">
                    <h1 className="accounth1">新規登録</h1>
                    <div className="accountForm">
                        <label>ユーザーID</label>
                        <input type="text" value={userID} onChange={(e) => setUserID(e.target.value)} />
                    </div>
                    <div className="accountForm">
                        <label>パスワード</label>
                        <span>(6文字以上)</span>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="accountForm">
                        <label>確認用パスワード</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <button className={`button ${isActive()}`} onClick={() => registerClick()}>登録</button>
                </div>
            </div>
        </>
    )
}
