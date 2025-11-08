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
  RefreshControl,
  ScrollView,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import { RootState } from "../store";
import firestore from "@react-native-firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import ContentContainer from "../components/ContentContainer";
import ProfilePicture from "../components/ProfilePicture";
import ParagraphText from "../components/text_components/ParagraphText";
import HorizontalFlatList from "../components/HorizontalFlatList";
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
import { fetchUserData, selectEmail, selectUserName } from "../features/userSlice";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import ButtonText from "../components/text_components/ButtonText";
import HeaderText from "../components/text_components/HeaderText";
import TextButton from "../components/TextButton";
import { TextInput } from "react-native-paper";
import Navigation from "../Navigation";
import { Header } from "react-native/Libraries/NewAppScreen";
import { ActivityProps } from "../features/activitySlice";
import { fetchCommunitiesData, fetchRewardsData } from "../utils/firebaseUtils";
import { CommunityType, RewardType } from "../types";
import { set } from "react-hook-form";


const CommunityInfo = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "CommunityInfo">) => {
  const dispatch = useAppDispatch();

  //community data, id
  const item = route.params;  
  const docId = route.params.id;  
  const email = useAppSelector(selectEmail);
  const [CommunitiesData, setCommunitiesData] = useState<CommunityType[]>([]);

  const userId = useAppSelector((state) => state.user.data?.uid) || "";

  //user data
  const [isAdmin, setIsAdmin] = useState(false);
  const [editDescription, setEditDescription] = useState(
    route.params.description
  );
  const [editName, setEditName] = useState(route.params.name);
  const [image, setImage] = useState<string | null>(route.params.logo || null);
  const [refreshing, setRefreshing] = useState(false);

  const [editState,setEditState] = useState(false);
  const [joinedState,setJoinedState] = useState(false);

  const update = firebase.firestore().collection("Communities").doc(docId);

    // // fetch user & contribution data again from firebase into redux store
    // const refreshData = useCallback(async () => {
    //   if (!email) return;
    //   try {
    //     await Promise.all([
    //       dispatch(fetchUserData(email)),
    //       fetchCommunitiesData().then(setCommunitiesData),
    //       fetchRewardsData().then(setRewardsData),
    //     ]);
    //   } catch (error) {
    //     console.error("Error fetching user data:", error);
    //   }
    // }, [email, dispatch]);
  
    // const onRefresh = async () => {
    //   setRefreshing(true);
    //   await refreshData();
    //   setRefreshing(false);
    // };
  
    // useFocusEffect(
    //   useCallback(() => {
    //     refreshData();
    //   }, [refreshData])
    // );



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

  const handleEditPage = () => {
    setEditState(true);
  };

  const handleEditSave = () => {
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

    setEditState(false);
  };

  const handlePressJoin = () => {
    setJoinedState(true);

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
                {/* <Pressable  onPress={handleEditSave}>
                  <Text >Click here to Edit</Text>
                </Pressable> */}

          <TouchableOpacity onPress={pickImage} style={styles.pictureContainer}>
            <Image
              source={{
                ...(image ? { uri: image } : require("../assets/profile-picture.png")),
              }}
              style={styles.iconImage}
            />
          </TouchableOpacity>

          <ContentContainer>
            <View style={styles.HeaderContainer}>
              {isAdmin ? ( editState ? (
                  <TextInput
                    style={styles.editingText}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="Enter your text here... "
                    placeholderTextColor={"#3F51B5"}
                  />
                ):(
                  <Text style={{fontSize:30, fontWeight:"bold"}}>{route.params.name}</Text>
                )
              ) : (
                 <Text style={{fontSize:30, fontWeight:"bold"}}>{route.params.name}</Text>
              )}
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.listHeader}><PrimaryText>
                About Our Community
                </PrimaryText></View>
              <View style={{marginLeft: 17}}>
                {isAdmin ? ( editState ? (
                  <TextInput
                    style={styles.editingText}
                    value={editDescription}
                    onChangeText={setEditDescription}
                    placeholder="Enter your text here... "
                    placeholderTextColor={"#3F51B5"}
                  />):(
                    <Text style={{fontSize:16}}>{route.params.description}</Text>
                  )
                ) : (      
                  <Text style={{fontSize:16}}>{route.params.description}</Text>
                )}
              </View>              
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
           

           <View style={styles.listcontainerActivity}>
                   <ScrollView
                     scrollEventThrottle={16}
                     refreshControl={
                       <RefreshControl
                         refreshing={refreshing}
                        //  onRefresh={onRefresh}
                         colors={["#FF8D13"]} // 仅适用于 Android
                         tintColor="#FF8D13" // 仅适用于 iOS
                       />
                     }
                   >
                     {/* <HorizontalFlatList
                       title="Past Activities"
                       data={CommunitiesData}
                       navigation={navigation}
                       renderItem={({ item }) => (
                         <CommunityItem item={item} navigation={navigation} />
                       )}
                       seeAllPage="Communities"
                     />
                     <HorizontalFlatList
                       title="Ongoing Activities"
                       data={RewardsData}
                       navigation={navigation}
                       renderItem={({ item }) => (
                         <RewardItem item={item} navigation={navigation} />
                       )}
                       seeAllPage="Rewards"
                     /> */}

                    <View style={styles.listcontainerActivity}>
                      <HorizontalActivityList
                          title="Past Activities"
                          docId={docId}
                          isPast={true}
                          item={item}
                          navigation={navigation}
                          renderItem={({ item }) => renderActivityItems({ item, navigation })}
                          seeAllPage="ActivitySeeAll"
                        />
                    </View>

                    <View style={styles.listcontainerActivity}>
                      <HorizontalActivityList
                        title="Ongoing Activities"
                        docId={docId}
                        isPast={false}
                        item={item}
                        navigation={navigation}
                        renderItem={({ item }) => renderActivityItems({ item, navigation })}
                        seeAllPage="ActivitySeeAll"
                      />
                    </View>

                   </ScrollView>
                 </View>
           
           
            {/* <View style={styles.listHeader}></View>
            <View style={styles.listContainer}>
              <OngoingListSection
                title={"Ongoing Activities"}
                navigation={navigation}
                item={item}                
                docId={docId}
                isAdmin={isAdmin}
                // isPast={false}
              />
            </View>
            <View style={styles.listHeader}></View>
            <View style={styles.listContainer}>
              <PastListSection
                title={"Past Activities"}
                navigation={navigation}
                item={item}
                docId={docId}
                isAdmin={isAdmin}
                // isPast={false}
              />
            </View> */}
           
           
           
            <View style={styles.listFooter}></View>
          </ContentContainer>
        </ScrollView>
        <View
          style={{
            position: "absolute",
            left: "26%",
            bottom: "3%",
            width: "50%",
          }}
        >
          {isAdmin ? ( editState ? (
              <TextButton onPress={handleEditSave}> Save Changes </TextButton> 
            ):(
              <TextButton onPress={handleEditPage}> Edit Page </TextButton>
              )
          ) : (joinedState ? (
              <Text></Text>  
              // <Text style={{ color: "#3D5A80", textAlign: "center", backgroundColor: "#FF8D1342", padding: 10, borderRadius: 5 }}>
              //   Request sent
              // </Text>
            ):(
              <TextButton onPress={handlePressJoin}>
                  Join this community      
              </TextButton>
            )            
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

type ListProps = {
  title: string;
  navigation: NavigationProp<RootStackParamList>;
  item: any;
  docId: any;
};

type UserListProps = ListProps & {  
  isAdmin: boolean
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
  item: any; //UserType;
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
        <Pressable onPress={handleAdminProfile}>
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
              color: "#3f2e00ff",
              textAlign: "center",
              marginBottom: 20,
              marginLeft: 20,
              opacity:0.6
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
  docId
}: {
  title: any;
  item: any; //UserType;
  navigation: any;
  isAdmin: any;
  docId: any;
}) => {
  const handleVolunteerProfile = () => {
    navigation.navigate("ProfileInfo", { item });
  };

  console.log("item", item);
  console.log("docId", docId);

  const volunteerToRemove = item.uid; 
  const handleRemoveVolunteer = () => {
    Alert.alert(
      "Caution",
      `You are going to remove ${item.name} `,
      [
        {
          text: "Remove",
          onPress: () => {
            console.log("Yes Pressed,docId,item : ", docId, volunteerToRemove);
            const removeVolunteer = async () => {
              try {
                firebase
                  .firestore()
                  .collection("Communities")
                  .doc(docId)
                  .update({
                    volunteers: firebase.firestore.FieldValue.arrayRemove(
                      volunteerToRemove
                    ),
                  });
              } catch (error) {
                console.error("Error removing volunteer", error);
              }
            };
            removeVolunteer();
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
          onPress={handleVolunteerProfile}
          onLongPress={handleRemoveVolunteer}
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

const VolunteerListSection = ({
  title,
  navigation,
  item,
  isAdmin,
  docId,
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
          renderVolunteerItems({ title, item, navigation, isAdmin, docId })
        }
        contentContainerStyle={{ paddingTop: 5, paddingRight: 25 }}
        ListEmptyComponent={() => (
          <Text
            style={{
              color: "#3f2e00ff",
              textAlign: "center",
              marginBottom: 20,
              marginLeft: 20,
              opacity:0.6
            }}
          >
            No data available
          </Text>
        )}
      />
    </View>
  );
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
  docId,
  isPast,
}: ListProps & { isPast: boolean }) => {
  const [activitiesData, setActivitiesData] = useState<ActivityProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivitiesData = async () => {
      try {
        const communityId = docId;
        console.log("Fetching activities for communityId:", communityId);

        const now = firebase.firestore.Timestamp.now();

        let query = firebase
          .firestore()
          .collection("Activities")
          .where("communityId", "==", communityId);

        // Compare with Firestore Timestamp
        if (isPast) {
          query = query.where("endDate", "<=", now);
        } else {
          query = query.where("endDate", ">=", now);
        }

        const querySnapshot = await query.get();
        const fetchedActivitiesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ActivityProps[];

        console.log("Fetched activities:", fetchedActivitiesData);
        setActivitiesData(fetchedActivitiesData);
      } catch (error) {
        console.error(
          "Error fetching activities data for communityId:",
          docId,
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivitiesData();
  }, [isPast, docId]);

  const limit = 5;
  const limitedActivitiesData = activitiesData.slice(0, limit);

  const handleSeeAllPress = () => {
    navigation.navigate("ActivitySeeAll", {
      activities: activitiesData,
      item: item,
    });
    console.log("transfer see all ", activitiesData);
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
              color: "#3f2e00ff",
              textAlign: "center",
              marginBottom: 20,
              marginLeft: 20,
              opacity:0.6
            }}
          >
            No data available
          </Text>
        )}
      />
    </View>
  );
};

const OngoingListSection = ({
  title,
  navigation,
  item,
  docId,
  // isAdmin,
}: ListProps) => (
  <ActivityListSection
    title={title}
    navigation={navigation}
    item={item}
    docId={docId}
    isPast={false}
  />
);

const PastListSection = ({
  title,
  navigation,
  item,
  docId,
  // isAdmin,
}: ListProps) => (
  <ActivityListSection
    title={title}
    navigation={navigation}
    item={item}
    docId={docId}
    isPast={true}
  />
);


const HorizontalActivityList = ({
  title,
  docId,
  isPast,
  item,
  navigation,
  renderItem,
  seeAllPage,
}: {
  title: string;
  docId: string;
  isPast: boolean;
  item: any;
  navigation: any;
  renderItem: ({ item }: { item: ActivityProps }) => JSX.Element;
  seeAllPage: string;
}) => {
  const [activitiesData, setActivitiesData] = useState<ActivityProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivitiesData = async () => {
      try {
        const now = firebase.firestore.Timestamp.now();

        let query = firebase
          .firestore()
          .collection("Activities")
          .where("communityId", "==", docId);

        query = isPast
          ? query.where("endDate", "<=", now)
          : query.where("endDate", ">=", now);

        const querySnapshot = await query.get();

        const fetched = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ActivityProps[];

        setActivitiesData(fetched);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivitiesData();
  }, [docId, isPast]);

  const limitedData = activitiesData.slice(0, 5);

  const handleSeeAll = () => {
    navigation.navigate(seeAllPage, {
      activities: activitiesData,
      item,
    });
  };

  return (
    <View>
      <View style={styles.listHeader}>
        <PrimaryText>{title}</PrimaryText>
        <Pressable onPress={handleSeeAll}>
          <ButtonText>See all</ButtonText>
        </Pressable>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={limitedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{  paddingRight: 10, borderColor: "#BDBDBD", borderRadius: 10, borderWidth: 1 }} //paddingTop: 5,
        ListEmptyComponent={() => (
          <Text style={{ color: "#604300ff", textAlign: "center", marginLeft: 20, opacity:0.6 }}>
            No data available
          </Text>
        )}
      />
    </View>
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
  HeaderContainer: {
    height  : 54,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 1,
    // backgroundColor: "#F1CFA3",

  },
  contentContainer: {
    borderColor: "#BDBDBD",
    borderRadius: 10,
    // height: 200,
    borderWidth: 1,
    marginTop: 7,
    paddingBottom: 16,
    // flex: 3,
  },
  subHeadertext: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 17,
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
  listcontainerActivity: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 8,
    marginBottom: 15,
    height: "530%",
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
    // marginLeft: 25,
    // width: 200,
    // height: 200,
    // marginBottom: 10,
    // backgroundColor: "#F1CFA3",
    // borderRadius: 20,
    // borderColor: "#000000ff",
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
