import * as SecureStore from "expo-secure-store"

const TOKEN_KEY = "flightticket_token"

export async function saveToken(token: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export async function loadToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY)
}

export async function clearToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
}
