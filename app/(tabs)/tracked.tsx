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
    RefreshControl,
    Modal,
    ScrollView
} from "react-native"
import { useFocusEffect } from "expo-router"
import { getTrackedFlights, deleteTrackedFlight, getPriceHistory } from "../../src/api/trackedFlights"
import { TrackedFlight } from "../../src/types/flight"
import { GlobalStyles } from "../../src/constants/Styles"

export default function TrackedPage() {
    const [flights, setFlights] = useState<TrackedFlight[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [history, setHistory] = useState<{ time: string, price: number }[]>([])
    const [showHistory, setShowHistory] = useState(false)

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

    // 處理查看歷史
    const handleViewHistory = async (id: number) => {
        try {
            const data = await getPriceHistory(id)
            setHistory(data)
            setShowHistory(true)
        } catch (error: any) {
            const msg = error.response?.data?.message || "目前尚無歷史票價"
            Alert.alert("提示", msg)
        }
    }

    const renderItem = ({ item }: { item: TrackedFlight }) => (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.cardMain}
                onPress={() => handleViewHistory(item.id)} // [點擊卡片查看歷史]
            >
                <View style={styles.header}>
                    <Text style={styles.route}>{item.from} → {item.to}</Text>
                    <Text style={styles.price}>NT$ {item.price.toLocaleString()}</Text>
                </View>
                <Text style={styles.info}>{item.airline} · {item.flight_number}</Text>
                <Text style={styles.time}>{item.depart_time} → {item.arrival_time}</Text>
                <Text style={styles.historyHint}>點擊查看追蹤以來價格趨勢 📈</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
            >
                <Text style={styles.deleteText}>刪除</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <SafeAreaView style={GlobalStyles.safeArea}>

            <View style={GlobalStyles.titleContainer}>
                <Text style={GlobalStyles.pageTitle}>我的航班</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#1a73e8" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={flights}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 15, paddingBottom: 100 }} // 增加底部內距
                    removeClippedSubviews={true} // 優化效能
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
            {/* 歷史票價 Modal */}
            <Modal visible={showHistory} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>價格趨勢歷史</Text>
                        <ScrollView style={{ maxHeight: 300 }}>
                            {history.map((h, index) => (
                                <View key={index} style={styles.historyRow}>
                                    <Text style={styles.historyTime}>{h.time}</Text>
                                    <Text style={styles.historyPrice}>NT$ {h.price.toLocaleString()}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => setShowHistory(false)}
                        >
                            <Text style={styles.closeBtnText}>關閉</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 15,
        flexDirection: "row",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        overflow: "hidden", // 確保按鈕不會超出卡片
    },
    cardMain: { flex: 1, padding: 15 },
    header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
    route: { fontSize: 18, fontWeight: "bold" },
    price: { fontSize: 18, fontWeight: "bold", color: "#d93025" },
    info: { color: "#666", fontSize: 14 },
    time: { color: "#444", marginTop: 5 },
    deleteBtn: {
        backgroundColor: "#fff5f5",
        alignSelf: "stretch", // 自動撐開
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center", // 文字置中
        borderBottomRightRadius: 12,
        borderLeftWidth: 1,
        borderLeftColor: "#ffe3e3",
    },
    deleteText: { color: "#ff4d4f", fontWeight: "bold" },
    empty: { textAlign: "center", marginTop: 100, color: "#999", fontSize: 16 },
    historyHint: {
        fontSize: 12,
        color: "#1a73e8",
        marginTop: 8,
        fontStyle: "italic",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    historyRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    historyTime: { color: "#666", fontSize: 13 },
    historyPrice: { fontWeight: "bold", color: "#d93025" },
    closeBtn: {
        backgroundColor: "#1a73e8",
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
    },
    closeBtnText: { color: "#fff", fontWeight: "bold" }
})