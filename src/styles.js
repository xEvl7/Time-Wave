import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Horizontal Item styles
  horizontalGridItem: {
    width: 200,
    marginLeft: 25,
    marginBottom: 10,
    backgroundColor: "#F1CFA3",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  horizontalImageBox: {
    alignSelf: "center",
    backgroundColor: "#F1CFA3",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalImage: {
    width: 200,
    aspectRatio: 1.5,
    resizeMode: "contain",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1,
  },
  horizontalTextContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // height: 105, // for two lines of text
    height: 90,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 12,
  },

  // Vertical Reward Item styles
  verticalGridItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  verticalImageBox: {
    alignSelf: "center",
    backgroundColor: "#F1CFA3",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  verticalImage: {
    borderRadius: 20,
    width: 150,
    // height: 125,
    aspectRatio: 1.2,
    resizeMode: "contain",
    zIndex: 1,
  },
  verticalTextContainer: {
    marginLeft: 15,
    // marginHorizontal: 10,
    paddingVertical: 10,
    // maxWidth: 210, // 限制最大宽度
    // width: 206,  // 所有item宽度完全一致
    width: "55%",
  },

  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
    zIndex: 2,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    // marginBottom: 4,
  },
  itemSubTitle: {
    fontSize: 13,
    color: "#888",
    marginBottom: 5,
  },

  pointContainer: {
    flexDirection: "row",
    // marginTop: 10,
    // justifyContent: "flex-end",
    // alignItems: "flex-end",
  },
  pointIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  point: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#FF8D13",
  },

  // myReward extra styles
  myRewardGridItem: {
    flexDirection: "row",
    // alignItems: "center",
    marginHorizontal: 10,
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expiryDateText: {
    fontSize: 14,
    color: "#666",
  },

  // tab styles
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "white",
  },
  activeTab: {
    borderBottomWidth: 2,
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

  // three reward status badge styles
  activeBadge: {
    // position: "absolute",
    // right: 10,
    // bottom: -30,
    backgroundColor: "#FF8D13",
    color: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: "bold",
    width: 70,
    alignSelf: "flex-end",
    marginTop: 8,
    textAlign: "center",
  },
  usedBadge: {
    // position: "absolute",
    // right: 10,
    // bottom: -30,
    backgroundColor: "#E0E0E0",
    color: "#616161",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: "bold",
    width: 65,
    alignSelf: "flex-end",
    marginTop: 8,
    textAlign: "center",
  },
  expiredBadge: {
    // position: "absolute",
    // right: 10,
    // bottom: -30,
    backgroundColor: "#FFEBEE",
    color: "#C62828",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: "bold",
    width: 65,
    alignSelf: "flex-end",
    marginTop: 8,
    textAlign: "center",
  },

  // general styles
  greyContainer: { flex: 1, backgroundColor: "#F8F8F8" },
  
  loadingIndicator: { flex: 1, justifyContent: "center", alignItems: "center" },

  listContent: { paddingBottom: 100 },
});

export default styles;
