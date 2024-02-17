import { useState } from "react";
import { getMonthDays, CalendarBody } from './body'
import { CalendarHeader } from './header'


export function Calendar() {
    const [currentMonthDays, setCurrentMonthDays] = useState<Date[][]>(getMonthDays());
    return (
        <>
            <CalendarHeader />
            <CalendarBody currentMonthDays={currentMonthDays} />
        </>
    )
}

/*
Redux 
Material-UI
https://almonta2021blog.com/react-calendar-javascript/
*/
