import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GameListScreen from './screens/GameListScreen';
import AddGameScreen from './screens/AddGameScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GameList">
        <Stack.Screen 
          name="GameList" 
          component={GameListScreen} 
          options={{ title: 'Mi Lista Gamer' }}
        />
        <Stack.Screen 
          name="AddGame" 
          component={AddGameScreen} 
          options={{ title: 'Añadir Juego' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
