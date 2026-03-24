import axios from "axios"

const api = axios.create({
    baseURL: "https://flightticketproject.onrender.com",
    timeout: 10000,
})

export interface LoginResponse {
    token: string
    user_id: number
    username: string
}

export async function loginApi(
    username: string,
    password: string,
    pushToken?: string | null
): Promise<LoginResponse> {
    const res = await api.post("/login", {
        username,
        password,
        push_token: pushToken
    })
    return res.data
}
