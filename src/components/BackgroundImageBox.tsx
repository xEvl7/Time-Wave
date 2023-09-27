import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import React from "react";

type BackgroundImageBoxProps = {
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  source: ImageSourcePropType;
};

const BackgroundImageBox = ({
  style,
  imageStyle,
  source,
}: BackgroundImageBoxProps) => {
  return (
    <View style={[styles.box, style]}>
      <Image style={imageStyle} source={source}></Image>
    </View>
  );
};

export default BackgroundImageBox;

const styles = StyleSheet.create({
  box: {
    height: "43%",
    width: "100%",
    backgroundColor: "#A3D1F8",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
 
});


