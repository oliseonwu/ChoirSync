import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import Parse from "parse/react-native";

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(
  process.env.EXPO_PUBLIC_PARSE_APPLICATION_ID!,
  process.env.EXPO_PUBLIC_PARSE_JAVASCRIPT_KEY!
);

// console.log(Parse.applicationId);
Parse.serverURL = process.env.EXPO_PUBLIC_PARSE_SERVER_URL!;

export default Parse;
