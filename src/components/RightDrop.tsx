import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { List, Divider, useTheme } from "react-native-paper";

type RightDropProps = {
  onNavigate: () => void;
  title: string;
  children: string;
  subItems?: { title: string; onNavigate: () => void }[];
};

const RightDrop = ({ onNavigate, title, children, subItems }: RightDropProps) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);

  if (subItems && subItems.length > 0) {
    return (
      <View style={styles.accordionContainer}>
        <List.Accordion
          title={title}
          description={children}
          expanded={expanded}
          onPress={handlePress}
          titleStyle={{ color: colors.primary }}
          style={{ backgroundColor: colors.background }}
          right={props => (
            <List.Icon
              {...props}
              icon={expanded ? "chevron-up" : "chevron-down"}
              color={"#FF8D13"}
            />
          )}
        >
          {subItems.map((item, index) => (
            <List.Item
              key={index}
              title={item.title}
              onPress={item.onNavigate}
              right={(props) => (
                <List.Icon {...props} icon="chevron-right" color={"#FF8D13"} />
              )}
            />
          ))}
        </List.Accordion>
        <Divider />
      </View>
    );
  }

  return (
    <View>
      <List.Item
        title={title}
        description={children}
        right={(props) => (
          <List.Icon {...props} icon="chevron-right" color={"#FF8D13"} />
        )}
        onPress={onNavigate}
        style={styles.item}
      />
      <Divider />
    </View>
  );
};

export default RightDrop;

const styles = StyleSheet.create({
  item: {
    paddingVertical: 10,
  },
  accordionContainer: {
    backgroundColor: "white",
  },
});
