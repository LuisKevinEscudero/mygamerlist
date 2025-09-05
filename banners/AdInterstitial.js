import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { View, Text, StyleSheet } from "react-native";
import { InterstitialAd, AdEventType, TestIds } from "react-native-google-mobile-ads";
import LottieView from "lottie-react-native";
import loadingAnim from "../assets/loading.json";

const AdInterstitial = forwardRef(({ adUnitID }, ref) => {
  const unitId = adUnitID || TestIds.INTERSTITIAL;

  const [loading, setLoading] = useState(true);
  const [interstitial, setInterstitial] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const interstitialAd = InterstitialAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    setInterstitial(interstitialAd);

    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoading(false);
      }
    );

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setVisible(false);      // ocultar overlay
        interstitialAd.load();  // recargar para próxima vez
        if (ref.current?._onClose) ref.current._onClose(); // ejecutar callback
      }
    );

    interstitialAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, [unitId]);

  const showAd = (onClose) => {
    if (interstitial) {
      ref.current._onClose = onClose; // guardamos callback
      setVisible(true);
      interstitial.show();
    } else {
      console.log("Interstitial no está listo todavía");
      onClose?.(); // fallback por si no carga
    }
  };

  useImperativeHandle(ref, () => ({
    showAd,
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.adContainer}>
        {loading && (
          <LottieView
            source={loadingAnim}
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />
        )}
        <Text style={styles.adText}>Mostrando anuncio...</Text>
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
    backgroundColor: "rgba(0,0,0,0.6)",
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
  adText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
  },
});

export default AdInterstitial;
