import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Text } from "react-native-paper";

type HeaderTextProps = {
  style?: StyleProp<ViewStyle>;
  children: string;
};

const HeaderText = ({ style, children }: HeaderTextProps) => {
  return <Text style={[styles.header, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  header: {
    fontFamily: "Roboto-Bold",
    // fontWeight: "bold",
    fontSize: 22,
    color: "#000000",
  },
});

export default HeaderText;
