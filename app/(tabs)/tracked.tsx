import { useState, useCallback } from "react"
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl
} from "react-native"
import { useFocusEffect } from "expo-router"
import { getTrackedFlights, deleteTrackedFlight } from "../../src/api/trackedFlights"
import { TrackedFlight } from "../../src/types/flight"

export default function TrackedPage() {
    const [flights, setFlights] = useState<TrackedFlight[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    // 載入資料
    const fetchFlights = async () => {
        try {
            const data = await getTrackedFlights()
            setFlights(data)
        } catch (error) {
            console.error(error)
            Alert.alert("錯誤", "無法獲取追蹤清單")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    // 每次切換回此 Tab 時都會重新抓取
    useFocusEffect(
        useCallback(() => {
            fetchFlights()
        }, [])
    )

    // 處理刪除
    const handleDelete = (id: number) => {
        Alert.alert("取消追蹤", "確定要刪除此航班嗎？", [
            { text: "取消", style: "cancel" },
            {
                text: "確定刪除",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteTrackedFlight(id)
                        setFlights(prev => prev.filter(f => f.id !== id))
                    } catch (error) {
                        Alert.alert("錯誤", "刪除失敗")
                    }
                }
            }
        ])
    }

    const renderItem = ({ item }: { item: TrackedFlight }) => (
        <View style={styles.card}>
            <View style={styles.cardMain}>
                <View style={styles.header}>
                    <Text style={styles.route}>{item.from} → {item.to}</Text>
                    <Text style={styles.price}>NT$ {item.price.toLocaleString()}</Text>
                </View>
                <Text style={styles.info}>{item.airline} · {item.flight_number}</Text>
                <Text style={styles.time}>{item.depart_time} → {item.arrival_time}</Text>
            </View>

            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
            >
                <Text style={styles.deleteText}>刪除</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>我的追蹤清單</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#1a73e8" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={flights}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 15 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => {
                            setRefreshing(true)
                            fetchFlights()
                        }} />
                    }
                    ListEmptyComponent={
                        <Text style={styles.empty}>目前沒有追蹤中的航班</Text>
                    }
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa" },
    titleContainer: { padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 24, fontWeight: "bold" },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardMain: { flex: 1, padding: 15 },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
    route: { fontSize: 18, fontWeight: "bold" },
    price: { fontSize: 18, fontWeight: "bold", color: "#d93025" },
    info: { color: "#666", fontSize: 14 },
    time: { color: "#444", marginTop: 5 },
    deleteBtn: {
        backgroundColor: "#fff5f5",
        height: "100%",
        paddingHorizontal: 20,
        justifyContent: "center",
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        borderLeftWidth: 1,
        borderLeftColor: "#ffe3e3",
    },
    deleteText: { color: "#ff4d4f", fontWeight: "bold" },
    empty: { textAlign: "center", marginTop: 100, color: "#999", fontSize: 16 }
})