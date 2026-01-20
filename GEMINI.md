# LiFlux

## Overview
LiFlux is a free, open-source private digital memory and visual organization tool. It acts as an extension of your mind, allowing you to capture and organize images, notes, and links. LiFlux prioritizes privacy and data ownership by leveraging iCloud for storage and synchronization.

## Project Management & Collaboration
This project is guided by an AI Project Manager (Gemini) whose role is to:
- **Plan and Guide:** Orchestrate tasks and provide clear, perfect instructions for the taskforce agent (Claude Code).
- **Technical Oversight:** Ensure every aspect of the project, from front-end to backend, is documented and explainable.
- **Support:** Assist with bugfixing, resolving build errors, file organization, and Git workflow management (commits, pushes, etc.).

## Tech Stack
- **Runtime & Package Manager:** [Bun](https://bun.sh)
- **Framework:** [Expo](https://expo.dev) (React Native)
- **Language:** TypeScript
- **Storage/Backend:** iCloud (CloudKit) via `react-native-cloudkit` or native modules.

## Key Features
- **Privacy First:** Your data is stored in your private iCloud.
- **Cross-Device Sync:** Seamless synchronization across all your Apple devices.
- **Open Source:** Community-driven and free to use.

## Roadmap
- [ ] **Core Mobile App:** Implement basic capturing (Text, Images, Links) on iOS/Android.
- [ ] **iCloud Integration:** Robust sync mechanism using CloudKit.
- [ ] **Desktop Support:** Expand to macOS, Windows, and Linux (potentially using Expo for Web/Electron or React Native Desktop).
- [ ] **Distribution:** Easy installation via Homebrew and other package managers.

## Getting Started

### 1. Install Dependencies
```bash
bun install
```

### 2. Run the Development Server
```bash
bun start
```

### 3. Build/Deploy
*To be defined (Expo EAS or local builds)*