import {
    Image,
    ImageSourcePropType,
    ImageStyle,
    TextStyle,    
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
    Text,
  } from "react-native";
  import React from "react";

  type ProfilePictureProps = {
    style?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    textStyle?: StyleProp<TextStyle>;
    source: string;
    children: string;
  };

  const ProfilePicture = ({
    style,
    imageStyle,
    textStyle,
    source,
    children,
  }: ProfilePictureProps) => {
    return(
        <View style = {[styles.frame, style]}>
            <Image style={[styles.image, imageStyle]} source={source}></Image>
            <Text  style={[styles.textname, textStyle]}>{children}</Text>
        </View>
    );
  };

  export default ProfilePicture;

  const styles = StyleSheet.create({
    frame: {
        width:"40%",
        marginHorizontal:20,
    },
    image: {
        borderRadius: 40,
        borderColor: "#757575",
    },
    textname: {
      color:"black",
      fontSize:14,
      fontWeight:"500",
    },
  });