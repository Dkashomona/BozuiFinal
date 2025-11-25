import { doc, getDoc } from "firebase/firestore";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Campaign } from "../../models/Campaign";
import { getCampaigns } from "../../services/campaignService";
import { db } from "../../services/firebase";
import CampaignModal from "./CampaignModal";

const { width } = Dimensions.get("window");

// 🔥 Responsive banner height: larger on web/desktop, smaller on mobile
const bannerHeight = Platform.OS === "web" || width > 900 ? 200 : 60;

export default function CampaignSlider() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignProducts, setCampaignProducts] = useState<Record<string, any[]>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  /** LOAD CAMPAIGNS + PRODUCTS */
  const load = useCallback(async () => {
    const data = await getCampaigns();
    setCampaigns(data);

    const productMap: Record<string, any[]> = {};

    for (const c of data) {
      const list: any[] = [];
      const ids = Array.isArray(c.productIds) ? c.productIds : [];

      for (const pid of ids) {
        const ref = doc(db, "products", pid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          list.push({ id: pid, ...snap.data() });
        }
      }

      productMap[c.id] = list;
    }

    setCampaignProducts(productMap);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (campaigns.length > 0) {
      setActiveIndex(0);
      scrollRef.current?.scrollTo({ x: 0, animated: false });
    }
  }, [campaigns.length]);

  /** AUTO-SLIDER */
  useEffect(() => {
    if (campaigns.length <= 1 || paused) return;

    const timeout = setTimeout(() => {
      const next = (activeIndex + 1) % campaigns.length;
      setActiveIndex(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    }, 4000);

    return () => clearTimeout(timeout);
  }, [activeIndex, campaigns.length, paused]);

  const hoverProps =
    Platform.OS === "web"
      ? {
          onMouseEnter: () => setPaused(true),
          onMouseLeave: () => setPaused(false),
        }
      : {};

  if (campaigns.length === 0) return null;

  return (
    <View style={{ marginTop: 16 }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔥 Featured Deals</Text>
      </View>

      <View {...hoverProps}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {campaigns.map((c) => (
            <Pressable
              key={c.id}
              style={{ width }}
              onPress={() => setSelectedCampaign(c)} // <<< OPEN MODAL
            >
              <View style={styles.bannerWrapper}>
                {c.bannerImage ? (
                  <Image source={{ uri: c.bannerImage }} style={styles.banner} />
                ) : (
                  <View style={[styles.banner, styles.bannerPlaceholder]}>
                    <Text>No banner</Text>
                  </View>
                )}

                {/* Campaign label */}
                <View style={styles.textWrap}>
                  <View style={styles.campaignLabel}>
                    <Text style={styles.campaignLabelText}>{c.title}</Text>
                  </View>
                </View>
              </View>

              {/* Products under banner */}
              <ScrollView
                horizontal
                style={{ marginTop: 8, paddingLeft: 8 }}
                showsHorizontalScrollIndicator={false}
              >
                {(campaignProducts[c.id] ?? []).map((p) => (
                  <View key={p.id} style={styles.productCard}>
                    <Image
                      source={{ uri: p.images?.[0] ?? "https://via.placeholder.com/80" }}
                      style={styles.productImage}
                    />
                    <Text numberOfLines={1} style={styles.productName}>
                      {p.name}
                    </Text>
                    {"price" in p && (
                      <Text style={styles.productPrice}>${Number(p.price).toFixed(2)}</Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.dots}>
        {campaigns.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { opacity: i === activeIndex ? 1 : 0.3 }]}
          />
        ))}
      </View>

      {/* MODAL */}
      <CampaignModal
        visible={!!selectedCampaign}
        campaign={selectedCampaign}
        products={
          selectedCampaign ? campaignProducts[selectedCampaign.id] ?? [] : []
        }
        onClose={() => setSelectedCampaign(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  bannerWrapper: {
    position: "relative",
  },
  banner: {
    width: "100%",
    height: bannerHeight, // 🔥 responsive height
    resizeMode: "cover",
    borderRadius: 8,
  },
  bannerPlaceholder: {
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    height: bannerHeight,
    borderRadius: 8,
  },
  textWrap: {
    position: "absolute",
    left: 12,
    bottom: 12,
  },
  campaignLabel: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  campaignLabelText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  productCard: {
    width: 100,
    marginRight: 8,
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 70,
    borderRadius: 6,
    marginBottom: 4,
    backgroundColor: "#eee",
  },
  productName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#e67e22",
    textAlign: "center",
    marginTop: 2,
  },
  dots: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    marginHorizontal: 3,
  },
});