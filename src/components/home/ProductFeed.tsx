/*

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
import ProductQuickViewModal from "./ProductQuickViewModal"; // 🔥 import modal
import { router } from "expo-router";

export default function ProductFeed() {
  const [products, setProducts] = useState<any[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null); // 🔥 track selected product
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
    <TouchableOpacity
      style={[styles.card, { width: width / numColumns - 20 }]}
      onPress={() => setQuickViewProduct(item)} // 🔥 open modal
    >
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

      {/* 🔥 Quick View Modal Integration *
      <ProductQuickViewModal
        visible={!!quickViewProduct}
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFull={() => {
          if (quickViewProduct) {
            router.push({ pathname: "/product/[id]", params: { id: quickViewProduct.id } });
            setQuickViewProduct(null);
          }
        }}
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

*/
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import ProductQuickViewModal from "./ProductQuickViewModal";
import { router } from "expo-router";

type Product = {
  id: string;
  name: string;
  price?: number;
  images?: string[];
};

export default function ProductFeed({ isWeb = false }: { isWeb?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { width } = useWindowDimensions();

  // 🔥 Dynamic columns based on device width
  const numColumns =
    width < 500 ? 2 : width < 900 ? 3 : 5;

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const snap = await getDocs(collection(db, "products"));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
    setProducts(list);
  }

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.card, { width: width / numColumns - 20 }]}
      onPress={() => setQuickViewProduct(item)}
    >
      <Image
        source={{ uri: item.images?.[0] ?? "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <Text numberOfLines={1} style={styles.name}>
        {item.name}
      </Text>
      {item.price !== undefined && (
        <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
      )}
    </TouchableOpacity>
  );

  if (isWeb) {
    // 🔥 Web/Desktop → ScrollView grid
    return (
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          padding: 8,
          gap: 12,
        }}
      >
        {products.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { width: width / numColumns - 20 }]}
            onPress={() => setQuickViewProduct(item)}
          >
            <Image
              source={{ uri: item.images?.[0] ?? "https://via.placeholder.com/150" }}
              style={styles.image}
            />
            <Text numberOfLines={1} style={styles.name}>
              {item.name}
            </Text>
            {item.price !== undefined && (
              <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
            )}
          </TouchableOpacity>
        ))}

        <ProductQuickViewModal
          visible={!!quickViewProduct}
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onViewFull={() => {
            if (quickViewProduct) {
              router.push({
                pathname: "/product/[id]",
                params: { id: quickViewProduct.id },
              });
              setQuickViewProduct(null);
            }
          }}
        />
      </ScrollView>
    );
  }

  // 🔥 Mobile/Tablet → FlatList
  return (
    <>
      <FlatList
        data={products}
        renderItem={renderItem}
        numColumns={numColumns}
        key={numColumns}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: "flex-start" }}
        showsVerticalScrollIndicator={false}
      />
      <ProductQuickViewModal
        visible={!!quickViewProduct}
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFull={() => {
          if (quickViewProduct) {
            router.push({
              pathname: "/product/[id]",
              params: { id: quickViewProduct.id },
            });
            setQuickViewProduct(null);
          }
        }}
      />
    </>
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
    height: 90,
    borderRadius: 6,
    marginBottom: 4,
    resizeMode: "cover",
  },
  name: { fontSize: 12, fontWeight: "600" },
  price: { fontSize: 12, fontWeight: "bold", color: "#e67e22", marginTop: 2 },
});