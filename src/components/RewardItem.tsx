import { Pressable, View, Text, Image, StyleSheet } from "react-native";
import { RewardType } from "../types";
import styles from "../styles";

export default function RewardItem({
  item,
  navigation,
}: {
  item: RewardType;
  navigation: any;
}) {
  return (
    <Pressable onPress={() => navigation.navigate("Reward", { item })}>
      <View style={styles.gridItem}>
        <View style={styles.imageBox}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>
        <View style={styles.text}>
          <Text style={styles.description}>{item.name}</Text>
          <Text style={styles.subDescription}>{item.supplierName}</Text>
          <View style={styles.pointContainer}>
            <Text style={styles.point}>{item.price}</Text>
            <Text style={styles.pointDesc}> points</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
