import { Tabs } from "expo-router"

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="index" options={{ title: "首頁" }} />
            <Tabs.Screen name="flights" options={{ title: "查詢" }} />
            <Tabs.Screen name="tracked" options={{ title: "追蹤" }} />
            <Tabs.Screen name="notifications" options={{ title: "通知" }} />
            <Tabs.Screen name="profile" options={{ title: "我" }} />
        </Tabs>
    )
}
