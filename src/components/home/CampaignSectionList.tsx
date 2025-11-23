import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getCampaigns } from "../../services/campaignService";
import { db } from "../../services/firebase";

export default function CampaignSectionList() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignProducts, setCampaignProducts] = useState<any>({});

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getCampaigns();
    setCampaigns(data);

    const map: any = {};

    for (let c of data) {
      const list: any[] = [];

      for (let pid of c.productIds || []) {
        const snap = await getDoc(doc(db, "products", pid));
        if (snap.exists()) {
          list.push({ id: pid, ...snap.data() });
        }
      }

      map[c.id] = list;
    }

    setCampaignProducts(map);
  }

  return (
    <View>
      {campaigns.map((c) => (
        <View key={c.id} style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            {c.title}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(campaignProducts[c.id] || []).map((p: any) => (
              <TouchableOpacity
                key={p.id}
                style={{
                  width: 140,
                  marginRight: 12,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  padding: 10,
                  elevation: 2,
                }}
              >
                <Image
                  source={{ uri: p.images?.[0] }}
                  style={{ width: "100%", height: 120, borderRadius: 8 }}
                />
                <Text numberOfLines={2} style={{ marginTop: 6, fontWeight: "500" }}>
                  {p.name}
                </Text>
                <Text style={{ color: "#e67e22", fontWeight: "bold", marginTop: 3 }}>
                  ${p.price}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
}
