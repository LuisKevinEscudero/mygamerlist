// AdBannerPlaceholder.js
import React from "react";
import { View, Text } from "react-native";

export default function AdBanner({ adUnitID }) {
  if (!adUnitID) return null; // no renderiza si no hay ID

  try {
    return (
      <View
        style={{
          margin: 8,
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: "#ccc",
          height: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#555", fontSize: 16 }}>
          📢 Banner Placeholder
        </Text>
        <Text style={{ color: "#888", fontSize: 12 }}>
          ID: {adUnitID}
        </Text>
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
