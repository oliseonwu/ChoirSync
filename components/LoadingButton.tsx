import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { styles } from "@/shared/css/signinLoginCss";

type LoadingButtonProps = {
  isLoading: boolean;
  onPress: () => void;
  disabled?: boolean;
  loadingText?: string;
  buttonText: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loadingIndicatorColor?: string;
  loadingContainerStyle?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  disabledStyle?: StyleProp<ViewStyle>;
  loadingTextStyle?: StyleProp<TextStyle>;
  backgroundColor?: string;
};

const LoadingButton = ({
  isLoading,
  onPress,
  disabled = false,
  loadingText,
  buttonText,
  style,
  textStyle,
  loadingIndicatorColor = "#fff",
  loadingContainerStyle,
  activeOpacity = 0.7,
  disabledStyle,
  loadingTextStyle,
  backgroundColor = "#313234",
}: LoadingButtonProps) => {
  const buttonDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        { backgroundColor },
        style,
        buttonDisabled && { opacity: 0.7 },
        buttonDisabled && disabledStyle,
      ]}
      onPress={onPress}
      disabled={buttonDisabled}
      activeOpacity={activeOpacity}
    >
      {isLoading ? (
        <View
          style={[
            { flexDirection: "row", alignItems: "center", gap: 8 },
            loadingContainerStyle,
          ]}
        >
          <ActivityIndicator color={loadingIndicatorColor} />
          {loadingText && (
            <Text style={[textStyle, loadingTextStyle]}>{loadingText}</Text>
          )}
        </View>
      ) : (
        <Text style={textStyle}>{buttonText}</Text>
      )}
    </TouchableOpacity>
  );
};

export default LoadingButton;
