import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { createCampaign } from "../../../src/services/campaignService";
import { getAllProducts } from "../../../src/services/productService";
import { uploadImageAsync } from "../../../src/services/uploadService";
import { pickImage } from "../../../src/utils/pickImage";

export default function AddCampaignScreen() {
  const [banner, setBanner] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  async function pickBannerImage() {
    const uri = await pickImage();
    if (uri) setBanner(uri);
  }

  useEffect(() => {
    async function load() {
      const items = await getAllProducts();
      setProducts(items);
    }
    load();
  }, []);

  function toggleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function save() {
    if (!banner) return alert("Select banner first");
    if (!title.trim()) return alert("Enter campaign title");
    if (selected.length === 0)
      return alert("Select at least one product for the campaign");

    const id = Date.now().toString();

    const bannerUrl = await uploadImageAsync(
      banner,
      `campaigns/${id}/banner.jpg`
    );

    await createCampaign(
      id,
      {
        title,
        productIds: selected, // here we save selected products
      },
      bannerUrl
    );

    alert("Campaign Saved!");
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Create Campaign
      </Text>

      {/* Campaign Title */}
      <Text style={{ marginBottom: 5 }}>Campaign Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter campaign title"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
        }}
      />

      {/* Banner Picker */}
      <Button title="Pick Banner" onPress={pickBannerImage} />

      {banner && (
        <Image
          source={{ uri: banner }}
          style={{
            width: "100%",
            height: 180,
            resizeMode: "cover",
            borderRadius: 12,
            marginTop: 20,
          }}
        />
      )}

      {/* Product Selector */}
      <Text style={{ marginTop: 30, marginBottom: 10, fontWeight: "bold" }}>
        Select Products for Campaign
      </Text>

      {products.map((p) => (
        <TouchableOpacity
          key={p.id}
          onPress={() => toggleSelect(p.id)}
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: selected.includes(p.id) ? "green" : "#ccc",
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>{p.name}</Text>
          <Text style={{ color: "#888" }}>{p.price} USD</Text>
        </TouchableOpacity>
      ))}

      <View style={{ height: 20 }} />
      <Button title="Save Campaign" onPress={save} />
    </ScrollView>
  );
}
