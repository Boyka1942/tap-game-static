// Load environment variables with proper priority (system > .env)
import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

// Bundle ID format: space.manus.<project_name_dots>.<timestamp>
// e.g., "my-app" created at 2024-01-15 10:30:45 -> "space.manus.my.app.t20240115103045"
const bundleId = "{{bundle_id}}";
// Extract timestamp from bundle ID and prefix with "manus" for deep link scheme
// e.g., "space.manus.my.app.t20240115103045" -> "manus20240115103045"
const timestamp = bundleId.split(".").pop()?.replace(/^t/, "") ?? "";
const schemeFromBundleId = `manus${timestamp}`;

const env = {
  // App branding - update these values directly (do not use env vars)
  appName: "UP Token Tap Game",
  appSlug: "up-token-tap-game",
  // S3 URL of the app logo
  logoUrl: "https://private-us-east-1.manuscdn.com/sessionFile/9s3pitDiaW87CapWBvVJ4M/sandbox/SkdzvnWIYw2o9pLFGVGjai-img-1_1771213714000_na1fn_aWNvbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOXMzcGl0RGlhVzg3Q2FwV0J2Vko0TS9zYW5kYm94L1NrZHp2bldJWXcybzlwTEZHVkdqYWktaW1nLTFfMTc3MTIxMzcxNDAwMF9uYTFmbl9hV052YmcucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=FV35nE1T9ITo0b~UDD404Ek2Jw7ZUamg~r60OAptrQ0cf0evMdu43HNhBVCmxKLmcKEez3Y52AqZJcLCLPhctuwAqm-~S-l~QgCNXhv5NyIF9yE-JuwOFzIpEvlMtfnwHh4ZsZhWTs1XgSJ0Xgxr70eiHo6EIquqVBV1j4e~F1YDHbdwQZ1t4vWPHPujdGma7KNeLjtxrOd8PSygssygrD1px~Mof6eghrDOVyEFeM0RIBrzcdQapyvHSuFWTrSTFZeyOW7CQyGQ6ck6elNZkcQ5NlOHWnpsJvRPLjmHaUpsZlKqKiipXHyQUcJXfB5GoUusfQVXbCSpJ63Ju~71Ow__",
  scheme: schemeFromBundleId,
  iosBundleId: bundleId,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#7FFF00",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    permissions: ["POST_NOTIFICATIONS"],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: env.scheme,
            host: "*",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-audio",
      {
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone.",
      },
    ],
    [
      "expo-video",
      {
        supportsBackgroundPlayback: true,
        supportsPictureInPicture: true,
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          buildArchs: ["armeabi-v7a", "arm64-v8a"],
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
