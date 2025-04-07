import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  ImageSourcePropType,
  GestureResponderEvent,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import { RootState } from "../store";
import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import ContentContainer from "../components/ContentContainer";
import ProfilePicture from "../components/ProfilePicture";
import ParagraphText from "../components/text_components/ParagraphText";
import { RootStackParamList } from "../Screen.types";
import auth from "@react-native-firebase/auth";
import {
  FirebaseFirestoreTypes,
  firebase,
} from "@react-native-firebase/firestore";
import "@react-native-firebase/firestore";
import { RouteProp, useRoute } from "@react-navigation/native";
import PrimaryText from "../components/text_components/PrimaryText";
import { useAppSelector, useAppDispatch } from "../hooks";
import { selectUserName } from "../features/userSlice";
import { NavigationProp } from "@react-navigation/native";
import ButtonText from "../components/text_components/ButtonText";
import HeaderText from "../components/text_components/HeaderText";
import TextButton from "../components/TextButton";
import { TextInput } from "react-native-paper";
import Navigation from "../Navigation";
import { Header } from "react-native/Libraries/NewAppScreen";
import { ActivityProps } from "../features/activitySlice";

const CommunityInfo = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "CommunityInfo">) => {
  const item = route.params;
  console.log("route.params item", item.id);
  const docId = route.params.id;

  const userId = useAppSelector((state) => state.user.data?.uid) || "";

  const [isAdmin, setIsAdmin] = useState(false);
  const [editDescription, setEditDescription] = useState(
    route.params.description
  );
  const [editName, setEditName] = useState(route.params.name);
  const [image, setImage] = useState<string | null>(route.params.logo || null);

  const update = firebase.firestore().collection("Communities").doc(docId);

  useEffect(() => {
    console.log("checking is admin?");
    try {
      console.log(route.params.admins);
      if (route.params.admins.includes(userId)) {
        setIsAdmin(true);
        console.log("you are admin!");
      }
    } catch (error) {
      console.error("Error checking admin status: ", error);
    }
  }, []);

  const handleEdit = () => {
    savePicture();
    console.log("item");
    console.log(route.params.id);
    console.log("update.update ok");
    update.update({
      description: editDescription, //editDescription,
      logo: image, //editLogo,
      name: editName,
    });
    Alert.alert(
      "",
      "Content Updated Successfully",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: true }
    );
  };

  const handlePressJoin = () => {
    update.update({
      volunteerRequest: firebase.firestore.FieldValue.arrayUnion(userId),
    });
    // firebase.firestore().collection("Users").doc(userId).update({
    //   volunteerRequest: firestore.FieldValue.arrayUnion(docId),
    // });
    Alert.alert(
      "",
      "Join Request Sent Successfuly",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: true }
    );
  };

  const uploadImage = async (uri: string) => {
    const timestamp = new Date().getTime();
    const filename = `image_${timestamp}.jpg`;
    const reference = storage().ref(`user/${filename}`);
    const task = reference.putFile(uri);

    try {
      await task;
      const url = await reference.getDownloadURL();
      return url;
      console.log("Uploaded image URL:", url);
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    let result: ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri); // Update user-selected image
    } else {
      console.log("Image selection cancelled or no image selected.");
    }
  };

  const savePicture = async () => {
    if (!image) {
      Alert.alert("No Image Selected", "Please select an image before saving.");
      return;
    }

    Alert.alert(
      "Save picture",
      "Confirm?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              const uploadedImageUrl = await uploadImage(image); // Upload image
              setImage(uploadedImageUrl); // Update logo state
              const usersRef = firestore().collection("Communities"); //.doc(docId);

              if (docId) {
                const querySnapshot = await usersRef
                  .doc(route.params.id)
                  .get();
                if (!querySnapshot.exists) {
                  await usersRef.doc(route.params.id).update({
                    logo: uploadedImageUrl,
                  });
                  Alert.alert("Success", "User logo updated successfully!");
                  setImage(null); // 將 image 設置為 null，讓按鈕消失
                }
              }
            } catch (error) {
              console.error(
                "Error uploading image or updating user data:",
                error
              );
              Alert.alert(
                "Error",
                "Failed to upload image. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <View>
        <ScrollView>
          <TouchableOpacity onPress={pickImage} style={styles.pictureContainer}>
            <Image
              source={{
                ...(image ? { uri: image } : require("../assets/profile-picture.png")),
              }}
              style={styles.iconImage}
            />
          </TouchableOpacity>
          <ContentContainer>
            <View style={styles.Header}>
              {isAdmin ? (
                <TextInput
                  style={styles.editingText}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your text here... "
                  placeholderTextColor={"#3F51B5"}
                />
              ) : (
                <PrimaryText>{route.params.name}</PrimaryText>
              )}
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.subHeadertext}>About Our Community</Text>
              {isAdmin ? (
                <TextInput
                  style={styles.editingText}
                  value={editDescription}
                  onChangeText={setEditDescription}
                  placeholder="Enter your text here... "
                  placeholderTextColor={"#3F51B5"}
                />
              ) : (
                <Text style={styles.descriptionText}>
                  {" "}
                  {route.params.description}{" "}
                </Text>
              )}
            </View>

            <View style={styles.listHeader}></View>
            <View style={styles.listContainer}>
              <AdminListSection
                title={"Admins"}
                navigation={navigation}
                item={item}
                isAdmin={isAdmin}
                docId={docId}
              />
            </View>

            <View style={styles.listHeader}></View>
            <View style={styles.listContainer}>
              <VolunteerListSection
                title={"Volunteers"}
                navigation={navigation}
                item={item}
                isAdmin={isAdmin}
                docId={docId}
              />
            </View>
            <View style={styles.listHeader}></View>
            <View style={styles.listContainer}>
              <OngoingListSection
                title={"Ongoing Activities"}
                navigation={navigation}
                item={item}
              />
            </View>
            <View style={styles.listHeader}></View>
            <View style={styles.listContainer}>
              <PastListSection
                title={"Past Activities"}
                navigation={navigation}
                item={item}
              />
            </View>
            <View style={styles.listFooter}></View>
          </ContentContainer>
        </ScrollView>
        <View
          style={{
            position: "absolute",
            left: "26%",
            bottom: "3%",
          }}
        >
          {isAdmin ? (
            <TextButton onPress={handleEdit}> Save Changes </TextButton>
          ) : (
            <TextButton onPress={handlePressJoin}>
              {" "}Join this community{" "}
            </TextButton>
          )}
        </View>
      </View>
    </>
  );
};

