import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import {
  paddingContainer,
  titleFontSize,
  textFontSize,
  inputHeight,
  inputPadding,
  cardBorderRadius,
  cardMargin,
  windowHeight,
  cardPadding,
} from "../utils/layoutConstants.js";

import AsyncStorage from "@react-native-async-storage/async-storage";
import MyButton from "../components/MyButton"; // ajusta la ruta si es distinta

//import AdBannerStatic from "../banners/AdBannerStatic.js"; // importa el banner real
import AdBannerStatic from "../banners/AdBannerPlaceholderStatic.js"; // importa el banner real

import { ADS } from "../utils/adConstants.js";

const STORAGE_KEY = "@mi-lista-gamer/games";
const RAWG_API_KEY = "a9e27fe863274d19bd2c795b28943d8e";

import LottieView from "lottie-react-native";
import loadingAnim from "../assets/loading.json"; // tu animación

const COUNTER_KEY = "@mi-lista-gamer/adCounter";

import { useDebouncedValue } from "../utils/hooks";
import GameSuggestionItem from "../components/GameSuggestionItem"; // ajusta la ruta si es distinta


export default function AddGameScreen({ navigation }) {
  const [gameName, setGameName] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [caratula, setCaratula] = useState("");
  const [loadingCover, setLoadingCover] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [plataformas, setPlataformas] = useState([]); // 🆕
  const [selectedGame, setSelectedGame] = useState(null);
  const [saving, setSaving] = useState(false);
  const debouncedGameName = useDebouncedValue(gameName, 500);

  const onChangeGameName = (text) => {
    setGameName(text);
    if (selectedGame) {
      setSelectedGame(null);
      setPlataformas([]);
      setCaratula("");
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (selectedGame) return;

      if (debouncedGameName.trim().length < 3) {
        setSuggestions([]);
        setCaratula("");
        return;
      }

      setLoadingCover(true);
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(debouncedGameName)}`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const top3 = data.results.slice(0, 3).map(item => ({
            ...item,
            safe_cover: item.background_image && !item.background_image.includes("screenshot") ? item.background_image : null,
          }));

          setSuggestions(top3);
          const firstValid = top3.find(g => g.safe_cover);
          setCaratula(firstValid ? firstValid.safe_cover : "");
        } else {
          setSuggestions([]);
          setCaratula("");
        }
      } catch (error) {
        console.error("Error buscando sugerencias:", error);
        setSuggestions([]);
        setCaratula("");
      } finally {
        setLoadingCover(false);
      }
    };

    fetchSuggestions();
  }, [debouncedGameName, selectedGame]);


  const saveGame = async () => {
    if (!gameName.trim()) {
      Alert.alert("Error", "El nombre del juego es obligatorio");
      return;
    }

    setSaving(true); // 🔹 empieza animación de carga

    try {
      const storedGames = await AsyncStorage.getItem(STORAGE_KEY);
      const games = storedGames ? JSON.parse(storedGames) : [];

      // 🔍 comprobar si ya existe (por nombre en minúsculas)
      const alreadyExists = games.some(
        (g) => g.nombre.toLowerCase() === gameName.trim().toLowerCase()
      );

      if (alreadyExists) {
        setSaving(false); // 🔹 detener animación
        Alert.alert("Aviso", "Este juego ya está en tu lista");
        return; // 🚫 no guardamos nada
      }

      const newGame = {
        id: Date.now(),
        nombre: gameName.trim(),
        estado: estado,
        caratula: caratula.trim(),
        plataformas: plataformas,
      };

      games.push(newGame);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(games));

      // incrementa el contador de anuncios
      let counter = parseInt(
        (await AsyncStorage.getItem(COUNTER_KEY)) || "0",
        10
      );
      counter = counter + 1;

      // guarda el contador actualizado
      await AsyncStorage.setItem(COUNTER_KEY, counter.toString());

      // limpiar estado y volver atrás
      setGameName("");            
      setPlataformas([]);
      setSaving(false);
      navigation.navigate("GameList", { contador: counter });
    } catch (e) {
      console.error("Error guardando juego:", e);
    }
  };

  return (
    <View style={styles.container}>
      <AdBannerStatic adUnitID={ADS.BANNER_STATIC} />

      <TextInput
        style={styles.input}
        placeholder="Nombre del juego"
        value={gameName}
        onChangeText={onChangeGameName}
      />

      {suggestions.length > 0 && !selectedGame && (
        <View style={[styles.suggestionsContainer, { marginBottom: 20 }]}>
          {suggestions.map(item => (
            <GameSuggestionItem
              key={item.id}
              game={item}
              onSelect={async (game) => {
                setGameName(game.name);
                setEstado("pendiente");
                setSuggestions([]);
                setPlataformas(game.platforms?.map(p => p.platform.slug) || []);
                setSelectedGame(game);

                // Traer carátula más completa si hace falta
                try {
                  const res = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${RAWG_API_KEY}`);
                  const data = await res.json();
                  setCaratula(
                    data.background_image || data.background_image_additional || game.safe_cover || ""
                  );
                } catch (err) {
                  console.error("Error cargando detalles del juego:", err);
                  setCaratula(game.safe_cover || "");
                }
              }}
            />
          ))}
        </View>
      )}


      {loadingCover && <ActivityIndicator size="small" color="#555" />}

      <View style={styles.saveButtonContainer}>
        <MyButton title="Guardar" onPress={saveGame} />
      </View>

      {saving && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.8)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <LottieView
            source={loadingAnim}
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />
          <Text style={{ marginTop: 16, fontSize: 16 }}>
            Guardando juego...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: paddingContainer,
    justifyContent: "flex-start",
    paddingTop: windowHeight * 0.05, // opcional, adaptativo
    backgroundColor: "#fff",
  },
  title: {
    fontSize: titleFontSize,
    marginBottom: cardMargin,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: inputPadding,
    marginBottom: cardMargin,
    borderRadius: cardBorderRadius,
    fontSize: textFontSize,
    height: inputHeight,
  },
  label: {
    fontSize: textFontSize,
    marginBottom: cardMargin * 0.25,
    marginTop: cardMargin * 0.5,
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: cardBorderRadius,
    marginTop: cardMargin * 0.25,
    maxHeight: windowHeight * 0.2, // altura adaptativa
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 9999,
  },
  suggestionItem: {
    padding: cardPadding * 0.75,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    fontSize: textFontSize,
  },

  saveButtonContainer: {
    marginTop: cardMargin,
  },
});
