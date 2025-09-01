import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyButton from "../components/MyButton.js";
import {
  paddingContainer,
  titleFontSize,
  buttonHeight,
  buttonFontSize,
  marginBetweenButtons,
  windowWidth,
  cardPadding,
  cardBorderRadius,
  smallTextFontSize,
  shadowOffsetY,
  shadowRadius,
} from "../utils/layoutConstants.js";

const STORAGE_KEY = "@mi-lista-gamer/games";

//import AdBannerStatic from "../banners/AdBannerStatic.js"; // importa el banner real
import AdBannerStatic from "../banners/AdBannerPlaceholderStatic.js"; // importa el banner real

import { ADS } from "../utils/adConstants.js";

const borderColorByStatus = {
  pendiente: "#FFA500",
  jugando: "#4CAF50",
  terminado: "#607D8B",
};

export default function RandomGameScreen({ route, navigation }) {
  const [games, setGames] = useState([]);
  const [randomGame, setRandomGame] = useState(null);
  const [showPlatformMenu, setShowPlatformMenu] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(
    route?.params?.platform || "todas"
  );

  const loadGames = async () => {
    try {
      const storedGames = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedGames) setGames(JSON.parse(storedGames));
    } catch (e) {
      console.error("Error cargando juegos:", e);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const availablePlatforms = Array.from(
    new Set(games.flatMap((g) => g.plataformas || []))
  ).sort();

  const pickRandomGame = () => {
    setShowPlatformMenu(false); // <-- cerrar menú al elegir juego
    let pendingGames = games.filter((g) => g.estado === "pendiente");
    if (selectedPlatform !== "todas") {
      pendingGames = pendingGames.filter((g) =>
        g.plataformas?.includes(selectedPlatform)
      );
    }
    if (pendingGames.length === 0) {
      Alert.alert("No hay juegos pendientes para esta plataforma");
      return;
    }
    const randomIndex = Math.floor(Math.random() * pendingGames.length);
    setRandomGame(pendingGames[randomIndex]);
  };

  const formatPlatform = (name) => name.replace(/-/g, " ");

  return (
    <TouchableWithoutFeedback onPress={() => setShowPlatformMenu(false)}>
      <ScrollView contentContainerStyle={styles.container}>
         <AdBannerStatic adUnitID={ADS.BANNER_STATIC}/>

        {randomGame ? (
          <View
            style={[
              styles.gameCard,
              { borderColor: borderColorByStatus[randomGame.estado] || "#aaa" },
            ]}
          >
            {randomGame.caratula && (
              <Image source={{ uri: randomGame.caratula }} style={styles.cover} />
            )}
            <Text style={styles.name}>{randomGame.nombre}</Text>
            {randomGame.plataformas?.length > 0 && (
              <Text style={styles.platforms}>
                Plataformas: {randomGame.plataformas.map(formatPlatform).join(", ")}
              </Text>
            )}
            <Text style={styles.status}>Estado: {randomGame.estado}</Text>
          </View>
        ) : (
          <Text>No se ha seleccionado ningún juego todavía.</Text>
        )}

        <View style={styles.buttonContainer}>
          <MyButton
            title="Elegir juego aleatorio"
            onPress={pickRandomGame}
            style={styles.button}
          />
          <MyButton
            title="Volver"
            onPress={() => {
              setShowPlatformMenu(false); // <-- cerrar menú al volver
              navigation.goBack();
            }}
            style={styles.button}
          />
        </View>

        {/* Selector de plataforma */}
        <TouchableOpacity
          style={styles.platformSelector}
          onPress={() => setShowPlatformMenu(!showPlatformMenu)}
        >
          <Text style={styles.platformSelectorText}>
            Plataforma: {selectedPlatform}
          </Text>
        </TouchableOpacity>

        {showPlatformMenu && (
          <View style={styles.platformMenu}>
            {["todas", ...availablePlatforms].map((platform) => (
              <TouchableOpacity
                key={platform}
                style={[
                  styles.platformCell,
                  selectedPlatform === platform && styles.platformCellActive,
                ]}
                onPress={() => {
                  setSelectedPlatform(platform);
                  setShowPlatformMenu(false);
                }}
              >
                <Text
                  style={[
                    styles.platformCellText,
                    selectedPlatform === platform && styles.platformCellTextActive,
                  ]}
                >
                  {platform.replace(/-/g, " ")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

// --- estilos se mantienen igual ---
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: paddingContainer,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: titleFontSize,
    marginBottom: marginBetweenButtons * 2,
    textAlign: "center",
  },
  gameCard: {
    width: "90%",
    padding: cardPadding,
    borderWidth: 3,
    borderRadius: cardBorderRadius,
    marginBottom: marginBetweenButtons * 2,
    backgroundColor: "#f9f9f9",
  },
  cover: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.78,
    marginBottom: marginBetweenButtons,
    borderRadius: cardBorderRadius,
    backgroundColor: "#eee",
    resizeMode: "contain",
  },
  name: {
    fontSize: titleFontSize * 0.8,
    fontWeight: "bold",
    marginBottom: marginBetweenButtons,
  },
  platforms: {
    fontSize: smallTextFontSize,
    fontStyle: "italic",
    color: "#555",
    marginBottom: marginBetweenButtons,
  },
  status: {
    fontSize: buttonFontSize,
    marginBottom: marginBetweenButtons,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: marginBetweenButtons,
  },
  button: {
    flex: 1,
    height: buttonHeight,
    marginHorizontal: marginBetweenButtons,
    fontSize: buttonFontSize,
  },
  platformSelector: {
    width: "90%",
    padding: cardPadding,
    borderWidth: 1,
    borderRadius: cardBorderRadius,
    marginBottom: marginBetweenButtons,
    marginTop: marginBetweenButtons * 3,
    backgroundColor: "#f9f9f9",
  },
  platformSelectorText: {
    fontSize: buttonFontSize,
  },
  platformMenu: {
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: paddingContainer / 2,
    marginBottom: marginBetweenButtons * 2,
  },
  platformCell: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: cardBorderRadius,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: marginBetweenButtons,
    minWidth: (windowWidth - paddingContainer * 2 - 16) / 3,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  platformCellActive: {
    backgroundColor: "#6200ee",
    borderColor: "#6200ee",
  },
  platformCellText: {
    fontSize: buttonFontSize,
    color: "#333",
    textAlign: "center",
  },
  platformCellTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
});
