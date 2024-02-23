import React from "react";
import './css/footer.css';
import { Link } from 'react-router-dom';

export function CalendarFooter(): JSX.Element {
    return <>
        <div className="footer">
            <Link to="/register"><button>新規登録</button></Link>
            <Link to="/login"><button>ログイン</button></Link>
        </div >
    </>
}
