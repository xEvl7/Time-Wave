import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { List, Divider, useTheme } from "react-native-paper";
import ToggleButton from "../components/togglebutton";

type RightDropProps = {
  onNavigate: () => void; // 导航到指定的页面
  title: string; // 标题
  children: string; // 子标题或描述
  subItems?: { title: string; onNavigate: () => void }[]; // 子项目，带有单独的导航功能
  subButtom?: { title: string }[]; // 子项目带按钮
};

const RightDrop = ({ onNavigate, title, children, subItems, subButtom }: RightDropProps) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false); // 默认不展开

  const handlePress = () => setExpanded(!expanded);

  // 如果有 subItems 和/或 subButtom，则显示可以展开的列表
  if ((subItems && subItems.length > 0) || (subButtom && subButtom.length > 0)) {
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
          {/* 渲染 subItems 列表 */}
          {subItems && subItems.map((item, index) => (
            <List.Item
              key={index}
              title={item.title}
              onPress={item.onNavigate}
              right={(props) => (
                <List.Icon {...props} icon="chevron-right" color={"#FF8D13"} />
              )}
            />
          ))}
          {/* 渲染 subButtom 列表 */}
          {subButtom && subButtom.map((item, index) => (
            <List.Item
              key={index}
              title={item.title}
              right={() => <ToggleButton />}
            />
          ))}
        </List.Accordion>
        <Divider />
      </View>
    );
  }

  // 如果没有 subItems 和 subButtom，直接导航到指定页面
  return (
    <View>
      <List.Item
        title={title}
        description={children}
        right={(props) => (
          <List.Icon {...props} icon="chevron-right" color={"#FF8D13"} />
        )}
        onPress={onNavigate} // 直接导航
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
