import { Link, useNavigate } from 'react-router-dom';
import './css/account.css';
import { BackHomeHeader } from '../header/header';
import { useEffect, useState } from 'react';
import { RegisterRequest, LoginRequest, LogoutRequest } from '../axios/auth';
import { UserGetRequest, User } from '../axios/user';
import { IsLoginRequest } from '../axios/auth';
import axios from 'axios';
import "../util/css/util.css";
import { useQuery } from '@tanstack/react-query'

export function Register(): JSX.Element {
    const navigate = useNavigate();

    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isActive = (): string => {
        if (userID && password && confirmPassword) {
            return "accountActive";
        } else {
            return "accountInactive";
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
                    navigate("/")
                    return;
                }
                // TODO: ステータスコードが他にあるか
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
                    <button className={isActive()} onClick={() => registerClick()}>登録</button>
                </div>
            </div>
        </>
    )
}

export function Login(): JSX.Element {
    const navigate = useNavigate();

    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');

    const isActive = (): string => {
        if (userID && password) {
            return "accountActive";
        } else {
            return "accountInactive";
        }
    }

    const loginClick = () => {
        if (!(userID && password)) {
            return;
        }

        axios(LoginRequest(userID, password))
            .then(function (response) {
                if (response.status === 200) {
                    navigate("/")
                    return;
                }
                // TODO: ステータスコードが他にあるか
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
                    <h1>ログイン</h1>
                    <div className="accountForm">
                        <label>ユーザーID</label>
                        <input type="text" value={userID} onChange={(e) => setUserID(e.target.value)} />
                    </div>
                    <div className="accountForm">
                        <label>パスワード</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button className={isActive()} onClick={() => loginClick()}>ログイン</button>
                </div>
            </div>
        </>
    )
}

export function Account(): JSX.Element {
    const navigate = useNavigate();
    const [user, setUser] = useState<User>({ id: "", password: "" })

    const logoutClick = () => {
        axios(LogoutRequest)
            .then(function (response) {
                if (response.status === 200) {
                    navigate("/")
                    return;
                }
                // TODO: ステータスコードが他にあるか
            })
            .catch(function (error) {
                // TODO: エラーによってメッセージを変える
                alert("ログアウトに失敗しました。")
            });
    }

    useEffect(() => {
        axios(UserGetRequest)
            .then(function (response) {
                if (response.status === 200) {
                    setUser(response.data)
                    return;
                }
                // TODO: ステータスコードが他にあるか
            })
            .catch(function (error) {
                console.log(error)
                alert(error)
            })
    }, []);

    return (
        <>
            <div className="container">
                <BackHomeHeader />
                <div className="contentBody accountBody">
                    <h1>アカウント情報</h1>
                    <div className="accountForm">
                        <label>ユーザーID</label>
                        <div>{user.id}</div>
                    </div>
                    <button onClick={() => logoutClick()}>ログアウト</button>
                </div>
            </div>
        </>
    )
}