// AdInterstitial.js
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { View, Text, StyleSheet } from "react-native";
import { InterstitialAd, AdEventType, TestIds } from "react-native-google-mobile-ads";
import LottieView from "lottie-react-native";
import loadingAnim from "../assets/loading.json";

const AdInterstitial = forwardRef(({ adUnitID }, ref) => {
  const unitId = adUnitID || TestIds.INTERSTITIAL;

  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  const interstitialAdRef = useRef(null);
  const showRequestedRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const interstitialAd = InterstitialAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: false,
    });
    interstitialAdRef.current = interstitialAd;

    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log("[AdInterstitial] LOADED");
        setLoading(false);
        setLoaded(true);
        // si se pidió mostrar antes de cargarse, mostrar ahora
        if (showRequestedRef.current) {
          showRequestedRef.current = false;
          try {
            interstitialAdRef.current?.show();
          } catch (e) {
            console.warn("[AdInterstitial] show() falló después de LOADED:", e);
            // fallback será manejado por timeout
          }
        }
      }
    );

    const unsubscribeError = interstitialAd.addAdEventListener(
      AdEventType.ERROR,
      (err) => {
        console.warn("[AdInterstitial] ERROR:", err);
      }
    );

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log("[AdInterstitial] CLOSED");
        setVisible(false);
        setLoaded(false);
        // recargar para la próxima vez
        try {
          interstitialAdRef.current?.load();
        } catch (e) {
          console.warn("[AdInterstitial] load() fallo en CLOSED:", e);
        }
        // ejecutar callback si existe
        if (ref?.current?._onClose) {
          const cb = ref.current._onClose;
          ref.current._onClose = null;
          cb();
        }
        // limpiar timeout si quedara
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    );

    interstitialAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeError();
      unsubscribeClosed();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId]);

  // showAd recibe un callback que se ejecuta al cerrarse el anuncio
  const showAd = (onClose) => {
    // si no existe la instancia, fallback inmediato
    if (!interstitialAdRef.current) {
      console.log("[AdInterstitial] no hay instancia de ad, fallback");
      onClose?.();
      return;
    }

    // guardamos callback
    if (ref) ref.current._onClose = onClose;

    // marcar visible (mostrar overlay animación)
    setVisible(true);

    if (loaded) {
      // ya cargado: mostrar
      try {
        interstitialAdRef.current.show();
      } catch (e) {
        console.warn("[AdInterstitial] show() falló:", e);
        // fallback: llamar al callback después de ocultar
        setVisible(false);
        if (ref?.current?._onClose) {
          const cb = ref.current._onClose;
          ref.current._onClose = null;
          cb();
        } else {
          onClose?.();
        }
      }
    } else {
      // no cargado todavía: pedir carga y marcar que queremos mostrar
      showRequestedRef.current = true;
      try {
        interstitialAdRef.current.load();
      } catch (e) {
        console.warn("[AdInterstitial] load() fallo al intentar cargar antes de showAd:", e);
      }
      // fallback timeout: si no carga en X ms, cerramos y ejecutamos callback
      timeoutRef.current = setTimeout(() => {
        console.warn("[AdInterstitial] timeout: no cargó el ad, fallback");
        setVisible(false);
        if (ref?.current?._onClose) {
          const cb = ref.current._onClose;
          ref.current._onClose = null;
          cb();
        } else {
          onClose?.();
        }
        showRequestedRef.current = false;
      }, 8000); // 8 segundos de espera máxima
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
