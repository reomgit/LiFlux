export const ROUTES = {
  // Tab routes
  HOME_TAB: 'HomeTab',
  SETTINGS_TAB: 'SettingsTab',

  // Stack routes
  HOME: 'Home',
  NOTE_DETAIL: 'NoteDetail',
  SETTINGS: 'Settings',

  // Modal routes
  CREATE_NOTE: 'CreateNote',
} as const;

export type RouteNames = (typeof ROUTES)[keyof typeof ROUTES];
