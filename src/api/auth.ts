import api from "./client"
import { LoginRequest, LoginResponse, Profile } from "../types/auth"

export async function login(data: LoginRequest): Promise<LoginResponse> {
    const res = await api.post("/login", data)
    return res.data
}

export async function fetchProfile(): Promise<Profile> {
    const res = await api.get("/profile")
    return res.data
}
