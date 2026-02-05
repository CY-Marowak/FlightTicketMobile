import { Stack } from "expo-router"
import { useAuth } from "../auth/useAuth"

export function RootNavigator() {
    const { isAuthenticated, loading } = useAuth()

    if (loading) return null

    return (
        <Stack screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
                <Stack.Screen name="auth" />
            ) : (
                <Stack.Screen name="tabs" />
            )}
        </Stack>
    )
}
