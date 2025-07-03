import {
  View,
  Text,
  Image,
  Animated,
  TouchableWithoutFeedback,
  GestureResponderEvent,
} from "react-native";
import { CommunityType } from "../types";
import styles from "../styles";
import { useRef } from "react";

export default function CommunityItem({
  item,
  navigation,
}: {
  item: CommunityType;
  navigation: any;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const startTouch = useRef({ x: 0, y: 0 }).current;

  const handlePressIn = (event: GestureResponderEvent) => {
    startTouch.x = event.nativeEvent.pageX;
    startTouch.y = event.nativeEvent.pageY;

    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    const endX = event.nativeEvent.pageX;
    const endY = event.nativeEvent.pageY;

    const distance = Math.sqrt(
      Math.pow(endX - startTouch.x, 2) + Math.pow(endY - startTouch.y, 2)
    );

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();

    if (distance < 5) {
      // 只有当手指几乎没有移动时才跳转
      navigation.navigate("CommunityInfo",  item );
      console.log("CommunityInfo : communityitem", item);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[styles.horizontalGridItem, { transform: [{ scale: scaleAnim }] }]}
      >
        <View style={styles.horizontalImageBox}>
          <Image source={{ uri: item.logo }} style={styles.horizontalImage} />
        </View>
        <View style={styles.horizontalTextContainer}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemSubTitle}>{item.description}</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
