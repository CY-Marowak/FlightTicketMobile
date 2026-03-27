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
    ScrollView,
    Dimensions
} from "react-native"
import { useFocusEffect } from "expo-router"
import { LineChart } from "react-native-chart-kit"
import { getTrackedFlights, deleteTrackedFlight, getPriceHistory } from "../../src/api/trackedFlights"
import { TrackedFlight } from "../../src/types/flight"
import { GlobalStyles } from "../../src/constants/Styles"

// 取得螢幕寬度供圖表使用
const screenWidth = Dimensions.get("window").width;

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

    useFocusEffect(
        useCallback(() => {
            fetchFlights()
        }, [])
    )

    const getChartData = () => {
        if (history.length === 0) return null;
        // 為了不讓 X 軸文字擠死，我們只挑選 5 個時間標籤
        const step = Math.ceil(history.length / 5)
        
        return {
            labels: history.map((h, i) => 
                i % step === 0 ? new Date(h.time).toLocaleDateString("zh-TW", { month: 'numeric', day: 'numeric' }) : ""
            ),
            datasets: [
                {
                    data: history.map(h => h.price),
                    color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`, // Google Blue
                    strokeWidth: 2 
                }
            ],
        }
    }

    const chartConfig = {
        backgroundColor: "#fff",
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0, // 價格不顯示小數點
        color: (opacity = 1) => `rgba(26, 115, 232, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: { r: "4", strokeWidth: "2", stroke: "#1a73e8" }
    }

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
            {/* 主卡片區：預留給未來跳轉訂票頁面使用 */}
            <TouchableOpacity
                style={styles.cardMain}
                onPress={() => {
                    console.log("跳轉至訂票頁面:", item.flight_number)
                    // 目前保留點擊效果但不進行跳轉
                }}
            >
                <View style={styles.header}>
                    <Text style={styles.route}>{item.from} → {item.to}</Text>
                    <Text style={styles.price}>NT$ {item.price.toLocaleString()}</Text>
                </View>
                <Text style={styles.info}>{item.airline} · {item.flight_number}</Text>
                <Text style={styles.time}>{item.depart_time} → {item.arrival_time}</Text>
            </TouchableOpacity>

            {/* 右側操作按鈕區 */}
            <View style={styles.actionContainer}>
                {/* 趨勢按鈕 */}
                <TouchableOpacity
                    style={styles.historyBtn}
                    onPress={() => handleViewHistory(item.id)}
                >
                    <Text style={styles.historyBtnText}>價格趨勢</Text>
                </TouchableOpacity>

                {/* 刪除按鈕 */}
                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item.id)}
                >
                    <Text style={styles.deleteText}>刪除</Text>
                </TouchableOpacity>
            </View>
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
                    contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
                    removeClippedSubviews={true}
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

            <Modal visible={showHistory} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>價格趨勢歷史</Text>

                        {history.length > 1 ? (
                            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                <LineChart
                                    data={getChartData()!}
                                    width={screenWidth * 0.75} // Modal 寬度約 85%，圖表再縮一點
                                    height={200}
                                    chartConfig={chartConfig}
                                    bezier // 讓線條變平滑（貝茲曲線）
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16
                                    }}
                                    fromZero={false}
                                />
                            </View>
                        ) : history.length === 1 ? (
                            <Text style={styles.onlyOneData}>目前只有一筆紀錄，無法產生趨勢圖</Text>
                        ) : null}

                        <Text style={[styles.modalTitle, { fontSize: 14, marginTop: 10 }]}>詳細記錄</Text>
                        <ScrollView style={{ maxHeight: 300 }}>
                            {history.length > 0 ? (
                                history.map((h, index) => (
                                    <View key={index} style={styles.historyRow}>
                                        <Text style={styles.historyTime}>{new Date(h.time).toLocaleString("zh-TW")}</Text>
                                        <Text style={styles.historyPrice}>NT$ {h.price.toLocaleString()}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={{ textAlign: 'center', padding: 20, color: '#999' }}>尚無歷史數據</Text>
                            )}
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
        overflow: "hidden",
    },
    cardMain: {
        flex: 1,
        padding: 15
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5
    },
    route: {
        fontSize: 16,
        fontWeight: "bold"
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#d93025"
    },
    info: {
        color: "#666",
        fontSize: 13
    },
    time: {
        color: "#444",
        marginTop: 5,
        fontSize: 13
    },
    actionContainer: {
        flexDirection: "row", // 按鈕水平併排，若想垂直請改為 column
        alignItems: "stretch",
    },
    historyBtn: {
        backgroundColor: "#f0f7ff",
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "center",
        borderLeftWidth: 1,
        borderLeftColor: "#e1effe",
    },
    historyBtnText: {
        color: "#1a73e8",
        fontWeight: "bold",
        fontSize: 14,
    },
    deleteBtn: {
        backgroundColor: "#fff5f5",
        paddingHorizontal: 15,
        justifyContent: "center",
        alignItems: "center",
        borderLeftWidth: 1,
        borderLeftColor: "#ffe3e3",
    },
    deleteText: {
        color: "#ff4d4f",
        fontWeight: "bold",
        fontSize: 14,
    },
    empty: {
        textAlign: "center",
        marginTop: 100,
        color: "#999",
        fontSize: 16
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
    historyTime: {
        color: "#666",
        fontSize: 13
    },
    historyPrice: {
        fontWeight: "bold",
        color: "#d93025"
    },
    onlyOneData: {
        textAlign: 'center',
        color: '#666',
        padding: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 10
    },
    closeBtn: {
        backgroundColor: "#1a73e8",
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
    },
    closeBtnText: {
        color: "#fff",
        fontWeight: "bold"
    }
})