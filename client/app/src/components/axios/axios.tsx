import axios from 'axios';
// 月が替わったら
/* 
    axios 
    TanStack Query(React Query)
    Redux
 */
const serverPort = 3001;

export const UserGetRequest = {
    method: 'GET',
    url: `http://localhost:${serverPort}/api/v1/users`,
    headers: {
        "Content-Type": "application/json",
        "Accept": "*/*"
    },
    withCredentials: true
};

export function RegisterRequest(user_id: string, password: string) {
    return {
        method: 'POST',
        url: `http://localhost:${serverPort}/register`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        data: {
            "user_id": user_id,
            "password": password
        },
        withCredentials: true
    };
}

export function LoginRequest(user_id: string, password: string) {
    return {
        method: 'POST',
        url: `http://localhost:${serverPort}/login`,
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        data: {
            "user_id": user_id,
            "password": password
        },
        withCredentials: true
    }
};

/*        axios(loginConfig)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
*/
