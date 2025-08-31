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
  cardPadding
} from "../utils/layoutConstants.js";

import AsyncStorage from "@react-native-async-storage/async-storage";
import MyButton from "../components/MyButton"; // ajusta la ruta si es distinta

import AdBannerStatic from "../banners/AdBannerStatic.js"; // importa el banner real
import { ADS } from "../utils/adConstants.js";

const STORAGE_KEY = "@mi-lista-gamer/games";
const RAWG_API_KEY = "a9e27fe863274d19bd2c795b28943d8e";

export default function AddGameScreen({ navigation }) {
  const [gameName, setGameName] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [caratula, setCaratula] = useState("");
  const [loadingCover, setLoadingCover] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [plataformas, setPlataformas] = useState([]); // 🆕
  const [selectedGame, setSelectedGame] = useState(null);

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
      if (selectedGame) return; // Si hay juego seleccionado, no buscar

      if (gameName.trim().length < 3) {
        setSuggestions([]);
        setCaratula("");
        return;
      }

      setLoadingCover(true);
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(
            gameName
          )}`
        );
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          // Guardamos hasta 3 sugerencias
          const top3 = data.results.slice(0, 3);
          setSuggestions(top3);

          // También asignamos la carátula de la primera
          setCaratula(top3[0].background_image || "");
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

    const timeout = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeout);
  }, [gameName, selectedGame]);

  const saveGame = async () => {
    if (!gameName.trim()) {
      Alert.alert("Error", "El nombre del juego es obligatorio");
      return;
    }

    try {
      const storedGames = await AsyncStorage.getItem(STORAGE_KEY);
      const games = storedGames ? JSON.parse(storedGames) : [];

      const newGame = {
        id: Date.now(),
        nombre: gameName.trim(),
        estado: estado,
        caratula: caratula.trim(),
        plataformas: plataformas, // 🆕 añadimos las plataformas al objeto
      };

      games.push(newGame);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(games));

      setGameName("");
      setPlataformas([]); // 🆕 reseteamos plataformas
      navigation.goBack(); // vuelve a la lista
    } catch (e) {
      console.error("Error guardando juego:", e);
    }
  };

  return (
    <View style={styles.container}>
       <AdBannerStatic adUnitID={ADS.BANNER_STATIC}/>
      <TextInput
        style={styles.input}
        placeholder="Nombre del juego"
        value={gameName}
        onChangeText={onChangeGameName}
      />

      {suggestions.length > 0 && !selectedGame && (
        <View style={[styles.suggestionsContainer, { marginBottom: 20 }]}>
          {suggestions.map((item) => (
            <Text
              key={item.id}
              style={styles.suggestionItem}
              onPress={() => {
                setGameName(item.name);
                setCaratula(item.background_image || "");
                setEstado("pendiente");
                setSuggestions([]);
                setPlataformas(
                  item.platforms?.map((p) => p.platform.slug) || []
                );
                setSelectedGame(item); // anclamos la selección
              }}
            >
              {item.name}
            </Text>
          ))}
        </View>
      )}

      {loadingCover && <ActivityIndicator size="small" color="#555" />}

      <View style={styles.saveButtonContainer}>
        <MyButton title="Guardar" onPress={saveGame} />
      </View>
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
