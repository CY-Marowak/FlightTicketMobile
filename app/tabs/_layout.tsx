import { Tabs } from "expo-router"

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="flights" options={{ title: "航班" }} />
            <Tabs.Screen name="tracked" options={{ title: "追蹤" }} />
            <Tabs.Screen name="notifications" options={{ title: "通知" }} />
            <Tabs.Screen name="profile" options={{ title: "個人" }} />

            {/* 如果有不需要顯示在底部欄的檔案，請將 href 設為 null */}
            <Tabs.Screen name="index" options={{ href: null }} />
        </Tabs>
    );
}
