import apiClient from "../utils/apiClient"
import { LoginRequest, LoginResponse } from "../types/auth"

//µn¤J
export async function login(data: LoginRequest): Promise<LoginResponse> {
    const res = await apiClient.post("/login", data)
    return res.data
}

