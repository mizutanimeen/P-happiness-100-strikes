import { CalendarBody } from './body'
import { CalendarHeader } from './header'
import { CalendarFooter } from './footer'
import './css/calendar.css';

export function Calendar() {
    return (
        <>
            <CalendarHeader />
            {/* TODO: スワイプで月移動 */}
            <CalendarBody />
            <CalendarFooter />
        </>
    )
}

/*
https://almonta2021blog.com/react-calendar-javascript/
https://zenn.dev/t_keshi/articles/react-query-prescription
*/
