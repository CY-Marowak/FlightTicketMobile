export interface FlightQuery {
    from: string
    to: string
    depart: string
    return?: string
}

export interface FlightResult {
    id?: number
    airline: string
    flight_number: string
    depart_time: string
    arrival_time: string
    price: number
}
