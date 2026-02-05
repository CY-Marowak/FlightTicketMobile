import { useState } from "react"
import {
    View,
    Text,
    TextInput,
    Button,
    ActivityIndicator,
    FlatList,
    StyleSheet
} from "react-native"
import { searchFlights } from "../../src/api/flights"
import { FlightResult } from "../../src/types/flight"

export default function FlightsScreen() {
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [depart, setDepart] = useState("")

    const [results, setResults] = useState<FlightResult[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSearch() {
        if (!from || !to || !depart) {
            setError("請填寫完整查詢條件")
            return
        }

        try {
            setLoading(true)
            setError(null)

            const data = await searchFlights({
                from,
                to,
                depart
            })

            setResults(data)
        } catch (err) {
            setError("查詢失敗，請稍後再試")
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>查詢航班</Text>

            <TextInput
                style={styles.input}
                placeholder="出發地（例如 TPE）"
                value={from}
                onChangeText={setFrom}
            />

            <TextInput
                style={styles.input}
                placeholder="目的地（例如 NRT）"
                value={to}
                onChangeText={setTo}
            />

            <TextInput
                style={styles.input}
                placeholder="出發日期（YYYY-MM-DD）"
                value={depart}
                onChangeText={setDepart}
            />

            <Button title="查詢" onPress={handleSearch} />

            {loading && <ActivityIndicator style={{ marginTop: 16 }} />}

            {error && <Text style={styles.error}>{error}</Text>}

            <FlatList
                data={results}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>{item.airline}</Text>
                        <Text>{item.flight_number}</Text>
                        <Text>
                            {item.depart_time} → {item.arrival_time}
                        </Text>
                        <Text style={styles.price}>${item.price}</Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 12
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginBottom: 8,
        borderRadius: 4
    },
    error: {
        color: "red",
        marginTop: 8
    },
    card: {
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        marginTop: 12
    },
    price: {
        fontWeight: "bold",
        marginTop: 4
    }
})
