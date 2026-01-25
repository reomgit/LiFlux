# LiFlux

> **Life + Flux**  
> A free, open-source, privacy-focused digital memory tool.

LiFlux is designed to be an extension of your mind, allowing you to capture and organize images, notes, and links with a visual-first approach. It prioritizes your privacy and data ownership by leveraging your personal iCloud for secure storage and synchronization across all your Apple devices.

## 🚀 Key Features

- **Privacy First**: Your data is yours. All notes, images, and links are stored in your private iCloud (CloudKit). No third-party servers access your personal data.
- **Cross-Device Sync**: Seamlessly sync your digital memory across iPhone, iPad, and Mac.
- **Visual Organization**: A clean, glass-morphic UI designed for clarity and focus.
- **Open Source**: Community-driven, transparent, and free to use forever.

## 🛠 Tech Stack

LiFlux is built with modern web and mobile technologies to ensure performance and developer experience:

- **Runtime & Package Manager**: [Bun](https://bun.sh)
- **Framework**: [Expo](https://expo.dev) (React Native)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Storage/Backend**: iCloud (CloudKit) via `react-native-cloudkit` or native modules.
- **UI/Theming**: Custom Glassmorphism design system using `expo-blur` and `expo-linear-gradient`.

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [Bun](https://bun.sh/) (`npm install -g bun`)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npm install -g expo-cli`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/liflux.git
    cd liflux
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

### Running the App

Start the development server:

```bash
bun start
```

This will launch the Expo development server. You can then:
- Press `i` to run on the iOS Simulator.
- Press `a` to run on the Android Emulator.
- Scan the QR code with the Expo Go app on your physical device.

## 📂 Project Structure

```
/
├── app/                 # Expo Router file-based routing
│   ├── (tabs)/          # Main tab navigation
│   └── note/            # Note detail screens
├── src/
│   ├── components/      # Reusable UI components (Glass*, Note*, etc.)
│   ├── constants/       # App constants (Colors, Config)
│   ├── context/         # React Context (State Management)
│   ├── hooks/           # Custom React Hooks
│   ├── services/        # Business logic & API/Storage services
│   ├── theme/           # Design system tokens (Colors, Spacing, Typography)
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions
└── assets/              # Static assets (Images, Icons)
```

## 🗺 Roadmap

- [ ] **Core Mobile App**: Implement basic capturing (Text, Images, Links) on iOS/Android.
- [ ] **iCloud Integration**: Robust sync mechanism using CloudKit.
- [ ] **Desktop Support**: Expand to macOS, Windows, and Linux.
- [ ] **Distribution**: Easy installation via Homebrew and App Stores.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the GNU General Public License v3. See `LICENSE` for more information.