import { createContext, useEffect, useState } from "react"
import { saveToken, loadToken, clearToken } from "./token"
import { loginApi } from "./authApi"
import { socket } from "../services/socket"
import { jwtDecode } from "jwt-decode"
import * as Notifications from 'expo-notifications'

// 設定通知處理 (App 在前台時也顯示彈窗)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

interface AuthContextType {
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    login: (username: string, password: string, pushToken?: string | null) => Promise<void>
    logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    // App 啟動初始化
    useEffect(() => {
        async function init() {
            const saved = await loadToken()
            if (saved) setToken(saved)
            setLoading(false)

            // 請求通知權限
            const { status } = await Notifications.getPermissionsAsync()
            if (status !== 'granted') {
                await Notifications.requestPermissionsAsync()
            }
        }
        init()
    }, [])

    //監聽 Token 變動來管理 Socket 與通知
    useEffect(() => {
        if (token) {
            try {
                // 1. 解析 User ID
                const decoded: any = jwtDecode(token)
                const userId = decoded.user_id

                if (userId) {
                    // 2. 連接 Socket
                    socket.connect()

                    // 3. 監聽降價事件
                    const eventName = `price_alert_user_${userId}`
                    socket.on(eventName, async (data) => {
                        // 觸發手機系統通知
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: "💰 降價通知！",
                                body: `${data.flight_number} 目前票價為 NT$ ${data.price.toLocaleString()}，快去看看！`,
                                data: { flight_number: data.flight_number },
                            },
                            trigger: null,
                        })
                    })

                    console.log(`📡 Socket 連接中，監聽頻道: ${eventName}`)
                }
            } catch (e) {
                console.error("Token 解析或 Socket 初始化失敗", e)
            }
        } else {
            // 如果沒 token，斷開連線並移除監聽
            socket.disconnect()
            socket.offAny() // 移除所有監聽器
        }

        return () => {
            socket.disconnect()
            socket.offAny()
        }
    }, [token])

    async function login(username: string, password: string, pushToken?: string | null) {
        const data = await loginApi(
            username,
            password,
            pushToken
        )
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