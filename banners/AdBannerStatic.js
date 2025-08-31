// AdBannerStatic.js
import React from "react";
import { View, Text, Dimensions } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

const { width: windowWidth } = Dimensions.get("window");

export default function AdBannerStatic({ adUnitID }) {
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
      }}
    >
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdFailedToLoad={(err) =>
          console.log("Error al cargar banner estático:", err)
        }
      />
    </View>
  );
}
