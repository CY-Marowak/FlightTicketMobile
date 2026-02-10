import axios from "axios"
import { FlightSearchResult } from "../types/flight"

const api = axios.create({
    baseURL: "https://flightticketproject.onrender.com",
    timeout: 10000,
})

export interface SearchFlightsParams {
    from: string
    to: string
    depart: string
    return?: string
}

export async function searchFlights(
    params: SearchFlightsParams
): Promise<FlightSearchResult> {
    const res = await api.get("/price", {
        params,
    })
    return res.data
}
