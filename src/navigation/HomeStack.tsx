import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { NoteDetailScreen } from '../screens/NoteDetailScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
    </Stack.Navigator>
  );
}
