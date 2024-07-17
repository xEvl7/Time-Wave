import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const ListItem = ({
  imageSource,
  title,
  subtitle,
  points,
  onPress,
}: {
  imageSource: any;
  title: any;
  subtitle: any;
  points: any;
  onPress: any;
}) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.pointsContainer}>
          <Image
            source={require("../assets/diamond.png")}
            style={styles.icon}
          />
          <Text style={styles.points}>{points}</Text>
          <Text style={styles.pointsLabel}> Points</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  image: {
    width: 150,
    height: 100,
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 6,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  points: {
    fontSize: 14,
    fontWeight: "bold",
  },
  pointsLabel: {
    fontSize: 12,
    marginLeft: 2,
  },
});

export default ListItem;
