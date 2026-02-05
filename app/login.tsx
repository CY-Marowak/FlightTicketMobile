/*import { View, Text, TextInput, Button, StyleSheet } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"
import { useAuth } from "../src/auth/useAuth"

export default function Login() {
    const { login } = useAuth()
    const router = useRouter()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    async function handleLogin() {
        try {
            await login(username, password)
            router.replace("/") // 回到 index.tsx
        } catch {
            setError("登入失敗")
        }
    }

    return (
        <View />
        
        <View style={styles.container}>
            <Text style={styles.title}>FlightTicketTracker</Text>

            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button title="登入" onPress={handleLogin} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 24,
    },
    input: {
        borderWidth: 1,
        padding: 12,
        marginBottom: 12,
    },
    error: {
        color: "red",
        marginBottom: 12,
    },
})
*/

import { View, Text } from "react-native";
export default function Login() {
    return (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <Text>測試頁面</Text>
        </View>
    );
}