import { baseURL } from './axios';

export type User = {
    id: string,
    password: string
}

export const UserGetRequest = {
    method: 'GET',
    url: `${baseURL}/api/v1/users`,
    headers: {
        "Content-Type": "application/json",
        "Accept": "*/*"
    },
    withCredentials: true
};
