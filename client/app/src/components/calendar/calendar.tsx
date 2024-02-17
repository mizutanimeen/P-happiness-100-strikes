import { useState } from "react";
import { CalendarBody } from './body'
import { CalendarHeader } from './header'
import { CalendarFooter } from './footer'
import './css/calendar.css';

export function Calendar() {
    const [currentMonthDiff, setCurrentMonthDiff] = useState<number>(0);

    return (
        <>
            <CalendarHeader currentMonthDiff={currentMonthDiff} />
            {/* TODO: Headerの中にbutton入れる */}
            <div className="monthButton">
                <button onClick={() => {
                    setCurrentMonthDiff(currentMonthDiff - 1);
                }}>←</button>
                <button onClick={() => {
                    setCurrentMonthDiff(currentMonthDiff + 1);
                }}>→</button>
            </div>
            {/* TODO: スワイプで月移動 */}
            <CalendarBody currentMonthDiff={currentMonthDiff} />
            <CalendarFooter />
        </>
    )
}

/*
Redux 
https://almonta2021blog.com/react-calendar-javascript/
*/
