import { useState } from "react";
import { GetMonthDays, CalendarBody } from './body'



export const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState<Date[][]>(GetMonthDays());
    return (
        <>
            <CalendarBody currentMonth={currentMonth} />
        </>
    )
}

/*
Redux 
Material-UI
https://almonta2021blog.com/react-calendar-javascript/
*/
