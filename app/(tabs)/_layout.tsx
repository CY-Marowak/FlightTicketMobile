import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons" // 圖示庫

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#1a73e8", // 選中時的顏色 (Google Blue)
                tabBarInactiveTintColor: "#666",  // 未選中時的顏色
                tabBarStyle: {
                    paddingBottom: 5,
                    height: 60,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "首頁",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="flights"
                options={{
                    title: "查詢航班",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="airplane-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="tracked"
                options={{
                    title: "我的航班",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: "通知紀錄",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="notifications-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "個人資料",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
