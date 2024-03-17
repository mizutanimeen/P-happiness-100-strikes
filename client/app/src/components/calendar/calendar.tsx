import { CalendarBody } from './body/body'
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
