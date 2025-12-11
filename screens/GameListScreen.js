import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import GameCard from "../components/GameCard.js"; // Asegúrate que la ruta es correcta
import MyButton from "../components/MyButton.js"; // ajusta la ruta si es distinta

//import AdBanner from "../banners/AdBanner.js";
import AdBanner from "../banners/AdBannerPlaceholder.js";

//import AdBannerStatic from "../banners/AdBannerStatic.js"; // importa el banner real
import AdBannerStatic from "../banners/AdBannerPlaceholderStatic.js"; // importa el banner real

//import AdInterstitial from "../banners/AdInterstitial.js"; // ruta a tu componente interstitial
import AdInterstitial from "../banners/AdInterstitialMock.js"; // ruta a tu componente interstitial

import { ADS } from "../utils/adConstants.js";

const STORAGE_KEY = "@mi-lista-gamer/games";

import {windowWidth,
windowHeight,
paddingContainer,
marginVerticalSection,
marginBetweenButtons,
buttonHeight,
fabSize,
titleFontSize,
buttonFontSize,
filterOptionFontSize,
filterMenuWidth,
filterMenuBottom,
shadowOffsetY,
shadowRadius
} from "../utils/constantsLayoutGameScreen.js";

import SearchHeader from "../components/SearchHeader.js";

