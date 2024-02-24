import axios from 'axios';
import { baseURL } from './axios';

export const DayRecordsGetRequest = {
    method: 'GET',
    url: `${baseURL}/api/v1/records/dates`,
    headers: {
        "Content-Type": "application/json",
        "Accept": "*/*"
    },
    withCredentials: true
};
