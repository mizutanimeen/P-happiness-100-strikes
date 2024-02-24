import axios from 'axios';
import { baseURL } from './axios';

export const IsLoginRequest = {
    method: 'GET',
    url: `${baseURL}/login/check`,
    headers: {
        "Content-Type": "application/json",
        "Accept": "*/*"
    },
    withCredentials: true
};


export function RegisterRequest(userID: string, password: string) {
    return {
        method: 'POST',
        url: `${baseURL}/register`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        data: {
            "user_id": userID,
            "password": password
        },
        withCredentials: true
    };
}

export function LoginRequest(userID: string, password: string) {
    return {
        method: 'POST',
        url: `${baseURL}/login`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        data: {
            "user_id": userID,
            "password": password
        },
        withCredentials: true
    }
};

export const LogoutRequest = {
    method: 'GET',
    url: `${baseURL}/logout`,
    headers: {
        "Content-Type": "application/json",
        "Accept": "*/*"
    },
    withCredentials: true
};
