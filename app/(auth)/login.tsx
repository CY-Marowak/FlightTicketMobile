import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"
import { useAuth } from "../../src/auth/useAuth"
import { register } from "../../src/api/auth" 
import { registerForPushNotificationsAsync } from "../../src/services/notifications";

export default function Login() {
    const { login } = useAuth()
    const router = useRouter()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // 處理登入
    async function handleLogin() {
        if (!username || !password) return setError("請輸入帳號密碼");
        setLoading(true);
        setError("");

        try {
            // 嘗試獲取 Expo Push Token
            let pushToken = null;
            try {
                pushToken = await registerForPushNotificationsAsync();
            } catch (tokenErr) {
                console.log("無法取得推播 Token:", tokenErr);
            }
            //呼叫登入 API，把 push_token 塞進去
            await login(username, password, pushToken);

            router.replace("/")
        } catch (e: any) {
            if (e.response) {
                const serverErrorMessage = e.response.data?.error || e.response.data?.message;
                setError(serverErrorMessage || "伺服器錯誤");
            } else if (e.request) {
                // 請求已送出，但沒收到回應 (伺服器沒開、網路斷線)
                setError("連不上伺服器，請確認網路或稍後再試")
            } else {
                // 設定請求時發生其他錯誤
                setError("發生未知錯誤，請稍後再試")
            }
        } finally {
            setLoading(false);
        }
    }

    // 處理註冊
    async function handleRegister() {
        if (!username || !password) return setError("請輸入帳號密碼");
        setLoading(true);
        setError("");
        try {
            await register(username, password);
            Alert.alert("註冊成功", "現在可以登入了！");
        } catch (e: any) {
            setError(e.response?.data?.error || "註冊失敗，該帳號可能已被使用");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.logoText}>✈️</Text>
                <Text style={styles.title}>FlightTracker</Text>
                <Text style={styles.subtitle}>便宜機票追蹤</Text>
            </View>

            <View style={styles.inputCard}>
                <TextInput
                    placeholder="使用者名稱"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <TextInput
                    placeholder="密碼"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                {loading ? (
                    <ActivityIndicator size="large" color="#1a73e8" style={{ marginVertical: 10 }} />
                ) : (
                    <View style={styles.buttonGroup}>
                        {/* 登入按鈕 */}
                        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
                            <Text style={styles.buttonText}>登入</Text>
                        </TouchableOpacity>

                        {/* 註冊按鈕 */}
                        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleRegister}>
                            <Text style={[styles.buttonText, { color: "#1a73e8" }]}>註冊新帳號</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f7fa",
        justifyContent: "center",
        padding: 24,
    },
    headerBox: {
        alignItems: "center",
        marginBottom: 40,
    },
    logoText: {
        fontSize: 50,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1a1a1a",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
    },
    inputCard: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 15,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    input: {
        backgroundColor: "#f9f9f9",
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    error: {
        color: "#d93025",
        marginBottom: 15,
        textAlign: "center",
        fontWeight: "500",
    },
    buttonGroup: {
        marginTop: 10,
    },
    button: {
        height: 50,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    loginButton: {
        backgroundColor: "#1a73e8",
    },
    registerButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#1a73e8",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
})