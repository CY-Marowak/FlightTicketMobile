export interface LoginRequest {
    username: string
    password: string
}

export interface LoginResponse {
    token: string
}

export interface Profile {
    user_id: number
    username: string
    created_at: string
}
