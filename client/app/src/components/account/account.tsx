import { useNavigate } from 'react-router-dom';
import './css/account.css';
import { BackHomeHeader } from '../header/header';
import { useEffect, useState, useRef } from 'react';
import { RegisterRequest, LoginRequest, LogoutRequest, IsLoginRequest } from '../axios/auth';
import { User, UserGetRequest } from '../axios/user';
import axios from 'axios';
import "../util/css/util.css";
import { useDispatch } from "react-redux";
import { resetTR, resetDR } from "../redux/slice/calendar";

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

export function Account(): JSX.Element {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User>({ id: "", password: "" })
    const firstCallDone = useRef(false);

    useEffect(() => {
        const userGet = async () => {
            setIsLoading(true);
            await axios(UserGetRequest).then((result) => {
                if (result.status === 200) {
                    setUser(result.data);
                }
                setIsLoading(false);
            }).catch((error) => {
                if (error.response.status === 401) {
                    navigate("/login");
                } else {
                    console.log(error);
                }
                setIsLoading(false);
            });
        };

        // strict modeのための対策
        if (!firstCallDone.current) {
            firstCallDone.current = true;
            userGet();
        }
    }, []);

    const logout = () => {
        axios(LogoutRequest)
            .then(function (response) {
                if (response.status === 200) {
                    dispatch(resetTR());
                    dispatch(resetDR());
                    navigate("/")
                }
            })
            .catch(function (error) {
                alert("ログアウトに失敗しました。")
                console.log(error);
            });
    }

    return (
        <>
            <div className="container">
                <BackHomeHeader />
                <div className="contentBody accountBody">
                    {
                        (isLoading) ?
                            <>Loading....</>
                            : <>
                                <h1 className='accounth1'>アカウント情報</h1>
                                <div className="accountForm">
                                    <label>ユーザーID</label>
                                    <div>{user.id}</div>
                                </div>
                                <button className="button" onClick={() => logout()}>ログアウト</button>
                            </>
                    }
                </div>
            </div>
        </>
    )
}
