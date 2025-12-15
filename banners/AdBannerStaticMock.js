import React from "react";
import { View, Text } from "react-native";

export default function AdBannerPlaceholder() {
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
        <Text style={{ color: "#555", fontSize: 16, fontWeight: "bold" }}>
          📢 Banner Placeholder
        </Text>
        <Text style={{ color: "#888", fontSize: 12 }}>Banner estático</Text>
      </View>
    );
  } catch (e) {
    console.log("Banner no cargado:", e);
    return (
      <View
        style={{
          margin: 8,
          padding: 20,
          backgroundColor: "#eee",
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Anuncio no disponible</Text>
      </View>
    );
  }
}
