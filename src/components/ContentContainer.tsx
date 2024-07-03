import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

type ContentContainerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const ContentContainer = ({ children, style }: ContentContainerProps) => {
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: "white",
        },
        style,
      ]}
    >
      <View
        style={{
          flex: 1,
          marginHorizontal: 25,
          // marginVertical: 15,
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default ContentContainer;
