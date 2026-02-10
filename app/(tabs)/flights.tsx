import { useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Platform
} from "react-native"

import { searchFlights } from "../../src/api/flights"
import { Flight } from "../../src/types/flight"

export default function FlightsPage() {
    // 預設搜尋值
    const [from, setFrom] = useState("TPE")
    const [to, setTo] = useState("OKA")
    const [depart, setDepart] = useState("2026-03-28")
    const [returnDate, setReturnDate] = useState("2026-04-01")

    const [flights, setFlights] = useState<Flight[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    async function onSearch() {
        if (!from || !to || !depart) {
            setError("請填寫出發地、目的地與出發日期")
            return
        }

        try {
            setLoading(true)
            setError(null)
            setMessage(null)
            setFlights([])

            const result = await searchFlights({
                from,
                to,
                depart,
                return: returnDate || undefined,
            })

            if (result.message) {
                setMessage(result.message)
            }
            setFlights(result.flights || [])
        } catch (e) {
            setError("查詢航班失敗，請稍後再試")
        } finally {
            setLoading(false)
        }
    }

    // 關鍵 1: 將表單移至此函數，讓它成為 FlatList 的一部分
    const renderSearchForm = () => (
        <View style={styles.formContainer}>
            <Text style={styles.headerTitle}>搜尋便宜機票</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>出發地</Text>
                <TextInput
                    placeholder="例如: TPE"
                    value={from}
                    onChangeText={setFrom}
                    style={styles.input}
                    autoCapitalize="characters"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>目的地</Text>
                <TextInput
                    placeholder="例如: NRT"
                    value={to}
                    onChangeText={setTo}
                    style={styles.input}
                    autoCapitalize="characters"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>出發日期</Text>
                <TextInput
                    placeholder="YYYY-MM-DD"
                    value={depart}
                    onChangeText={setDepart}
                    style={styles.input}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>回程日期 (選填)</Text>
                <TextInput
                    placeholder="YYYY-MM-DD"
                    value={returnDate}
                    onChangeText={setReturnDate}
                    style={styles.input}
                />
            </View>

            <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
                <Text style={styles.buttonText}>搜尋航班</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#1a73e8" style={{ marginTop: 20 }} />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {message && <Text style={styles.messageText}>{message}</Text>}
        </View>
    )

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <FlatList
                data={flights}
                keyExtractor={(_, i) => i.toString()}
                // 關鍵 2: 將搜尋表單設為 Header，這樣它就會跟著列表一起滑動
                ListHeaderComponent={renderSearchForm}
                // 增加底部間距，防止最後一個項目被 Tab Bar 擋住
                contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item }) => (
                    <View style={styles.flightCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.routeText}>{item.from} → {item.to}</Text>
                            <Text style={styles.airlineBadge}>{item.airline}</Text>
                        </View>
                        <Text style={styles.flightInfo}>{item.flight_number}</Text>
                        <Text style={styles.timeText}>{item.depart_time} → {item.arrival_time}</Text>
                        <Text style={styles.priceText}>NT$ {item.price.toLocaleString()}</Text>
                    </View>
                )}
                // 如果沒有資料時顯示的文字
                ListEmptyComponent={!loading && !error && !message ? (
                    <Text style={styles.emptyText}>請輸入條件並點擊搜尋</Text>
                ) : null}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    formContainer: {
        padding: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 8,
        borderColor: "#f0f2f5", // 視覺分割線
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#1a1a1a",
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
        marginLeft: 2,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: "#f9f9f9",
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: "#1a73e8",
        height: 50,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    flightCard: {
        backgroundColor: "#fff",
        marginHorizontal: 15,
        marginTop: 15,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eee",
        // 卡片陰影
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    routeText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    airlineBadge: {
        fontSize: 12,
        color: "#1a73e8",
        backgroundColor: "#e8f0fe",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        overflow: "hidden",
    },
    flightInfo: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    timeText: {
        fontSize: 14,
        color: "#444",
        marginTop: 8,
    },
    priceText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#d93025",
        textAlign: "right",
        marginTop: 10,
    },
    errorText: { color: "#d93025", marginTop: 15, textAlign: "center" },
    messageText: { color: "#666", marginTop: 15, textAlign: "center" },
    emptyText: { textAlign: "center", marginTop: 40, color: "#999", fontSize: 16 },
})