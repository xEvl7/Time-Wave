import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../styles";

const VerticalItemList = ({
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
    <View style={styles.verticalGridItem}>
      <View style={styles.verticalImageBox}>
        <Image source={{ uri: imageSource }} style={styles.verticalImage} />
      </View>
      <View style={styles.verticalTextContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSubTitle}>{subtitle}</Text>
        <View style={styles.pointContainer}>
          <Image
            source={require("../assets/diamond.png")}
            style={styles.pointIcon}
          />
          <Text style={styles.point}>{points} Points</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default VerticalItemList;
