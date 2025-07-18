import {
  View,
  Text,
  Image,
  Animated,
  TouchableWithoutFeedback,
  GestureResponderEvent,
} from "react-native";
import { RewardType } from "../types";
import styles from "../styles";
import { useRef } from "react";
import { truncateText } from "../utils/commonUtils";

export default function RewardItem({
  item,
  navigation,
}: {
  item: RewardType;
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
      navigation.navigate("RewardDetails", { item });
    }
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.horizontalGridItem,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.horizontalImageBox}>
          <Image source={{ uri: item.image }} style={styles.horizontalImage} />
        </View>
        <View style={styles.horizontalTextContainer}>
          <Text style={styles.itemTitle}>{truncateText(item.name, 22)}</Text>
          <Text style={styles.itemSubTitle}>{truncateText(item.supplierName, 30)}</Text>
          <View style={styles.pointContainer}>
            <Text style={styles.point}>{item.price} points</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
