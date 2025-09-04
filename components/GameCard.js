import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import MyButton from "./MyButton.js";
import {
  paddingContainer,
  cardBorderRadius,
  cardMargin,
  cardPadding,
  titleFontSize,
  textFontSize,
  smallTextFontSize,
  filterMenuWidth,
  shadowOffsetY,
  shadowRadius,
  filterOptionFontSize,
  windowWidth,
  windowHeight,
  buttonHeight,
} from "../utils/layoutConstants.js";

const borderColorByStatus = {
  pendiente: "#FFA500",
  jugando: "#4CAF50",
  terminado: "#607D8B",
};

export default function GameCard({
  game,
  onChangeStatus,
  onDelete,
  activeMenuId,
  setActiveMenuId,
  cerrarMenusFiltro,
}) {
  const { nombre, estado, caratula } = game;
  const [loading, setLoading] = useState(!!caratula); // muestra animación mientras carga

  const formatPlatform = (name) =>
    name
      .replace(/-/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <View
      style={[
        styles.card,
        { borderColor: borderColorByStatus[estado] || "#aaa" },
      ]}
    >
      {loading && (
        <LottieView
          source={require("../assets/loading.json")}
          autoPlay
          loop
          style={{ width: "100%", height: 150 }}
        />
      )}

      {caratula && (
        <Image
          source={{ uri: caratula }}
          style={styles.cover}
          onLoadEnd={() => setLoading(false)}
        />
      )}

      {!loading && (
        <>
          <Text style={styles.name}>{nombre}</Text>
          {game.plataformas?.length > 0 && (
            <Text style={styles.platforms}>
              Plataformas: {game.plataformas.map(formatPlatform).join(", ")}
            </Text>
          )}
          <Text style={styles.status}>Estado: {estado}</Text>

          <View style={styles.buttons}>
            <MyButton
              title="Cambiar estado"
              onPress={() => {
                setActiveMenuId(activeMenuId === game.id ? null : game.id);
                if (cerrarMenusFiltro) cerrarMenusFiltro();
              }}
              style={styles.button}
            />
            <MyButton
              title="Eliminar"
              onPress={() => onDelete(game.id)}
              style={[styles.button, { backgroundColor: "#e53935" }]}
            />

            {activeMenuId === game.id && (
              <View style={styles.estadoMenu}>
                {["pendiente", "jugando", "terminado"].map((estadoOpcion) => (
                  <TouchableOpacity
                    key={estadoOpcion}
                    style={[
                      styles.estadoOpcion,
                      estado === estadoOpcion && styles.estadoOpcionActivo,
                    ]}
                    onPress={() => {
                      onChangeStatus(game.id, estadoOpcion);
                      setActiveMenuId(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.estadoTexto,
                        estado === estadoOpcion && styles.estadoTextoActivo,
                      ]}
                    >
                      {estadoOpcion.charAt(0).toUpperCase() +
                        estadoOpcion.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 3,
    borderRadius: cardBorderRadius,
    padding: cardPadding,
    marginBottom: cardMargin,
    backgroundColor: "#f9f9f9",
  },
  name: {
    fontSize: titleFontSize,
    fontWeight: "bold",
    marginBottom: cardMargin * 0.6,
  },
  status: {
    fontSize: textFontSize,
    marginBottom: cardMargin,
  },
  buttons: {
    flexDirection: "row",
  },
  cover: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.78,
    marginBottom: cardMargin,
    borderRadius: cardBorderRadius,
    backgroundColor: "#eee",
    resizeMode: "contain",
  },
  button: {
    flex: 1,
    marginHorizontal: cardMargin * 0.4,
    justifyContent: "center",
  },
  estadoMenu: {
    position: "absolute",
    bottom: buttonHeight * 1.3,
    left: paddingContainer * 0.5,
    backgroundColor: "#fff",
    borderRadius: windowWidth * 0.02,
    elevation: 5,
    paddingVertical: windowHeight * 0.02,
    width: filterMenuWidth,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: shadowOffsetY },
    shadowOpacity: 0.3,
    shadowRadius: shadowRadius,
    zIndex: 20,
  },
  estadoOpcionActivo: {
    backgroundColor: "#6200ee",
    borderRadius: cardBorderRadius * 0.6,
  },
  estadoOpcion: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  estadoTexto: {
    fontSize: filterOptionFontSize,
    color: "#333",
  },
  estadoTextoActivo: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: filterOptionFontSize,
  },
  platforms: {
    fontSize: smallTextFontSize,
    fontStyle: "italic",
    color: "#555",
    marginBottom: cardMargin * 0.8,
  },
});
