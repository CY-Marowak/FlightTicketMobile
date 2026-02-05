import api from "./client"
import { FlightQuery, FlightResult } from "../types/flight"

export async function searchFlights(
    params: FlightQuery
): Promise<FlightResult[]> {
    const res = await api.get("/price", { params })
    return res.data
}
