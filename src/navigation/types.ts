import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Home stack param list
export type HomeStackParamList = {
  Home: undefined;
  NoteDetail: { noteId: string };
};

// Tab navigator param list
export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SettingsTab: undefined;
};

// Root stack param list
export type RootStackParamList = {
  Main: NavigatorScreenParams<TabParamList>;
  CreateNote: { attachmentUri?: string } | undefined;
};

// Screen props types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = BottomTabScreenProps<
  TabParamList,
  T
>;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

// Declare global types for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
