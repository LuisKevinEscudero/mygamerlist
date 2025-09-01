import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Animated, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";

const STORAGE_KEY = "@mi-lista-gamer/games";

const { width } = Dimensions.get("window");

export default function LoadingScreen({ navigation }) {
  const [loadingText, setLoadingText] = useState("Cargando carátulas...");
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const animationRef = useRef(null);

  const precargarCaratulas = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return;

      const juegos = JSON.parse(data);
      const urls = juegos.map(j => j.caratula).filter(Boolean);
      setLoadingText(`Cargando ${urls.length} imágenes...`);

      await Promise.all(urls.map(url => Image.prefetch(url)));
    } catch (err) {
      console.log("Error precargando carátulas:", err);
    }
  };

  const precargarAnuncios = async () => {
    // Simula precarga de anuncios (puedes integrar tus banners reales si quieres)
    return new Promise(resolve => setTimeout(resolve, 1500));
  };

  useEffect(() => {
    const prepararApp = async () => {
      // Inicia animación en loop
      animationRef.current?.play();

      // Precarga simultánea
      await Promise.all([precargarCaratulas(), precargarAnuncios()]);

      // Detener loop de Lottie y dejar en último frame
      animationRef.current?.pause();

      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace("GameList");
      });
    };

    prepararApp();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LottieView
        ref={animationRef}
        source={require("../assets/loading.json")}
        loop={true}
        style={{ width: width * 0.5, height: width * 0.5 }}
      />
      <Text style={styles.text}>{loadingText}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
});
