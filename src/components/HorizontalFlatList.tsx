import { StyleSheet, Pressable, View, FlatList, Text } from "react-native";
import ButtonText from "./text_components/ButtonText";
import PrimaryText from "./text_components/PrimaryText";

type ListSectionProps<T> = {
  title: string;
  data: T[];
  navigation?: any;
  renderItem: ({ item }: { item: T }) => JSX.Element;
  seeAllPage?: string;
};

const DATA_LIMIT = 5; // 限制显示的数据数量

export default function ListSection<T>({
  title,
  data,
  navigation,
  renderItem,
  seeAllPage,
}: ListSectionProps<T>) {
  return (
    <View>
      <View style={styles.listHeader}>
        <PrimaryText>{title}</PrimaryText>
        {seeAllPage && (
          <Pressable onPress={() => navigation?.navigate(seeAllPage)}>
            <ButtonText>See all</ButtonText>
          </Pressable>
        )}
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        // data={data.slice(0, DATA_LIMIT)}
        keyExtractor={(item) => (item as any).id} // 适配泛型数据
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No data available</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginLeft: 5,
  },
  flatListContent: {
    paddingTop: 5,
    paddingRight: 25,
  },
  emptyText: {
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
});
