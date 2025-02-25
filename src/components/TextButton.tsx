import { useRef } from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  Animated,
} from "react-native";

type TextButtonProps = {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress: (event: GestureResponderEvent) => void;
  children: string;
};

export default function TextButton({
  style,
  textStyle,
  onPress,
  children,
}: TextButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current; // 初始缩放值为 1

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9, // 缩小
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, // 恢复大小
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          style,
          pressed && styles.buttonPressed,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Text style={[styles.buttonText, textStyle]}>{children}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 45,
    backgroundColor: "#FF8D13",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 15,
  },
  buttonPressed: {
    backgroundColor: "#E67610", // 按下时颜色变深
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});
