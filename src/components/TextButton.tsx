import {
  StyleSheet,
  Text,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
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
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 45,
    backgroundColor: "#FF8D13",
    borderRadius: 12,
    marginBottom: 15,
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
});
