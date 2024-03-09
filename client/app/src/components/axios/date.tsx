import { baseURL } from './axios';

export type DateRecordGet = {
    id: string,
    date: string,
    happiness: number
};

export type DateRecordsGet = {
    [date: string]: DateRecordGet
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

export type DateRecordPost = {
    date: string, // "2006-01-02"
    happiness: number
};

export function DateRecordPostRequest(data: DateRecordPost) {
    const jsonData = JSON.stringify(data);

    return {
        method: 'POST',
        url: `${baseURL}/api/v1/records/dates`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        data: jsonData,
        withCredentials: true
    }
}

export type DateRecordPut = {
    date_record_id: string,
    happiness: number
};

export function DateRecordPutRequest(data: DateRecordPut) {
    const jsonData = JSON.stringify(data);

    return {
        method: 'PUT',
        url: `${baseURL}/api/v1/records/dates`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        data: jsonData,
        withCredentials: true
    }
}
