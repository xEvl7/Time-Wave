import React from "react";
import { View, StyleSheet } from "react-native";

const ProgressBar = ({
  progressPercentage,
}: {
  progressPercentage: number;
}) => {
  const clampedProgress = Math.min(Math.max(progressPercentage, 0), 1); // 限制范围在 0 ~ 1

  return (
    <View style={styles.progressBar}>
      <View
        style={{
          width: `${clampedProgress * 100}%`, // 确保不会超过 100%
          height: 5,
          backgroundColor: "white",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    height: 5,
    backgroundColor: "#FBB97C",
    width: "100%", // 确保进度条有固定宽度
  },
});

export default ProgressBar;
