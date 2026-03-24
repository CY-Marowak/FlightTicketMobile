import { useState, useCallback } from "react"
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl
} from "react-native"
import { useFocusEffect } from "expo-router"
import { getNotifications } from "../../src/api/notifications"
import { Notification } from "../../src/types/notification"
import { GlobalStyles } from "../../src/constants/Styles"

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications()
            setNotifications(data)
        } catch (error) {
            console.error("無法獲取通知:", error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchNotifications()
        }, [])
    )

    const renderItem = ({ item }: { item: Notification }) => (
        <View style={styles.notifCard}>
            <View style={styles.notifIcon}>
                <Text style={{ fontSize: 20 }}>🔔</Text>
            </View>
            <View style={styles.notifBody}>
                <View style={styles.notifHeader}>
                    <Text style={styles.notifTime}>{new Date(item.time).toLocaleString("zh-TW")}</Text>
                    <Text style={styles.notifPrice}>NT$ {item.price.toLocaleString()}</Text>
                </View>
                <Text style={styles.notifMessage}>{item.message}</Text>
            </View>
        </View>
    )

    return (
        <SafeAreaView style={GlobalStyles.safeArea}>
            <View style={GlobalStyles.titleContainer}>
                <Text style={GlobalStyles.pageTitle}>通知紀錄</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#1a73e8" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 15 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                setRefreshing(true)
                                fetchNotifications()
                            }}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>目前沒有任何降價通知</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    notifCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "flex-start",
        // 陰影樣式
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    notifIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#e8f0fe",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    notifBody: {
        flex: 1,
    },
    notifHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    notifTime: {
        fontSize: 12,
        color: "#999",
    },
    notifPrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#d93025",
    },
    notifMessage: {
        fontSize: 15,
        color: "#333",
        lineHeight: 20,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: "center",
    },
    emptyText: {
        color: "#999",
        fontSize: 16,
    }
})