import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import PolicyFragment from "../components/PolicyFragment";

const PointsPolicy = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "PointsPolicy">) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "level1" | "level2" | "level3" | "level4"
  >("level1");

  useEffect(() => {
    setTimeout(() => {
      const userLevel = route.params?.level || "level1";
      setActiveTab(userLevel);
      setIsLoading(false);
    }, 500);
  }, [route.params?.level]);

  const handleTabChange = (tab: "level1" | "level2" | "level3" | "level4") => {
    setActiveTab(tab);
  };

  const getCurrentLevelContent = () => {
    switch (activeTab) {
      case "level1":
        return (
          <PolicyFragment current={`Per month:\n1-10 hours: Each Hour *4`} />
        );
      case "level2":
        return (
          <PolicyFragment current={`Per month:\n11-20 hours: Each Hour *5`} />
        );
      case "level3":
        return (
          <PolicyFragment current={`Per month:\n21-30 hours: Each Hour *6`} />
        );
      case "level4":
        return (
          <PolicyFragment current={`Per month:\n31++ hours: Each Hour *8`} />
        );
      default:
        return (
          <Text style={styles.textContent}>Unable to load the contents</Text>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {["level1", "level2", "level3", "level4"].map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.tabButton, activeTab === level && styles.activeTab]}
            onPress={() =>
              handleTabChange(
                level as "level1" | "level2" | "level3" | "level4"
              )
            }
          >
            <Text
              style={[
                styles.tabText,
                activeTab === level && styles.activeTabText,
              ]}
            >
              {`Level ${level.charAt(level.length - 1)}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#FF8D13"
          style={styles.loadingIndicator}
        />
      ) : (
        getCurrentLevelContent()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: "white",
    backgroundColor: "white",
  },
  activeTab: {
    borderColor: "#FF8D13",
  },
  activeTabText: {
    color: "#FF8D13",
    fontSize: 16,
    fontWeight: "bold",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#BABABA",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fragment: {
    backgroundColor: "white",
    padding: 12,
  },
  textHeader1: {
    fontSize: 14,
    fontWeight: "300",
  },
  textHeader2: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textContent: {
    fontSize: 16,
    fontWeight: "300",
    textAlign: "center",
  },
});

export default PointsPolicy;
