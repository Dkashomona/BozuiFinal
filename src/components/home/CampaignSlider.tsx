import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Campaign } from "../../models/Campaign";
import { getCampaigns } from "../../services/campaignService";

const { width } = Dimensions.get("window");

export default function CampaignSlider() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const data = await getCampaigns();
      setCampaigns(data);
      console.log("Loaded campaigns:", data);
    }
    load();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (campaigns.length === 0) return;

    const timer = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (activeIndex + 1) % campaigns.length;
        scrollRef.current.scrollTo({ x: nextIndex * width, animated: true });
        setActiveIndex(nextIndex);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [activeIndex, campaigns]);

  if (campaigns.length === 0) {
    return (
      <View style={{ height: 180, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#aaa" }}>Loading campaign...</Text>
      </View>
    );
  }

  return (
    <View>
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
          <View key={c.id} style={{ width }}>
            <Image
              source={{ uri: c.bannerImage }}
              style={styles.banner}
              onError={() => console.log("Failed loading", c.bannerImage)}
            />

            <View style={styles.textWrap}>
              <Text style={styles.title}>{c.title}</Text>
              {c.subtitle && <Text style={styles.subtitle}>{c.subtitle}</Text>}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      <View style={styles.dots}>
        {campaigns.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { opacity: i === activeIndex ? 1 : 0.3 }
            ]}
          />
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    borderRadius: 12,
  },
  textWrap: {
    position: "absolute",
    bottom: 15,
    left: 20
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: "white",
    fontSize: 16,
  },
  dots: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 8
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    marginHorizontal: 4
  }
});
