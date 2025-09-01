import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GameListScreen from "./screens/GameListScreen";
import AddGameScreen from "./screens/AddGameScreen";
import RandomGameScreen from "./screens/RandomGameScreen";
import LoadingScreen from "./screens/LoadingScreen"; // 👈 añadimos esta

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
         <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GameList"
          component={GameListScreen}
          options={{ title: "Mi Lista Gamer" }}
        />
        <Stack.Screen
          name="AddGame"
          component={AddGameScreen}
          options={{ title: "Añadir Juego" }}
        />
        <Stack.Screen
          name="RandomGame"
          component={RandomGameScreen}
          options={{ title: "Juego Aleatorio" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
