import { 
  Pressable, 
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,  
  Text, 
  View, 
  Image ,
  ScrollView} from "react-native";
import auth from "@react-native-firebase/auth";
import React, { useState, useEffect } from "react";
import TextButton from "../components/TextButton";
import HeaderText from "../components/text_components/HeaderText";
import BackgroundImageBox from "../components/BackgroundImageBox";
import ContentContainer from "../components/ContentContainer";
import ValidatedTextInput from "../components/ValidatedTextInput";
import { useForm } from "react-hook-form";
import { fetchUserData } from "../features/userSlice";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { useAppDispatch, useAppSelector } from "../hooks";

// type FormData = {
//   emailAddress: string;
//   password: string;
// };
let expireDate ='19 AUG 2024';

export default function ActiveRewardsPage({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ActiveRewardsPage">) {
  
  const firebaseConfig = {
    apiKey: "AIzaSyD7u8fTERnA_Co1MnpVeJ6t8ZumV0T59-Y",
    authDomain: "time-wave-88653.firebaseapp.com",
    projectId: "time-wave-88653",
    storageBucket: "time-wave-88653.appspot.com",
    messagingSenderId: "666062417383",
    appId: "1:666062417383:web:8d8a8c4d4c0a3d55052142",
    measurementId: "G-L7TTXFZ6DM",
  };

  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);

  // // Initialize Cloud Firestore and get a reference to the service
  // const db = getFirestore(app);

  const handleData = async (data: FormData) => {
    // const querySnapshot = await getDocs(collection(db, "users"));
    // querySnapshot.forEach((doc) => {
    //   console.log(`${doc.id} => ${doc.data()}`);
    // });
  };

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"received" | "used">("received");
  
  const [receivedPointsData, setReceivedPointsData] = useState([
    {
      date: "Tue, 1 Aug 2023",
      time: "12:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 50,
    },
    {
      date: "Sat, 1 Jul 2023",
      time: "12:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 75,
    },
    {
      date: "Tue, 1 Aug 2023",
      time: "12:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 50,
    },
    {
      date: "Sat, 1 Jul 2023",
      time: "12:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 75,
    },
    {
      date: "Tue, 1 Aug 2023",
      time: "12:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 50,
    },
    {
      date: "Sat, 1 Jul 2023",
      time: "12:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 75,
    },
  ]);
  const [usedPointsData, setUsedPointsData] = useState([
    {
      date: "Sun, 6 Aug 2023",
      time: "11:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 30,
    },
    {
      date: "Tue, 27 Jun 2023",
      time: "08:00 PM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 55,
    },
    {
      date: "Sun, 6 Aug 2023",
      time: "11:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 30,
    },
    {
      date: "Tue, 27 Jun 2023",
      time: "08:00 PM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 55,
    },
    {
      date: "Sun, 6 Aug 2023",
      time: "11:00 AM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 30,
    },
    {
      date: "Tue, 27 Jun 2023",
      time: "08:00 PM",
      category: "Time Points Rewards",
      name: "TimeBank Rewards Points",
      points: 55,
    },
  ]);

  useEffect(() => {
    setTimeout(() => {
      if (activeTab === "received") {
        setReceivedPointsData;
      } else {
        setUsedPointsData;
      }
      setIsLoading(false);
    }, 500);
  }, [activeTab]);

  const handleTabChange = (tab: "received" | "used") => {
    setActiveTab(tab);
    setIsLoading(true);
  };
  
  return (
    <View>
     {/* <View style={{alignContent:'center'}}>      
        <View style={styles.TabStyle}> 
          <View>
            <Pressable onPress={() => navigation.navigate("ActiveRewardsPage")}>
              <Text style={styles.TabNavigateTextMajor}>Active Rewards           
              </Text>                     
            </Pressable>
            <View style={styles.TabPressMajor}></View>            
          </View>
          <View>
            <Pressable onPress={() => navigation.navigate("PastRewardsPage")}>
              <Text style={styles.TabNavigateTextMinor}>Past Rewards           
              </Text>            
            </Pressable>          
          </View>
        </View>
      </View> */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "received" && styles.activeTab,
          ]}
          onPress={() => handleTabChange("received")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "received" && styles.activeTabText,
            ]}
          >
            Active Rewards 
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "used" && styles.activeTab]}
          onPress={() => handleTabChange("used")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "used" && styles.activeTabText,
            ]}
          >
            Past Rewards
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#FF8D13"
          style={styles.loadingIndicator}
        />
      ) : (
        <View>
          {activeTab === "received" ? (
            // Render Points Received Fragment
            <View>
              {/* Content for Points Received */}
              <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                data={receivedPointsData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View>
                    <Pressable onPress={() => navigation.navigate("ActiveRewardsDetailsPage")}>
                      <View style={styles.gridItem}>
                        
                          <View style={styles.imageBox}>
                            <Image
                              source={require("../assets/laptop.png")}
                              style={styles.image}
                            />
                          </View>
                          <View style={styles.text}>                  
                            <Text style={styles.subDescription}>Official Mavcap</Text>
                            <Text style={styles.description}>Medical Checkup</Text>
                            <View style={styles.pointContainer}>
                              <Text style={styles.pointDesc}> Expires on {expireDate}</Text>
                            <Image
                                source={require("../assets/laptop.png")}
                                style={{marginLeft:'48%',marginTop:10}}
                              />
                            </View>  
                          </View>                  
                      </View>
                    </Pressable>                        
                  </View>
                )}
              />
            </View>
          ) : (
            // Render Points Used Fragment
            <View>
              {/* Content for Points Used */}
              <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}
                data={usedPointsData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View>
                    <Pressable onPress={() => navigation.navigate("PastRewardsDetailsPage")}>
                      <View style={styles.gridItem}>                        
                          <View style={styles.usedImageBox}>
                            <Image
                              source={require("../assets/laptop.png")}
                              style={styles.image}
                            />
                          </View>
                          <View style={styles.text}>                  
                            <Text style={styles.subDescription}>Official Mavcap</Text>
                            <Text style={styles.description}>Medical Checkup</Text>
                            <View style={styles.pointContainer}>
                              <Text style={styles.pointDesc}> Expires on {expireDate}</Text>
                              <Text style={styles.Used}>Used</Text>
                            </View>  
                          </View>                  
                      </View>
                    </Pressable>        
                  </View>
                )}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  alternativesContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  thirdPartyAuthContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  registerContainer: {
    flexDirection: "row",
    minWidth: "78%",
    justifyContent: "space-evenly",
    marginTop: 40,
  },
  MyRewardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  HeadingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  TabStyle:{
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  TabPressMajor:{
    backgroundColor:"#FF8D13",
    height:'5%',
    width:"100%",
    marginTop:8,
  },
  TabNavigateTextMajor:{
    fontWeight:'bold',
    fontSize:22,
    color:'#FF8D13',
  },
  TabNavigateTextMinor:{
    fontWeight:'bold',
    fontSize:22,
    color:'#BABABA',
  },
  gridItem: {
    //marginLeft:25,
    width: '100%', // 两个格子并排，留出一些间隙
    height: 170,
    marginBottom: 10,
    backgroundColor:"#FFFFFF",
    //borderRadius: 20, 
    flexDirection:"row",
    borderColor:'#BDBDBD',
    borderWidth: 1,
  },
  imageBox: {
    marginLeft: 10,
    alignSelf : "center" ,
    height:'68%',
    width:"35%",
    backgroundColor:'#F1CFA3',
    borderRadius:10,
  },
  usedImageBox: {
    marginLeft: 10,
    alignSelf : "center" ,
    height:'68%',
    width:"35%",
    backgroundColor:'#9E815B',
    borderRadius:10,
  },
  image: {
    alignSelf : "center" ,
    resizeMode: 'cover',
    marginTop:10,
  },
  text: {
    backgroundColor:"#FFFFFF",
    height:'60%',
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,    
  },
  description: {
    fontSize: 22,
    textAlign: 'left',
    marginTop: 1,
    marginLeft: 10,
    fontWeight:'bold',
  },
  subDescription: {
    fontSize: 13,
    textAlign: 'left',
    marginLeft: 10,
    marginTop:25,
  },
  pointDesc: {
    marginLeft:8,
    marginTop:20,
    fontSize: 15,
    textAlign: 'left',
  },
  pointContainer:{
    //flexDirection:'row',
    //marginTop:10,
  },
  Used:{
    textAlign:'center',
    marginTop:3,
    marginLeft:'61%',
    fontWeight:'900',
    fontSize:15,
    color:'grey',
    backgroundColor:'lightgrey',
    width:'20%',
    borderRadius:3,
    padding:5
  },
  container: {
    flex: 1,
    // padding: 8,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: "white",
    backgroundColor: "white",
  },
  activeTab: {
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
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer1: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  listContainer2: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  listDateText: {
    fontSize: 16,
    fontWeight: "300",
  },
  listTimeText: {
    fontSize: 14,
    fontWeight: "300",
    paddingBottom: 3,
  },
  listCategoryText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 3,
  },
  listNameText: {
    fontSize: 15,
    fontWeight: "400",
  },
  listPointsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8D13",
  },
});