import { StyleProp, View, ViewStyle } from "react-native";
import React from "react";

type ContentContainerProps = {
  children: React.JSX.Element[];
  style?: StyleProp<ViewStyle>;
};

const ContentContainer = ({ children, style }: ContentContainerProps) => {
  return (
    <View
      style={[
        {
          marginHorizontal: 25,
          marginVertical: 15,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default ContentContainer;
