# Viperhead - AI Image Generator 🐍

A React Native mobile app that generates unique images of a black lab with a viper's head using DALL-E 3. Built with Expo and TypeScript.

## Features

- **AI Image Generation**: Uses OpenAI's DALL-E 3 to create unique hybrid images
- **Style Variety**: Automatically applies random artistic styles (Van Gogh, Renaissance, Cyberpunk, etc.)
- **Image History**: View and manage all your previously generated images
- **Save to Gallery**: Save any generated image directly to your phone's photo library
- **Google Authentication**: Secure login system with email-based access control
- **Modern UI**: Clean, responsive interface with dark mode support

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Authentication**: Google OAuth via expo-auth-session
- **Routing**: Expo Router with file-based routing
- **State Management**: React Context for auth, custom hooks for image storage
- **AI Integration**: OpenAI API (DALL-E 3)
- **Storage**: Local storage with expo-file-system and expo-media-library

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `config.ts` file in the project root with:
   ```typescript
   export const CONFIG = {
     GOOGLE_CLIENT_ID: 'your_google_client_id',
     OPENAI_API_KEY: 'your_openai_api_key',
     ALLOWED_EMAILS: ['your@email.com']
   };
   ```

4. Start the development server:
   ```bash
   # Local development
   npx expo start

   # Using tunnel (recommended for mobile device testing)
   npx expo start --tunnel
   ```

5. Build development client (required for iOS):
   ```bash
   # Install EAS CLI if you haven't already
   npm install -g eas-cli

   # Build development client
   eas build --profile development --platform ios
   ```

   Note: Building for iOS requires an Apple Developer account. The development build enables testing native features like image saving that aren't available in Expo Go.

## Project Structure

- `/app`: Main application code using file-based routing
  - `/(protected)`: Routes that require authentication
    - `/(tabs)`: Tab-based navigation
      - `index.tsx`: Image generation screen
      - `history.tsx`: Generated images history
  - `login.tsx`: Authentication screen
- `/hooks`: Custom React hooks
  - `useAuth.tsx`: Authentication logic
  - `useSaveImage.tsx`: Image saving functionality
- `/components`: Reusable UI components
- `/stores`: State management
  - `imageStore.ts`: Generated images storage

## Development Notes

- The app uses Expo's development build for testing
- Google authentication requires proper setup in the Google Cloud Console
- DALL-E 3 API calls require an OpenAI API key with sufficient credits
- Image saving functionality requires user permission for photo library access

## Future Enhancements

- Add image sharing capabilities
- Implement custom style selection
- Add image editing features
- Support for multiple animal combinations
- Cloud storage for generated images
