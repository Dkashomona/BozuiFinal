import { StyleSheet, Text, View } from "react-native";

export default function ProductFeed() {
  return (
    <View>
      <Text style={styles.title}>Products</Text>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          [ Product Feed will appear here ]
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  placeholder: {
    height: 200,
    backgroundColor: "#ddd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#555",
  },
});
