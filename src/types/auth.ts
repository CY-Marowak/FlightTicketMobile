export interface LoginRequest {
    username: string
    password: string
    push_token?: string | null
}

export interface LoginResponse {
    token: string
    user_id: number;
    username: string;
}

export interface Profile {
    user_id: number
    username: string
    created_at: string
}
