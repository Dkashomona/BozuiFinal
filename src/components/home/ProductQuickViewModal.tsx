import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProductQuickViewModal({
  visible,
  product,
  onClose,
  onViewFull,
}: {
  visible: boolean;
  product: any | null;
  onClose: () => void;
  onViewFull: () => void;
}) {
  // ❗Hooks MUST be called BEFORE any return
  const [imgIndex, setImgIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [error, setError] = useState("");

  // If product not loaded -> show nothing
  if (!product) return null;

  const images = product.images ?? [];
  const sizes = product.sizes ?? ["S", "M", "L", "XL"];
  const colors = product.colors ?? ["Black", "White", "Blue"];

  const handleAddToCart = () => {
    if (!size || !color) {
      setError("Please select size & color before adding to cart.");
      return;
    }

    setError("");

    console.log("ADD TO CART:", {
      id: product.id,
      size,
      color,
    });

    onClose();
  };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />

      <View style={styles.container}>
        {/* Images */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / width
            );
            setImgIndex(index);
          }}
        >
          {images.map((img: string, i: number) => (
            <Image
              key={i}
              source={{ uri: img }}
              style={styles.image}
            />
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={styles.dots}>
          {images.map((_: any, i: React.Key | null | undefined) => (
            <View
              key={i}
              style={[
                styles.dot,
                { opacity: i === imgIndex ? 1 : 0.3 },
              ]}
            />
          ))}
        </View>

        {/* Info */}
        <Text style={styles.name}>{product.name}</Text>
        {product.price !== undefined && (
          <Text style={styles.price}>${product.price}</Text>
        )}

        {/* SIZE */}
        <Text style={styles.label}>Select Size *</Text>
        <View style={styles.optionsRow}>
          {sizes.map((s: string) => (
            <TouchableOpacity
              key={s}
              onPress={() => setSize(s)}
              style={[
                styles.option,
                size === s && styles.optionSelected,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  size === s && styles.optionTextSelected,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* COLOR */}
        <Text style={styles.label}>Select Color *</Text>
        <View style={styles.optionsRow}>
          {colors.map((c: string) => (
            <TouchableOpacity
              key={c}
              onPress={() => setColor(c)}
              style={[
                styles.option,
                color === c && styles.optionSelected,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  color === c && styles.optionTextSelected,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        {/* Buttons */}
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fullBtn} onPress={onViewFull}>
          <Text style={styles.fullText}>View Full Product</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  container: {
    position: "absolute",
    left: "6%",
    right: "6%",
    top: "10%",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
  },
  image: {
    width: width * 0.8,
    height: 280,
    alignSelf: "center",
    borderRadius: 12,
  },
  dots: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#333",
    marginHorizontal: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  price: {
    fontSize: 16,
    color: "#e67e22",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 14,
  },
  label: {
    marginTop: 10,
    fontWeight: "bold",
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
    gap: 6,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: "#3498db",
  },
  optionText: {
    fontSize: 14,
  },
  optionTextSelected: {
    color: "white",
    fontWeight: "bold",
  },
  error: {
    marginTop: 10,
    color: "red",
  },
  cartBtn: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  cartText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  fullBtn: {
    borderColor: "#222",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  fullText: {
    textAlign: "center",
    fontWeight: "600",
  },
  closeBtn: {
    padding: 10,
  },
  closeText: {
    textAlign: "center",
    color: "#666",
    fontWeight: "bold",
  },
});
