import { router } from "expo-router";
import { useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  Text,
  TextInput,
} from "react-native";
import ProductMultiSelect from "../../../src/components/admin/ProductMultiSelect";
import { createCampaign } from "../../../src/services/campaignService";
import { uploadImageAsync } from "../../../src/services/uploadService";
import { pickImage } from "../../../src/utils/pickImage";

export default function AddCampaignPage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [banner, setBanner] = useState<string | null>(null);
  const [productIds, setProductIds] = useState<string[]>([]);

  async function chooseBanner() {
    const uri = await pickImage();
    if (uri) setBanner(uri);
  }

  async function save() {
    if (!title.trim()) return alert("Enter title");
    if (!banner) return alert("Pick banner");

    const id = Date.now().toString();

    const bannerUrl = await uploadImageAsync(
      banner,
      `campaigns/${id}/banner.jpg`
    );

    await createCampaign(id, {
      title,
      subtitle,
      productIds,
    }, bannerUrl);

    alert("Campaign created");
    router.push("/admin/campaigns");
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Create Campaign</Text>

      <Text style={{ marginTop: 15 }}>Title</Text>
      <TextInput value={title} onChangeText={setTitle} style={input} />

      <Text>Subtitle</Text>
      <TextInput value={subtitle} onChangeText={setSubtitle} style={input} />

      <Button title="Pick Banner" onPress={chooseBanner} />

      {banner && (
        <Image
          source={{ uri: banner }}
          style={{ width: "100%", height: 150, borderRadius: 10, marginTop: 10 }}
        />
      )}

      <ProductMultiSelect selected={productIds} onChange={setProductIds} />

      <Button title="Create Campaign" onPress={save} />
    </ScrollView>
  );
}

const input = {
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 10,
  borderRadius: 8,
  marginVertical: 10,
};
