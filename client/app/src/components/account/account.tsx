import { useNavigate } from 'react-router-dom';
import { BackHomeHeader } from '../header/header';
import { useEffect, useState, useRef } from 'react';
import { LogoutRequest } from '../axios/auth';
import { User, UserGetRequest } from '../axios/user';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { resetTR, resetDR } from "../redux/slice/calendar";
import './css/account.css';
import "../util/css/util.css";

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
