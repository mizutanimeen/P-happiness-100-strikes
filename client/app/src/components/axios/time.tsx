import { baseURL } from './axios';


export type CreateTimeRecord = {
    date_time: string; // "2021-08-01 00:00:00"
    investment_money: number;
    recovery_money: number;
}

export function TimeRecordCreateRequest(data: CreateTimeRecord) {
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