type NavigationItemProps = {
  itemSource: ImageSourcePropType;
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  isActive: boolean;
};

const NavigationItem = ({
  itemSource,
  text,
  onPress,
  isActive,
}: NavigationItemProps) => {
  return (
    <Pressable
      style={{
        alignItems: "center",
        height: "65%",
      }}
      onPress={onPress}
    >
      <Image source={itemSource} style={{ aspectRatio: 1, height: "65%" }} />
      <Text style={{ fontSize: 14, color: "white", textAlign: "center" }}>
        {text}
      </Text>
    </Pressable>
  );
};

type UserListProps = {
  title: any;
  navigation: NavigationProp<RootStackParamList>;
  item: any;
  isAdmin: any;
  docId: any;
};

type UserType = {
  name: string;
  logo: string;
  isAdmin: any;
  docId: any;
  uid: any;
};

const renderAdminItems = ({
  title,
  item,
  navigation,
  isAdmin,
  docId,
}: {
  title: any;
  item: UserType;
  navigation: any;
  isAdmin: any;
  docId: any;
}) => {
  const handleAdminProfile = () => {
    navigation.navigate("ProfileInfo", { item });
  };

  const adminToRemove = item.uid;
  const handleRemoveAdmin = () => {
    Alert.alert(
      "Caution",
      `You are going to remove ${item.name} `,
      [
        {
          text: "Remove",
          onPress: () => {
            console.log("Yes Pressed,docId,item : ", docId, adminToRemove);
            const removeAdmin = async () => {
              try {
                firebase
                  .firestore()
                  .collection("Communities")
                  .doc(docId)
                  .update({
                    admins: firebase.firestore.FieldValue.arrayRemove(
                      adminToRemove
                    ),
                  });
              } catch (error) {
                console.error("Error removing admin", error);
              }
            };
            removeAdmin();
          },
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View>
      {isAdmin ? (
        <Pressable
          onPress={handleAdminProfile}
          onLongPress={handleRemoveAdmin}
        >
          <View style={styles.peopleGrid}>
            <View style={styles.profileImageBox}>
              <Image source={{ uri: item.logo }} style={styles.profilepic} />
              <Text style={styles.profileName}>{item.name}</Text>
            </View>
          </View>
        </Pressable>
      ) : (
        <Pressable onPress={() => navigation.navigate("ProfileInfo", { item })}>
          <View style={styles.peopleGrid}>
            <View style={styles.profileImageBox}>
              <Image source={{ uri: item.logo }} style={styles.profilepic} />
              <Text style={styles.profileName}>{item.name}</Text>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
};
const AdminListSection = ({
  title,
  navigation,
  item,
  isAdmin,
  docId,
}: UserListProps) => {
  const [user, setUserData] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminUser = await firebase
          .firestore()
          .collection("Users")
          .where("uid", "in", item.admins)
          .get();

        const fetchedUser = adminUser.docs.map((doc) => doc.data());
        setUserData(fetchedUser);
      } catch (error) {
        console.error("Error fetching communities data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const limit = 5;
  const limitedAdminData = user.slice(0, limit);

  const member = 1; //admin
  const handleSeeAllPress = () => {
    navigation.navigate("MemberSeeAll", { item, member });
    console.log("transfer see all ", item);
  };

  return (
    <View>
      <View style={styles.listHeader}>
        <PrimaryText>{title}</PrimaryText>
        <Pressable onPress={handleSeeAllPress}>
          <ButtonText>See all</ButtonText>
        </Pressable>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={limitedAdminData} // data from firebase
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          renderAdminItems({ title, navigation, item, isAdmin, docId })
        }
        contentContainerStyle={{ paddingTop: 5, paddingRight: 25 }}
        ListEmptyComponent={() => (
          <Text
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: 20,
              marginLeft: 20,
            }}
          >
            No data available
          </Text>
        )}
      />
    </View>
  );
};

const renderVolunteerItems = ({
  title,
  item,
  navigation,
  isAdmin,
}: {
  title: any;
  item: UserType;
  navigation: any;
  isAdmin: any;
}) => (
  <Pressable onPress={() => navigation.navigate("ProfileInfo", { item })}>
    <View style={styles.peopleGrid}>
      <View style={styles.profileImageBox}>
        <Image source={{ uri: item.logo }} style={styles.profilepic} />
        <Text style={styles.profileName}>{item.name}</Text>
      </View>
    </View>
  </Pressable>
);

const VolunteerListSection = ({
  title,
  navigation,
  item,
  isAdmin,
}: UserListProps) => {
  const [userData, setUserData] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);

  useEffect(() => {
    const fetchVolunteerData = async () => {
      try {
        const volunteerUser = await firebase
          .firestore()
          .collection("Users")
          .where("uid", "in", item.volunteers)
          .get();

        const fetchedUser = volunteerUser.docs.map((doc) => doc.data());
        setUserData(fetchedUser);
        console.log("name ", fetchedUser);
      } catch (error) {
        console.error("Error fetching communities data:", error);
      }
    };

    fetchVolunteerData();
  }, []);

  const limit = 5;
  const limitedVolunteerData = userData.slice(0, limit);
  const member = 0; //volunteer

  const handleSeeAllPress = () => {
    navigation.navigate("MemberSeeAll", { item, member });
    console.log("transfer see all ", item);
  };

  return (
    <View>
      <View style={styles.listHeader}>
        <PrimaryText>{title}</PrimaryText>
        <Pressable onPress={handleSeeAllPress}>
          <ButtonText>See all</ButtonText>
        </Pressable>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={limitedVolunteerData} // data from firebase
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          renderVolunteerItems({ title, item, navigation, isAdmin })
        }
        contentContainerStyle={{ paddingTop: 5, paddingRight: 25 }}
        ListEmptyComponent={() => (
          <Text
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: 20,
              marginLeft: 20,
            }}
          >
            No data available
          </Text>
        )}
      />
    </View>
  );
};
type ListSectionProps = {
  title: string;
  navigation: NavigationProp<RootStackParamList>;
  item: any;
};

