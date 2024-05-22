import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

type HeaderTextProps = {
  style?: StyleProp<ViewStyle>;
  children: string;
};

export default function HeaderText({ style, children }: HeaderTextProps) {
  return <Text style={[styles.header, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000"
  },
});
