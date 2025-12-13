import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";

export default function GameSuggestionItem({ game, onSelect }) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onSelect(game)}>
      <Image
        source={{
          uri: game.safe_cover
            ? game.safe_cover
            : "https://dummyimage.com/50x50/cccccc/ffffff.png&text=?"
        }}
        style={styles.cover}
        contentFit="cover"              // ajusta la imagen sin recálculos
        cachePolicy="memory-disk"       // caché en memoria y disco
      />

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
