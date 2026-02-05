import { View, Text, TextInput, Button, StyleSheet } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"
import { useAuth } from "../../src/auth/useAuth"

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
            setError("Login Failed")
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FlightTicketTracker</Text>

            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none" // 關閉自動大寫
                autoCorrect={false}   // 關閉自動修正
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button title="Login" onPress={handleLogin} />
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
