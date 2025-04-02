import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // RewardItem, CommunityItem common styles
  gridItem: {
    marginLeft: 25,
    width: 200,
    height: 205,
    marginBottom: 10,
    backgroundColor: "#F1CFA3",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  imageBox: {
    // alignSelf: "center",
    // resizeMode: "cover",
    // height: "60%",
  },
  image: {
    width: 198,
    height: 120,
    resizeMode: "stretch",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  text: {
    backgroundColor: "#FFFFFF",
    height: 88,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "left",
    marginTop: 5,
    marginLeft: 10,
    fontWeight: "bold",
  },
  subDescription: {
    fontSize: 13,
    textAlign: "left",
    marginLeft: 10,
  },
  pointContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  point: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "left",
    marginLeft: 10,
    color: "#FF8D13",
  },
  pointDesc: {
    fontSize: 15,
    textAlign: "left",
  },
});

export default styles;
