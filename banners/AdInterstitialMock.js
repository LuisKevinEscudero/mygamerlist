// AdInterstitialMock.js
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import loadingAnim from "../assets/loading.json";

const AdInterstitialMock = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const showAd = (onClose) => {
    // ahora acepta callback
    console.log("🔹 Mostrando interstitial mock...");
    setVisible(true);

    // Mantenerlo visible unos segundos (simula anuncio real)
    setTimeout(() => {
      console.log("✅ Interstitial cerrado (mock)");
      setVisible(false);
      onClose?.(); // ejecuta el callback pasado
    }, 3500);
  };

  useImperativeHandle(ref, () => ({
    showAd,
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.adContainer}>
        <Text style={styles.adLabel}>ANUNCIO INTERSTITIAL</Text>
        <LottieView
          source={loadingAnim}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
        <Text style={styles.adText}>Este es un anuncio de prueba</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)", // fondo semitransparente
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  adContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  adLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  adText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
  },
});

export default AdInterstitialMock;
