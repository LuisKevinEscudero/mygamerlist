import React from "react";
import { View, Text } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";

export default function AdBanner({ adUnitID }) {
  // Si no se pasa un adUnitID, usamos el de pruebas de Google
  const unitId = adUnitID || TestIds.BANNER;

  try {
    return (
      <View style={{ margin: 8, borderRadius: 12, overflow: "hidden" }}>
        <BannerAd
          unitId={unitId}
          size={BannerAdSize.ADAPTIVE_BANNER} // 🔹 ahora se adapta al ancho de la pantalla
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdFailedToLoad={(error) =>
            console.log("Error al cargar banner:", error)
          }
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
