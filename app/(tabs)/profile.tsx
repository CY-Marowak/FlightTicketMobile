import { useState, useEffect } from "react"
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView
} from "react-native"
import { useRouter } from "expo-router"
import { fetchProfile, changePassword } from "../../src/api/profile"
import { Profile } from "../../src/types/auth"
import { GlobalStyles } from "../../src/constants/Styles"
import * as SecureStore from "expo-secure-store"

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<Profile | null>(null)
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const data = await fetchProfile()
            setUser(data)
        } catch (error) {
            Alert.alert("錯誤", "無法載入使用者資料")
        }
    }

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            Alert.alert("提示", "請輸入舊密碼與新密碼")
            return
        }
        setLoading(true)
        try {
            await changePassword({ old_password: oldPassword, new_password: newPassword })
            Alert.alert("成功", "密碼已更新")
            setOldPassword("")
            setNewPassword("")
        } catch (error: any) {
            Alert.alert("錯誤", error.response?.data?.error || "密碼更新失敗")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        Alert.alert("登出", "確定要登出嗎？", [
            { text: "取消", style: "cancel" },
            {
                text: "確定",
                style: "destructive",
                onPress: async () => {
                    // 1. 清除 Token
                    await SecureStore.deleteItemAsync("token")
                    // 2. 跳轉回登入頁面 (假設路由是 /login)
                    router.replace("/login")
                }
            }
        ])
    }

    return (
        <SafeAreaView style={GlobalStyles.safeArea}>
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                <View style={GlobalStyles.titleContainer}>
                    <Text style={GlobalStyles.pageTitle}>個人資料</Text>
                </View>

                {/* 使用者資訊卡片 */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>使用者名稱</Text>
                        <Text style={styles.infoValue}>{user?.username || "載入中..."}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>使用者 ID</Text>
                        <Text style={styles.infoValue}>#{user?.user_id}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>註冊時間</Text>
                        <Text style={styles.infoValue}>{new Date(user?.created_at).toLocaleString("zh-TW")}</Text>
                    </View>
                </View>

                {/* 修改密碼區塊 */}
                <View style={styles.actionSection}>
                    <Text style={styles.sectionTitle}>更改密碼</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="輸入舊密碼"
                        secureTextEntry
                        value={oldPassword}
                        onChangeText={setOldPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="輸入新密碼"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: "#1a73e8" }]}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        <Text style={styles.btnText}>{loading ? "處理中..." : "修改密碼"}</Text>
                    </TouchableOpacity>
                </View>

                {/* 登出按鈕 */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutBtnText}>登出帳號</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    infoSection: {
        backgroundColor: "#fff",
        margin: 20,
        padding: 20,
        borderRadius: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: "#eee",
    },
    infoLabel: { color: "#666", fontSize: 14 },
    infoValue: { fontWeight: "bold", color: "#333", fontSize: 15 },
    actionSection: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#1a1a1a",
    },
    input: {
        backgroundColor: "#f9f9f9",
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#eee",
    },
    btn: {
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
    },
    btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    logoutBtn: {
        marginTop: 40,
        alignSelf: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    logoutBtnText: { color: "#d93025", fontWeight: "bold", fontSize: 16 }
})