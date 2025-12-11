import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function SearchHeader({ searchText, setSearchText, sortAsc, setSortAsc }) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
        clearButtonMode="while-editing"
      />
      <TouchableOpacity onPress={() => setSortAsc((prev) => !prev)}>
        <Text style={styles.sortButton}>{sortAsc ? "A-Z" : "Z-A"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    width: 140,
    marginRight: 8,
    fontSize: 16,
  },
  sortButton: {
    color: "#007bff",
    marginRight: 12,
  },
});
