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

const { width } = Dimensions.get("window");

export default function CampaignSlider() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignProducts, setCampaignProducts] = useState<
    Record<string, any[]>
  >({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

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
        // pid must be just "1763…" (NOT "products/1763…")
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

  /** Ensure we start at first slide when campaigns load */
  useEffect(() => {
    if (campaigns.length > 0) {
      setActiveIndex(0);
      scrollRef.current?.scrollTo({ x: 0, animated: false });
    }
  }, [campaigns.length]);

  /** AUTO-SLIDER: one timeout per step, pause-aware */
  useEffect(() => {
    if (campaigns.length <= 1 || paused) return;

    const timeout = setTimeout(() => {
      const next = (activeIndex + 1) % campaigns.length;
      setActiveIndex(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    }, 4000);

    return () => clearTimeout(timeout);
  }, [activeIndex, campaigns.length, paused]);

  /** Hover pause for web */
  const hoverProps =
    Platform.OS === "web"
      ? {
          onMouseEnter: () => setPaused(true),
          onMouseLeave: () => setPaused(false),
        }
      : {};

  if (campaigns.length === 0) {
    return null; // nothing to show yet
  }

  return (
    <View style={{ marginTop: 16 }}>
      {/* Section header (only once – remove any other “Featured Deals” on Home) */}
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
            const index = Math.round(
              e.nativeEvent.contentOffset.x / width
            );
            setActiveIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {campaigns.map((c) => (
            <Pressable
              key={c.id}
              style={{ width }}
              onPress={() => setPaused((p) => !p)} // tap to pause/resume
            >
              {/* Banner */}
              <View style={styles.bannerWrapper}>
                {c.bannerImage ? (
                  <Image
                    source={{ uri: c.bannerImage }}
                    style={styles.banner}
                  />
                ) : (
                  <View style={[styles.banner, styles.bannerPlaceholder]}>
                    <Text style={{ color: "#666" }}>No banner</Text>
                  </View>
                )}

                {/* Floating campaign label */}
                <View style={styles.textWrap}>
                  <View style={styles.campaignLabel}>
                    <Text style={styles.campaignLabelText}>
                      {c.title}
                    </Text>
                  </View>
                  {c.subtitle ? (
                    <Text style={styles.subtitle}>{c.subtitle}</Text>
                  ) : null}
                </View>
              </View>

              {/* Horizontal small product cards */}
              <ScrollView
                horizontal
                style={{ marginTop: 10, paddingLeft: 10 }}
                showsHorizontalScrollIndicator={false}
              >
                {(campaignProducts[c.id] ?? []).map((p) => (
                  <View key={p.id} style={styles.productCard}>
                    {p.images?.[0] ? (
                      <Image
                        source={{ uri: p.images[0] }}
                        style={styles.productImage}
                      />
                    ) : (
                      <View style={styles.productImagePlaceholder}>
                        <Text style={{ fontSize: 10, color: "#777" }}>
                          No image
                        </Text>
                      </View>
                    )}

                    <Text
                      numberOfLines={1}
                      style={styles.productName}
                    >
                      {p.name}
                    </Text>
                    {"price" in p && (
                      <Text style={styles.productPrice}>
                        ${Number(p.price).toFixed(2)}
                      </Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {campaigns.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { opacity: i === activeIndex ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bannerWrapper: {
    position: "relative",
  },
  banner: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    borderRadius: 12,
    overflow: "hidden",
  },
  bannerPlaceholder: {
    backgroundColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
  },
  textWrap: {
    position: "absolute",
    left: 16,
    bottom: 16,
  },
  campaignLabel: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  campaignLabelText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  subtitle: {
    color: "white",
    fontSize: 12,
  },
  productCard: {
    width: 110,
    marginRight: 10,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
  },
  productImagePlaceholder: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  productName: {
    marginTop: 4,
    fontSize: 12,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#e67e22",
  },
  dots: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