const renderActivityItems = ({
  item,
  navigation,
}: {
  item: ActivityProps;
  navigation: any;
}) => (
  <Pressable onPress={() => navigation.navigate("ActivityInfo", { item })}>
    <View style={styles.gridItem}>
      <View style={styles.imageBox}>
        <Image source={{ uri: item.logo }} style={styles.image} />
      </View>
      <View style={styles.text}>
        <Text style={styles.description}>{item.name}</Text>
        <Text style={styles.subDescription}>{item.description}</Text>
        <View style={styles.pointContainer}></View>
      </View>
    </View>
  </Pressable>
);

const ActivityListSection = ({
  title,
  navigation,
  item,
  isPast,
}: ListSectionProps & { isPast: boolean }) => {
  const [activitiesData, setActivitiesData] = useState<ActivityProps[]>([]);
  const [communityData, setCommunityData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivitiesData = async () => {
      try {
        const communityId = item.id; // Ensure `item.id` is correctly passed
        console.log("Fetching activities for communityId:", communityId);

        const activitiesRef = firebase.firestore().collection("Activities");

        // Filter activities by communityId
        let query = activitiesRef.where("communityId", "==", communityId);

        // Further filter by date (past or ongoing)
        const nowISO = new Date().toISOString();

        // Further filter by date (past or ongoing)
        if (isPast) {
          query = query.where("endDate", "<=", nowISO);
        } else {
          query = query.where("endDate", ">=", nowISO);
        }

        const querySnapshot = await query.get();
        const fetchedActivitiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Ensure `id` is included
          ...doc.data(),
        })) as ActivityProps[];

        console.log("Fetched activities:", fetchedActivitiesData);
        setActivitiesData(fetchedActivitiesData);
      } catch (error) {
        console.error(
          "Error fetching activities data for communityId:",
          item.id,
          error
        );
      }
    };

    fetchActivitiesData();
  }, [isPast, item.id]);

  const limit = 5;
  const limitedActivitiesData = activitiesData.slice(0, limit);

  const handleSeeAllPress = () => {
    navigation.navigate("ActivitySeeAll", { activities: activitiesData, item: item });
  };

  return (
    <View>
      <View style={styles.listHeader}>
        <PrimaryText>{title}</PrimaryText>
        <Pressable onPress={handleSeeAllPress}>
          <ButtonText>See all</ButtonText>
        </Pressable>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={limitedActivitiesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderActivityItems({ item, navigation })}
        contentContainerStyle={{ paddingTop: 5, paddingRight: 25 }}
        ListEmptyComponent={() => (
          <Text
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: 20,
              marginLeft: 20,
            }}
          >
            No data available
          </Text>
        )}
      />
    </View>
  );
};



