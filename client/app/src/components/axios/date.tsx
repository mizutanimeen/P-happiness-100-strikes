import axios from 'axios';
import { baseURL } from './axios';


export type DateRecords = {
    id: string,
    user_id: string,
    date: string,
    happiness: number,
    create_at: string,
    update_at: string
};

export function DateRecordsGetRequest(start: string, end: string) {
    return {
        method: 'GET',
        url: `${baseURL}/api/v1/records/dates`,
        params: {
            "start": start,
            "end": end
        },
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        withCredentials: true
    }
};
