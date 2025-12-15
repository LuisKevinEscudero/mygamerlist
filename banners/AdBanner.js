import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import LottieView from "lottie-react-native";
import loadingAnim from "../assets/loading.json"; // tu animación

export default function AdBanner({ adUnitID }) {
  const [loading, setLoading] = useState(true);
  const unitId = adUnitID || TestIds.BANNER;

  try {
    return (
      <View style={styles.bannerContainer}>
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
          onAdFailedToLoad={(error) => {
            console.log("Error al cargar banner:", error);
            setLoading(false);
          }}
        />
      </View>
    );
  } catch (e) {
    console.log("Banner no cargado:", e);
    return (
      <View style={{ margin: 8, padding: 20, backgroundColor: "#eee" }}>
        <Text>Anuncio no disponible</Text>
      </View>
    );
  }
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
   bannerContainer: {
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    minHeight: 60,
    width: "100%",
  }
});
