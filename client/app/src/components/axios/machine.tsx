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

export const MachinesGetRequest = {
    method: 'GET',
    url: `${baseURL}/api/v1/machines`,
    headers: {
        "Content-Type": "application/json",
        "Accept": "*/*"
    },
    withCredentials: true
};

export type MachineGet = {
    id: number;
    user_id: string;
    machine_name: string;
    rate: number;
}

export function MachineGetRequest(machineID: number) {
    return {
        method: 'GET',
        url: `${baseURL}/api/v1/machines/${machineID}`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        withCredentials: true
    }
};

export function MachineDeleteRequest(machineID: number) {
    return {
        method: 'DELETE',
        url: `${baseURL}/api/v1/machines`,
        params: {
            "machine_id": machineID
        },
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        withCredentials: true
    }
};
