import apiClient from "../utils/apiClient"
import { LoginRequest, LoginResponse } from "../types/auth"

//µn¤J
export async function login(data: LoginRequest): Promise<LoginResponse> {
    const res = await apiClient.post("/login", data)
    return res.data
}

//µù¥U
export async function register(username: string, password: string) {
    const res = await apiClient.post("/register", { username, password });
    return res.data;
}

