import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { List, Divider, useTheme } from "react-native-paper";
import ToggleButton from "../components/togglebutton";
import ToggleSwitch from "./ToggleSwitch";

type RightDropProps = {
  onNavigate: () => void;
  title: string;
  children: string;
  subItems?: { title: string; onNavigate: () => void }[];
  subSwitch?: { title: string }[];
};

const RightDrop = ({
  onNavigate,
  title,
  children,
  subItems,
  subSwitch,
}: RightDropProps) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const primaryColor = colors.primary ?? "#FF8D13";
  const chevronColor = "#FF8D13";

  const handlePress = () => setExpanded(!expanded);

  const renderItemStyle = {
    paddingVertical: 10,
    paddingHorizontal: 16,
  };

  if ((subItems && subItems.length > 0) || (subSwitch && subSwitch.length > 0)) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <List.Accordion
          title={title}
          description={children}
          expanded={expanded}
          onPress={handlePress}
          titleStyle={[styles.title, { color: primaryColor }]}
          descriptionStyle={styles.description}
          style={styles.accordion}
          right={(props) => (
            <List.Icon
              {...props}
              icon={expanded ? "chevron-up" : "chevron-down"}
              color={chevronColor}
            />
          )}
        >
          {subItems?.map((item, index) => (
            <List.Item
              key={`item-${index}`}
              title={item.title}
              onPress={item.onNavigate}
              style={renderItemStyle}
              titleStyle={styles.subItemTitle}
              right={(props) => (
                <List.Icon {...props} icon="chevron-right" color={chevronColor} />
              )}
            />
          ))}
          {subSwitch?.map((item, index) => (
            <List.Item
              key={`toggle-${index}`}
              title={item.title}
              style={renderItemStyle}
              titleStyle={styles.subItemTitle}
              right={() => <ToggleSwitch />}
            />
          ))}
        </List.Accordion>
        <Divider style={[styles.divider, { backgroundColor: colors.outline }]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <List.Item
        title={title}
        description={children}
        onPress={onNavigate}
        style={styles.item}
        titleStyle={[styles.title, { color: primaryColor }]}
        descriptionStyle={styles.description}
        right={(props) => (
          <List.Icon {...props} icon="chevron-right" color={chevronColor} />
        )}
      />
      <Divider style={[styles.divider, { backgroundColor: colors.outline }]} />
    </View>
  );
};

export default RightDrop;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 4,
  },
  item: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  accordion: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 13,
    color: "#888",
  },
  subItemTitle: {
    fontSize: 15,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 8,
  },
});
