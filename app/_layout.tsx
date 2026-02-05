import { Stack } from "expo-router"
import { AuthProvider } from "../src/auth/AuthContext"
import { RootNavigator } from "../src/navigation/RootNavigator"

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    )
}
