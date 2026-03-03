import apiClient from "../utils/apiClient"
import { Notification } from "../types/notification"

export async function getNotifications(): Promise<Notification[]> {
    const res = await apiClient.get("/notifications");
    return res.data;
}