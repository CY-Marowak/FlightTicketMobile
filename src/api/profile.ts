import apiClient from "../utils/apiClient"
import { Profile } from "../types/auth"

//取得個人資料
export async function fetchProfile(): Promise<Profile> {
    const res = await apiClient.get("/profile")
    return res.data
}

// 修改密碼
export async function changePassword(payload: any) {
    const res = await apiClient.post("/change_password", payload);
    return res.data;
}