import { StyleSheet, Text } from "react-native";

export default function HeaderText({ children }) {
  return <Text style={styles.header}>{children}</Text>;
}

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF"
  },
});
