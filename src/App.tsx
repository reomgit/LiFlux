import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { NotesProvider } from './context/NotesContext';
import { SearchProvider } from './context/SearchContext';
import { AppNavigator } from './navigation/AppNavigator';
import { colors } from './theme/colors';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <NotesProvider>
            <SearchProvider>
              <StatusBar style="dark" />
              <AppNavigator />
            </SearchProvider>
          </NotesProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
});
