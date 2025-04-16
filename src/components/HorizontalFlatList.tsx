import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Text,
} from "react-native";
import ButtonText from "./text_components/ButtonText";
import PrimaryText from "./text_components/PrimaryText";

type ListSectionProps<T> = {
  title: string;
  data: T[];
  navigation?: any;
  renderItem: ({ item }: { item: T }) => JSX.Element;
  seeAllPage?: string;
  keyExtractor?: (item: T, index: number) => string; // Add this
};

const DATA_LIMIT = 5; // 限制显示的数据数量

export default function HorizontalFlatList<T>({
  title,
  data,
  navigation,
  renderItem,
  seeAllPage,
  keyExtractor,
}: ListSectionProps<T>) {
  return (
    <View>
      <View style={styles.listHeader}>
        <PrimaryText>{title}</PrimaryText>
        {seeAllPage && (
          <TouchableOpacity onPress={() => navigation?.navigate(seeAllPage ,{ data })}>
            <ButtonText>See all</ButtonText>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        // data={data.slice(0, DATA_LIMIT)}
        // keyExtractor={(item) => (item as any).id} // 适配泛型数据
        keyExtractor={keyExtractor ?? ((item, index) => `item-${index}`)} // Use provided keyExtractor or index
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={
          <View style={styles.listHeader}>
            <Text style={styles.emptyText}>No data available</Text>
          </View>
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
