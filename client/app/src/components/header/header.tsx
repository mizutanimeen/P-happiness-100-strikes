import { Link } from 'react-router-dom';
import './css/header.css';

export function BackHomeHeader(): JSX.Element {
    return <>
        <div className="headerContainer">
            <Link to="/">Home</Link>
        </div>
    </>
}
