import { View, Text, FlatList, StyleSheet } from "react-native";
import { useCartStore } from "../../src/store/cartStore";
import CartButton from "../../src/components/cart/CartButton";

export default function CartScreen() {
  const items = useCartStore((s) => s.items);

  return (
    <View style={styles.page}>
      <Text style={styles.title}>🛒 Your Cart</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <CartButton product={item} showPriceDetails/>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
  },
  name: { flex: 1, fontWeight: "600" },
  price: { fontWeight: "bold", color: "#e67e22" },
});