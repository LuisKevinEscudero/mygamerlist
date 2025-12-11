import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function GameSuggestionItem({ game, onSelect }) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onSelect(game)}>
      {game.safe_cover && (
        <Image source={{ uri: game.safe_cover }} style={styles.cover} />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{game.name}</Text>
        {game.platforms && (
          <Text style={styles.platforms}>
            {game.platforms.map(p => p.platform.name).join(", ")}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", padding: 8, alignItems: "center" },
  cover: { width: 50, height: 50, borderRadius: 6, marginRight: 8 },
  info: { flex: 1 },
  name: { fontWeight: "bold", fontSize: 16 },
  platforms: { fontSize: 12, color: "#555" },
});
