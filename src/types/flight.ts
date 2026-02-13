//基礎航班資訊
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

// 追蹤中的航班 (繼承 Flight 並加上 ID)
export interface TrackedFlight extends Flight {
    id: number; // 後端 SQLite 的主鍵
}
// 搜尋結果 API 回傳
export interface FlightSearchResult {
    from: string
    to: string
    outbound_date: string
    return_date: string | null
    flights: Flight[]
    message?: string
}

