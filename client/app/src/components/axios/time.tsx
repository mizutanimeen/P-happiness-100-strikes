import { baseURL } from './axios';


export type TimeRecordCreate = {
    date_time: string; // "2021-08-01 00:00:00"
    investment_money: number;
    recovery_money: number;
}

export function TimeRecordCreateRequest(data: TimeRecordCreate) {
    const jsonData = JSON.stringify(data);

    return {
        method: 'POST',
        url: `${baseURL}/api/v1/records/times`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        data: jsonData,
        withCredentials: true
    }
};

export type TimeRecordGet = {
    id: string;
    date_time: string;
    investment_money: number;
    recovery_money: number;
}

export function TimeRecordGetRequest(id: string) {
    return {
        method: 'GET',
        url: `${baseURL}/api/v1/records/times/${id}`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        withCredentials: true
    }
};

export type TimeRecordUpdate = {
    id: string;
    date_time: string;
    investment_money: number;
    recovery_money: number;
}

export function TimeRecordUpdateRequest(data: TimeRecordUpdate) {
    const jsonData = JSON.stringify(data);

    return {
        method: 'PUT',
        url: `${baseURL}/api/v1/records/times`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        data: jsonData,
        withCredentials: true
    }
};
