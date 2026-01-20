# LiFlux - Claude Code Guide
***

## Overview
LiFlux is a free, open-source private digital memory and visual organization tool. It acts as an extension of your mind, allowing you to capture and organize images, notes, and links. LiFlux prioritizes privacy and data ownership by leveraging iCloud for storage and synchronization.

## Build & Development
- **Install Dependencies:** `bun install`
- **Start Development Server:** `bun start`
- **Run Android:** `bun android`
- **Run iOS:** `bun ios`
- **Run Web:** `bun web`

## Tech Stack
- **Runtime:** Bun
- **Framework:** Expo (React Native)
- **Language:** TypeScript
- **State Management:** (To be decided)
- **Storage:** iCloud (CloudKit)

## Project Standards
- **Naming:** Use PascalCase for components, camelCase for variables/functions.
- **Typing:** Strict TypeScript usage; avoid `any`.
- **Components:** Functional components with Hooks.
- **Styling:** `StyleSheet.create` or Tailwind (if added later).

## Key Files
- `App.tsx`: Main entry point.
- `app.json`: Expo configuration.
- `GEMINI.md`: Project overview and roadmap.

## Phase 1: Architecture & MVP

### 1. Folder Structure
Establish the following directory structure within `src/` to ensure scalability:
```
src/
├── components/   # Reusable UI elements (buttons, cards, inputs)
├── screens/      # Main screen views (Home, Settings, Editor)
├── navigation/   # Navigation configuration (Stacks, Tabs)
├── types/        # TypeScript interfaces and types
├── context/      # React Context for global state (Theme, Data)
├── services/     # Logic for storage (iCloud/FS) and API
└── theme/        # Design system tokens (Colors, Typography)
```

### 2. Technical Decisions
- **Navigation:** Use `@react-navigation/native` with `@react-navigation/native-stack`.
- **UI Library:** Build custom components using `StyleSheet`. Avoid heavy UI kits for now to keep it lightweight.
- **Icons:** Use `lucide-react-native` for a modern, consistent icon set.
- **State/Storage:** Start with local state + `AsyncStorage` (mocking iCloud) for the MVP. Interface it properly so swapping to CloudKit later is seamless.

### 3. Immediate Implementation Tasks
1.  **Setup Navigation:**
    - Install React Navigation dependencies.
    - Create `AppNavigator` with a `Home` screen and `Editor` modal.
2.  **Define Core Types (`src/types/index.ts`):**
    - `MemoryType`: `'text' | 'image' | 'link'`
    - `MemoryItem`: `{ id: string; type: MemoryType; content: string; date: string; }`
3.  **Create Components:**
    - `MemoryCard`: To display an item in the feed.
    - `FloatingActionButton`: For adding new memories.
4.  **Home Screen:**
    - Render a `FlatList` of mock data.
    - Implement the FAB to navigate to `Editor`.
