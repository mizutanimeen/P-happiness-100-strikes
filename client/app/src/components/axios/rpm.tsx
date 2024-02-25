import { baseURL } from './axios';

/*

type createRPMRecordRequest struct {
    InvestmentMoney int    `json:"investment_money"`
    InvestmentBall  int    `json:"investment_ball"`
    StartRPM        int    `json:"start_rpm"`
    EndRPM          int    `json:"end_rpm"`
    MachineID       string `json:"machine_id"`
}
*/

export type RPMRecordCreate = {
    investment_money: number;
    investment_ball: number;
    start_rpm: number;
    end_rpm: number;
    machine_id: number;
}

export function RPMRecordCreateRequest(id: string, data: RPMRecordCreate) {
    const jsonData = JSON.stringify(data);

    return {
        method: 'POST',
        url: `${baseURL}/api/v1/records/times/${id}/rpms`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        data: jsonData,
        withCredentials: true
    }
};


export type RPMRecordGet = {
    id: string;
    investment_money: number;
    investment_ball: number;
    start_rpm: number;
    end_rpm: number;
    machine_id: number;
}

export function RPMRecordGetRequest(id: string) {
    return {
        method: 'GET',
        url: `${baseURL}/api/v1/records/times/${id}/rpms`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        withCredentials: true
    }
};
