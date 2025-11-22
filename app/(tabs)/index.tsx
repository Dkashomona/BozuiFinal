import { router } from "expo-router";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import CampaignSlider from "../../src/components/home/CampaignSlider";
import ProductFeed from "../../src/components/home/ProductFeed";
import SearchBar from "../../src/components/home/SearchBar";
import LogoutButton from "../../src/components/LogoutButton";
import { useAuth } from "../../src/store/authStore";

export default function HomeScreen() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      {/* ADMIN BADGE */}
      {role === "admin" && (
        <View style={styles.adminBadge}>
          <Text style={styles.adminText}>ADMIN</Text>
        </View>
      )}

      {/* ADMIN DASHBOARD BUTTON */}
      {role === "admin" && (
        <View style={{ marginBottom: 16 }}>
          <Button
            title="🛠 Go to Admin Dashboard"
            onPress={() => router.push("/admin")}
          />
        </View>
      )}

      {/* SEARCH + CAMPAIGNS + PRODUCTS */}
      <SearchBar />
      <CampaignSlider />
      <ProductFeed />

      {/* LOGOUT BUTTON */}
      <View style={{ marginTop: 20 }}>
        <LogoutButton />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 16 },

  adminBadge: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  adminText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
