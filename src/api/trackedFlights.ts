import apiClient from "../utils/apiClient"
import { Flight, TrackedFlight } from "../types/flight"

// 加入追蹤清單
export async function addTrackedFlight(flight: Flight) {
    const res = await apiClient.post("/flights", flight)
    return res.data
}

// 取得追蹤清單
export async function getTrackedFlights(): Promise<TrackedFlight[]> {
    const res = await apiClient.get("/flights")
    return res.data
}

// 刪除追蹤
export async function deleteTrackedFlight(id: number) {
    const res = await apiClient.delete(`/flights/${id}`)
    return res.data
}
