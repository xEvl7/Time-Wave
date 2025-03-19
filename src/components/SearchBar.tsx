import { View, TextInput, StyleSheet } from "react-native";
import TextButton from "./TextButton";

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
      <TextInput
        style={styles.searchInput}
        placeholder="Search text..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TextButton style={styles.searchButton} onPress={onSearch}>
        Search
      </TextButton>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flex: 0.3,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
    // margin: 10,
    // top: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    // backgroundColor: "#FF8D13",
    // borderRadius: 8,
  },
  // searchButtonText: {
  //   color: "#FFFFFF",
  // },
});
