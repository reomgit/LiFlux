import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SystemUI from 'expo-system-ui';
import { NotesProvider } from '../src/context/NotesContext';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.neutral[50]);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NotesProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.neutral[50] },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="create"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                gestureEnabled: true,
                gestureDirection: 'vertical',
              }}
            />
            <Stack.Screen
              name="note/[id]"
              options={{
                animation: 'slide_from_right',
              }}
            />
          </Stack>
        </NotesProvider>
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
