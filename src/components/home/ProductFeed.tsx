import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ProductFeed() {
  const [products, setProducts] = useState<any[]>([]);
  const { width } = useWindowDimensions();

  // 🔥 Dynamic columns based on device width
  const numColumns =
    width < 500 ? 2 :      // small phone
    width < 900 ? 3 :      // tablets / small desktop
    5;                     // wide desktop screens

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const snap = await getDocs(collection(db, "products"));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setProducts(list);
  }

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={[styles.card, { width: width / numColumns - 20 }]}>
      <Image
        source={{ uri: item.images?.[0] ?? "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <Text numberOfLines={1} style={styles.name}>
        {item.name}
      </Text>
      {"price" in item && (
        <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ marginTop: 10 }}>
      <FlatList
        data={products}
        renderItem={renderItem}
        numColumns={numColumns}
        key={numColumns} // 🔥 rerender layout on resize
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: "flex-start" }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 6,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#0002",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
  },
  image: {
    width: "100%",
    height: 90, // 🔥 smaller image height
    borderRadius: 6,
    marginBottom: 4,
    resizeMode: "cover",
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
  },
  price: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#e67e22",
    marginTop: 2,
  },
});