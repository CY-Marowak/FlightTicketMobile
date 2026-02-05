import { Platform } from 'react-native';

// 僅在開發環境下強制關閉可能的 Fabric 引用
if (__DEV__) {
    console.log("Running in development mode");
}


import { Stack } from "expo-router";
export default function RootLayout() {
    return <Stack />;
}