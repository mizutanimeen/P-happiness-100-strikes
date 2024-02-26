import { baseURL } from './axios';

export type MachineCreate = {
    machine_name: string;
    rate: number;
}

export function MachineCreateRequest(data: MachineCreate) {
    const jsonData = JSON.stringify(data);

    return {
        method: 'POST',
        url: `${baseURL}/api/v1/machines`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        data: jsonData,
        withCredentials: true
    }
};

export type MachineGet = {
    id: string;
    user_id: string;
    machine_name: string;
    rate: number;
}

export const MachineGetRequest = {
    method: 'GET',
    url: `${baseURL}/api/v1/machines`,
    headers: {
        "Content-Type": "application/json",
        "Accept": "*/*"
    },
    withCredentials: true
};
