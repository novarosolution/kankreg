/* eslint-env node */
/**
 * Extends app.json (location copy for delivery + live share).
 * Do not add `react-native-maps` as an Expo config plugin — it is not a valid plugin and breaks config/export.
 * Configure Google Maps API keys via native projects after `expo prebuild`, or see Expo docs for maps + env.
 */
const { expo } = require("./app.json");

module.exports = {
  expo: {
    ...expo,
    extra: {
      ...expo.extra,
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      googleOAuthWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      googleOAuthIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      googleOAuthAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      googleOAuthClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      appleOAuthClientId: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID,
    },
    ios: {
      ...expo.ios,
      usesAppleSignIn: true,
      infoPlist: {
        ...expo.ios?.infoPlist,
        NSLocationWhenInUseUsageDescription:
          "KankreG uses your location for delivery addresses and optional live location sharing while you deliver orders.",
      },
    },
    plugins: [...(expo.plugins || []), "expo-web-browser"],
  },
};
