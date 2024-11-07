declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_PARSE_APPLICATION_ID: string;
      EXPO_PUBLIC_PARSE_JAVASCRIPT_KEY: string;
      EXPO_PUBLIC_PARSE_SERVER_URL: string;
    }
  }
}

export {};
