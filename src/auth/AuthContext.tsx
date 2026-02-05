import { createContext, useEffect, useState } from "react"
import { saveToken, loadToken, clearToken } from "./token"
import { loginApi } from "./authApi"

interface AuthContextType {
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    login: (username: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    // App 啟動時自動登入
    useEffect(() => {
        async function init() {
            const saved = await loadToken()
            if (saved) {
                setToken(saved)
            }
            setLoading(false)
        }
        init()
    }, [])

    async function login(username: string, password: string) {
        const data = await loginApi(username, password)
        await saveToken(data.token)
        setToken(data.token)
    }

    async function logout() {
        await clearToken()
        setToken(null)
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: !!token,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