export default function GameListScreen({ navigation, route }) {
  const [games, setGames] = useState([]);
  const [filter, setFilter] = useState("todos");
  const [menuAbiertoId, setMenuAbiertoId] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState("todas");
  const [showMainFilterMenu, setShowMainFilterMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showPlatformMenu, setShowPlatformMenu] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [buttonHeight, setButtonHeight] = useState(0);

  // 🔹 Nuevo: recibimos el contador que viene desde AddGame
  const contador = route?.params?.contador || 0;

    // 🔹 Ref para el interstitial
  const interstitialRef = useRef(null);

  useEffect(() => {
    // 🔹 Mostrar interstitial solo si es múltiplo de 5 y mayor que 0
    if (contador > 0 && contador % 5 === 0) {
      interstitialRef.current?.showAd(() => {
        console.log("Anuncio cerrado");
      });
    }
  }, [contador]);

  const normalizeText = (text) =>
    text
      .toLowerCase()
      .normalize("NFD") // descompone acentos en caracteres base + acento
      .replace(/[\u0300-\u036f]/g, ""); // elimina los acentos

  const cerrarMenusFiltro = () => {
    setShowMainFilterMenu(false);
    setShowFilterMenu(false);
    setShowPlatformMenu(false);
  };

  const sortedGames = [...games].sort((a, b) => {
    const nameA = a.nombre.toLowerCase();
    const nameB = b.nombre.toLowerCase();
    if (sortAsc) {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  const availablePlatforms = Array.from(
    new Set(games.flatMap((g) => g.plataformas || []))
  ).sort((a, b) => a.localeCompare(b));

  const filteredGames = sortedGames.filter((game) => {
    const estadoOK = filter === "todos" || game.estado === filter;
    const plataformaOK =
      selectedPlatform === "todas" ||
      (game.plataformas || []).includes(selectedPlatform);
    const textoOK = normalizeText(game.nombre).includes(
      normalizeText(searchText)
    );
    return estadoOK && plataformaOK && textoOK;
  });

  const loadGames = async () => {
    try {
      const storedGames = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedGames !== null) {
        setGames(JSON.parse(storedGames));
      } else {
        setGames([]);
      }
    } catch (e) {
      console.error("Error cargando juegos:", e);
    }
  };

  const saveGames = async (newGames) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newGames));
      setGames(newGames);
    } catch (e) {
      console.error("Error guardando juegos:", e);
    }
  };

  const handleChangeStatus = (id, nuevoEstado) => {
    const updatedGames = games.map((game) =>
      game.id === id ? { ...game, estado: nuevoEstado } : game
    );
    saveGames(updatedGames);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar juego",
      "¿Estás seguro de que quieres eliminar este juego?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const filteredGames = games.filter((game) => game.id !== id);
            saveGames(filteredGames);
          },
        },
      ]
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      loadGames();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SearchHeader
          searchText={searchText}
          setSearchText={setSearchText}
          sortAsc={sortAsc}
          setSortAsc={setSortAsc}
        />
      ),
    });
  }, [navigation, searchText, sortAsc]);

  return (
    <View style={styles.container}>
      {/* Banner estático placeholder con AdMob */}
      <AdBannerStatic adUnitID={ADS.BANNER_STATIC} />

      {/* Menú principal */}
      {showMainFilterMenu && (
        <View style={styles.filterMenu}>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => {
              setShowMainFilterMenu(false);
              setShowFilterMenu(true);
            }}
          >
            <Text style={styles.filterOptionText}>Por Estado</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => {
              setShowMainFilterMenu(false);
              setShowPlatformMenu(true);
            }}
          >
            <Text style={styles.filterOptionText}>Por Plataforma</Text>
          </TouchableOpacity>

          {/* Mostrar botón limpiar solo si hay filtro activo */}
          {(filter !== "todos" ||
            selectedPlatform !== "todas" ||
            searchText.trim() !== "") && (
            <TouchableOpacity
              style={[
                styles.filterOption,
                { borderTopWidth: 1, borderTopColor: "#ccc", marginTop: 8 },
              ]}
              onPress={() => {
                setFilter("todos");
                setSelectedPlatform("todas");
                setSearchText(""); // <-- aquí
                setShowMainFilterMenu(false);
              }}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  { color: "#e53935", fontWeight: "bold" },
                ]}
              >
                Limpiar filtros
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Menú de estados */}
      {showFilterMenu && (
        <View style={[styles.filterMenu, { bottom: buttonHeight * 2 + 20 }]}>
          {["todos", "pendiente", "jugando", "terminado"].map(
            (estadoFiltro) => (
              <TouchableOpacity
                key={estadoFiltro}
                style={[
                  styles.filterOption,
                  filter === estadoFiltro && styles.filterOptionActive,
                ]}
                onPress={() => {
                  setFilter(estadoFiltro);
                  setShowFilterMenu(false);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    filter === estadoFiltro && styles.filterOptionTextActive,
                  ]}
                >
                  {estadoFiltro.charAt(0).toUpperCase() + estadoFiltro.slice(1)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      )}

      {/* Menú de plataformas */}
      {showPlatformMenu && (
        <View style={[styles.filterMenu, { bottom: buttonHeight * 2 + 20 }]}>
          <ScrollView style={{ maxHeight: windowHeight * 0.4 }}>
            {["todas", ...availablePlatforms].map((platform) => (
              <TouchableOpacity
                key={platform}
                style={[
                  styles.filterOption,
                  selectedPlatform === platform && styles.filterOptionActive,
                ]}
                onPress={() => {
                  setSelectedPlatform(platform);
                  setShowPlatformMenu(false);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedPlatform === platform &&
                      styles.filterOptionTextActive,
                  ]}
                >
                  {platform.replace(/-/g, " ")}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredGames}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => {
            if ((index + 1) % 6 === 0) {
              return <AdBanner adUnitID={ADS.BANNER_GAMECARD} />;
            }
            return (
              <GameCard
                game={item}
                onChangeStatus={handleChangeStatus}
                onDelete={handleDelete}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
              />
            );
          }}
          ListEmptyComponent={<Text>No tienes juegos guardados.</Text>}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      <View style={styles.buttonContainer}>
        {/* Botón añadir */}
        <MyButton
          title="Añadir juego"
          onPress={() => navigation.navigate("AddGame")}
          style={styles.smallButton}
        />

        {/* Botón aleatorio */}
        <MyButton
          title="Juego aleatorio"
          onPress={() =>
            navigation.navigate("RandomGame", { platform: selectedPlatform })
          }
          style={styles.smallButton}
        />

        {/* Botón Filtro */}
        <TouchableOpacity
          style={styles.smallFab}
          onPress={() => {
            setShowMainFilterMenu(!showMainFilterMenu);
            setShowFilterMenu(false);
            setShowPlatformMenu(false);
            setActiveMenuId(null);
          }}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setButtonHeight(height);
          }}
        >
          <Text style={styles.fabText}>Filtro</Text>
        </TouchableOpacity>
      </View>

      {/* Interstitial overlay */}
      <AdInterstitial ref={interstitialRef} adUnitID={ADS.INTERSTITIAL} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: paddingContainer,
    backgroundColor: "#fff",
    zIndex: 0,
  },
  title: {
    fontSize: titleFontSize,
    marginBottom: marginVerticalSection * 0.75,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: windowHeight * 0.04,
    right: windowWidth * 0.05,
    backgroundColor: "#6200ee",
    width: fabSize,
    height: fabSize,
    borderRadius: fabSize / 2,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: shadowOffsetY },
    shadowOpacity: 0.3,
    shadowRadius: shadowRadius,
    zIndex: 10,
  },
  fabText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: buttonFontSize,
  },
  filterMenu: {
    position: "absolute",
    bottom: filterMenuBottom,
    right: paddingContainer,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    paddingVertical: 8,
    width: filterMenuWidth,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: shadowOffsetY },
    shadowOpacity: 0.3,
    shadowRadius: shadowRadius,
    zIndex: 20,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  filterOptionActive: {
    backgroundColor: "#6200ee",
    borderRadius: 6,
  },
  filterOptionText: {
    color: "#333",
    fontSize: filterOptionFontSize,
  },
  filterOptionTextActive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: filterOptionFontSize,
  },
  addButton: {
    width: 200,
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row", // Poner botones en fila
    justifyContent: "space-between", // Separación automática
    alignItems: "center",
    paddingHorizontal: paddingContainer,
    marginBottom: marginVerticalSection,
    width: "100%",
    paddingTop: 12, // 🔹 Espacio por encima de los botones
    paddingBottom: 12, // 🔹 Espacio por debajo
    borderRadius: 8, // 🔹 Bordes redondeados
    borderColor: "#ddd", // 🔹 Borde sutil
  },

  smallButton: {
    flex: 1, // Ocupa espacio equitativo
    minWidth: windowWidth * 0.3,
    marginHorizontal: marginBetweenButtons, // Separación entre botones
    height: buttonHeight * 1.3,
    fontSize: buttonFontSize,
  },
  smallFab: {
    minWidth: windowWidth * 0.2, // Tamaño fijo o mínimo
    height: buttonHeight,
    borderRadius: buttonHeight / 2,
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: windowWidth * 0.015, // Espacio entre Filtro y los otros botones
  },
});
