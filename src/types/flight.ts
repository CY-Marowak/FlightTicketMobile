//單一航班
export interface Flight {
    from: string
    to: string
    airline: string
    flight_number: string
    depart_time: string
    arrival_time: string
    price: number
}

//查詢結果 api回傳
export interface FlightSearchResult {
    from: string
    to: string
    outbound_date: string
    return_date: string | null
    flights: Flight[]
    message?: string
}

