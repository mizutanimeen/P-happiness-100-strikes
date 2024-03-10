import "../util/css/util.css";
import { BackHomeHeader } from '../header/header';

export function Statistics(): JSX.Element {
    return (
        <div className="container">
            <BackHomeHeader />
            <div className="contentBody">
                <div>Statistics</div>
                <div>This is a statistics page</div>
            </div>
        </div>
    );
}
