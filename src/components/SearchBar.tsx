import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
};

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  onSearch,
}: SearchBarProps) {
  return (
    <View style={styles.searchContainer}>
      {/* 点击搜索图标触发 onSearch */}
      <TouchableOpacity onPress={onSearch} style={styles.searchIcon}>
        <Icon name="search" size={20} color="#888" />
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={onSearch} // 用户按 "Enter" 也能触发搜索
      />

      {/* 只有在输入框有内容时才显示清除按钮 */}
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
          <Icon name="close-circle" size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#F5F5F5",
    borderRadius: 25,
    top: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  searchIcon: {
    marginRight: 8,
    padding: 5, // 增加点击区域
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    marginLeft: 8,
    padding: 5, // 增加点击区域
  },
});
