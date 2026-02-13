// src/constants/Styles.ts
import { StyleSheet, Platform, StatusBar } from 'react-native';

export const GlobalStyles = StyleSheet.create({
    // 頁面最外層容器（處理 Android 狀態列）
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    // 統一的標題容器
    titleContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: "#fff",
    },
    // 統一的標題字體
    pageTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1a1a1a",
    },
    // 萬用的卡片陰影 (iOS & Android)
    cardShadow: {
        backgroundColor: "#fff",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    }
});