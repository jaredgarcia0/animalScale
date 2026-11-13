# Animal Scale

Animal Scale is a TypeScript guessing game built with Expo and Expo Router. Players compare two animal silhouettes, identify which animal is incorrectly scaled, and adjust its size to match the animal's real-world length. The current demo supports two local players, five rounds, local scoring, and web, iOS, and Android targets.

## Instructions for Build and Use

### Build and run

Run these commands from the `animalScale` directory:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Expo development server:

   ```bash
   npx expo start
   ```

3. Choose a target from the Expo terminal menu, or start the web version directly:

   ```bash
   npm run web
   ```

   If port `8081` is already in use:

   ```bash
   npx expo start --web --port 8082
   ```

### Use the software

1. Open the app in a browser, Expo Go, or a development build.
2. Select the animal you believe is incorrectly scaled.
3. Move the slider to adjust the selected animal's size.
4. Optionally hide the measurement values for both players.
5. Submit the guess, pass the turn to the other player, and complete all five rounds.
6. Review the final scores and winner on the match-complete screen.

## Development Environment

To recreate the development environment, install the following:

* Node.js 26 or a compatible current Node.js release
* npm 11 or compatible npm release
* Expo SDK 58.0.25
* Expo Router 58.0.31
* React 19.3.0
* React Native 0.88.1
* React Native Web 0.21.4
* TypeScript 6.0.3

The project uses TypeScript, Expo Router file-based navigation, and the existing Expo UI slider component. No Supabase or multiplayer backend is currently required.

## Useful Websites to Learn More

* [Expo Documentation](https://docs.expo.dev/)
* [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
* [Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)
* [React Native Documentation](https://reactnative.dev/docs/getting-started)
* [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Future Work

The following items are planned improvements:

* [ ] Fix the existing ESLint configuration and make the lint command pass cleanly.
* [ ] Resolve the existing web tab-button TypeScript `ref` compatibility error.
* [ ] Add a How to Play screen and functional home-screen navigation.
* [ ] Add Supabase authentication and online multiplayer after local gameplay is stable.
* [ ] Add a game lobby and invite/join flow for exactly two online players.
* [ ] Expand the animal library and add more varied round data.
* [ ] Add automated tests for scoring, round progression, and match completion.
