// AdBannerStatic.js
import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import LottieView from "lottie-react-native";
import loadingAnim from "../assets/loading.json"; // tu animación

const { width: windowWidth } = Dimensions.get("window");

export default function AdBannerStatic({ adUnitID }) {
  const [loading, setLoading] = useState(true);
  if (!adUnitID) return null;

  const unitId = adUnitID || TestIds.BANNER;

  return (
    <View
      style={{
        margin: 8,
        borderRadius: 12,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        minHeight: 60,
        width: "100%"
      }}
    >
      {loading && (
        <View style={styles.loadingOverlay}>
          <LottieView
            source={loadingAnim}
            autoPlay
            loop
            style={{ width: 80, height: 80 }}
          />
        </View>
      )}

      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        onAdLoaded={() => setLoading(false)}
        onAdFailedToLoad={(err) => {
          console.log("Error al cargar banner estático:", err);
          setLoading(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "#fff",
  },
});
