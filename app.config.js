import 'dotenv/config';

export default {
  expo: {
    name: 'viperhead',
    slug: 'viperhead',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'viperhead',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.gigagram.viperhead',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              'com.googleusercontent.apps.862228002068-ak3bk6d92p31s8rli3uctqvkiu6lputn',
            ],
          },
        ],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.gigagram.viperhead',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: '9ad3e368-21c7-4d41-ae9b-ca34a961e240',
      },
      router: {
        origin: false,
      },
      openaiApiKey: process.env.OPENAI_API_KEY,
    },
    owner: 'gigagram',
  },
};
