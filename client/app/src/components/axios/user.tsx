import axios from 'axios';
import { baseURL } from './axios';

type User = {
    id: string,
    password: string
}

const UserGetRequest = {
    method: 'GET',
    url: `${baseURL}/api/v1/users`,
    headers: {
        "Content-Type": "application/json",
        "Accept": "*/*"
    },
    withCredentials: true
};
