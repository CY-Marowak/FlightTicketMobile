import { Redirect } from "expo-router"
import { useAuth } from "../src/auth/useAuth"

export default function Index() {
    const { isAuthenticated, loading } = useAuth()

    if (loading) return null

    if (!isAuthenticated) {
        return <Redirect href="/auth" />
    }

    return <Redirect href="/tabs/flights" />
}