const OngoingListSection = ({ title, navigation, item }: ListSectionProps) => {
  return (
    <ActivityListSection
      title={title}
      navigation={navigation}
      item={item}
      isPast={false}
    />
  );
};

const PastListSection = ({ title, navigation, item }: ListSectionProps) => {
  return (
    <ActivityListSection
      title={title}
      navigation={navigation}
      item={item}
      isPast={true}
    />
  );
};

export default CommunityInfo;

const styles = StyleSheet.create({
  pictureContainer: {
    minHeight: 200,
    flexDirection: "row",
    flex: 4,
    backgroundColor: "light-grey",
  },
  Header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  contentContainer: {
    borderColor: "#BDBDBD",
    borderRadius: 10,
    height: 200,
    borderWidth: 1,
    marginTop: 7,
    flex: 3,
  },
  subHeadertext: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 16,
    marginBottom: 4,
  },
  subHeader1text: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 16,
    marginBottom: 4,
  },
  descriptionText: {
    color: "#7f8199",
    fontSize: 15,
    marginLeft: 10,
    marginTop: 6,
  },
  editingText: {
    backgroundColor: "#FF8D1342",
    color: "#3D5A80",
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#954126",
    marginLeft: 10,
    marginTop: 6,
  },
  listContainer: {
    flex: 1,
    borderColor: "#BDBDBD",
    borderRadius: 10,
    height: 160,
    borderWidth: 1,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },

  viewButton: {
    marginTop: "auto",
    width: "30%",
    minHeight: 25,
    backgroundColor: "#E3EAE7",
  },
  viewButtonText: {
    fontSize: 15,
    color: "black",
  },
  sectionItem: {
    backgroundColor: "#ED8356",
    marginHorizontal: 10,
    width: 200,
    height: 100,
    padding: "5%",
    borderRadius: 10,
  },
  peopleGrid: {
    borderRadius: 20,
    borderColor: "#BDBDBD",
  },
  icon: {
    borderRadius: 50,
    width: 30,
    height: 30,
  },
  names: {
    fontSize: 16,
    textAlign: "justify",
    marginTop: 1,
  },
  people: {
    marginLeft: 6,
    marginTop: 3,
    marginBottom: 3,
  },
  details: {
    marginLeft: "10%",
    width: "95&",
  },
  gridItem: {
    marginLeft: 25,
    width: 200,
    height: 200,
    marginBottom: 10,
    backgroundColor: "#F1CFA3",
    borderRadius: 20,
    borderColor: "#BDBDBD",
  },
  imageBox: {
    alignSelf: "center",
    flexDirection: "row",
    flex: 1,
    height: "60%",
    borderRadius: 20,
    borderColor: "#BDBDBD",
  },
  profileImageBox: {
    marginLeft: 2.5,
    width: 115,
    alignItems: "center",
    height: 96,
  },
  image: {
    width: 200,
    height: 120,
    resizeMode: "stretch",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  profilepic: {
    marginTop: 2.3,
    width: 80,
    height: "77%",
    borderRadius: 100,
  },
  profileName: {
    fontWeight: "400",
    fontSize: 17,
  },
  text: {
    backgroundColor: "#FFFFFF",
    height: "40%",
  },
  description: {
    fontSize: 16,
    textAlign: "left",
    marginTop: 1,
    marginLeft: 10,
    fontWeight: "bold",
  },
  subDescription: {
    fontSize: 13,
    textAlign: "left",
    marginLeft: 10,
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
  pointContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  joinButton: {
    flex: 1,
    marginHorizontal: 25,
    marginVertical: 15,
  },
  listFooter: {
    padding: 10,
  },
});
