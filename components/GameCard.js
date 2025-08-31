import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
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
  pendiente: "#FFA500", // naranja
  jugando: "#4CAF50", // verde
  terminado: "#607D8B", // gris azulado (puedes cambiar a rojo si quieres)
};

export default function GameCard({
  game,
  onChangeStatus,
  onDelete,
  activeMenuId,
  setActiveMenuId,
  setShowFilterMenu,
  cerrarMenusFiltro,
}) {
  const { nombre, estado } = game;

  const formatPlatform = (name) => {
    return name
      .replace(/-/g, " ") // reemplaza guiones por espacios
      .split(" ") // divide en palabras
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitaliza cada palabra
      .join(" ");
  };

  return (
    <View
      style={[
        styles.card,
        { borderColor: borderColorByStatus[game.estado] || "#aaa" },
      ]}
    >
      {game.caratula ? (
        <Image source={{ uri: game.caratula }} style={styles.cover} />
      ) : null}

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
            cerrarMenusFiltro(); // cerrar cualquier menú filtro abierto
          }}
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
                  game.estado === estadoOpcion && styles.estadoOpcionActivo,
                ]}
                onPress={() => {
                  onChangeStatus(game.id, estadoOpcion);
                  setActiveMenuId(null);
                }}
              >
                <Text
                  style={[
                    styles.estadoTexto,
                    game.estado === estadoOpcion && styles.estadoTextoActivo,
                  ]}
                >
                  {estadoOpcion.charAt(0).toUpperCase() + estadoOpcion.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 3,
    borderRadius: cardBorderRadius, // 🔹 redondea esquinas
    padding: cardPadding, // 🔹 espacio interno (contenido ↔ borde)
    marginBottom: cardMargin, // 🔹 espacio externo (entre cards)
    backgroundColor: "#f9f9f9",
  },

  name: {
    fontSize: titleFontSize, // antes 20
    fontWeight: "bold",
    marginBottom: cardMargin * 0.6, // proporcional, antes 6
  },

  status: {
    fontSize: textFontSize, // antes 16
    marginBottom: cardMargin, // antes 10
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cover: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.78,
    marginBottom: cardMargin, // antes 10
    borderRadius: cardBorderRadius, // antes 6
    backgroundColor: "#eee",
    resizeMode: "contain",
  },

  button: {
    flex: 1,
    marginHorizontal: cardMargin * 0.4, // antes 4
    justifyContent: "center",
  },

  estadoMenu: {
    position: "absolute",
    bottom: buttonHeight * 1.3, // igual que el filtro
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
    borderRadius: cardBorderRadius * 0.6, // antes 4
  },

  estadoOpcion: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  estadoTexto: {
    fontSize: filterOptionFontSize, // antes 16
    color: "#333",
  },

  estadoTextoActivo: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: filterOptionFontSize,
  },

  platforms: {
    fontSize: smallTextFontSize, // antes 14
    fontStyle: "italic",
    color: "#555",
    marginBottom: cardMargin * 0.8, // antes 8
  },
});
