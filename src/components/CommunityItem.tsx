import { Pressable, View, Text, Image, StyleSheet } from "react-native";
import { CommunityType } from "../types";
import styles from "../styles";

export default function CommunityItem({
  item,
  navigation,
}: {
  item: CommunityType;
  navigation: any;
}) {
  return (
    <Pressable
      onPress={() => navigation.navigate("CommunityProfile", { item })}
    >
      <View style={styles.gridItem}>
        <Image source={{ uri: item.logo }} style={styles.image} />
        <View style={styles.text}>
          <Text style={styles.description}>{item.name}</Text>
          <Text style={styles.subDescription}>{item.description}</Text>
        </View>
      </View>
    </Pressable>
  );
}