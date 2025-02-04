import { Platform, StyleSheet, Text, View, Image,ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import ContentContainer from "../components/ContentContainer";
import PrimaryText from "../components/text_components/PrimaryText";
import ValidatedTextInput from "../components/ValidatedTextInput";
import TextButton from "../components/TextButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ActivityProps, createActivity } from "../features/activitySlice";

import { Calendar } from "react-native-calendars";

import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";

import { RouteProp, useRoute } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerResult } from "expo-image-picker";
//import Timestamp from "firebase/firestore";
import storage from "@react-native-firebase/storage";
import firestore, { firebase } from "@react-native-firebase/firestore";
import { NavigationProp } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DateTime } from "luxon";

type CreateActivityRouteProp = RouteProp<
  RootStackParamList,
  "CreateActivity"
>;

const CreateActivity = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "CreateActivity">) => {
  const {item} = route.params;
    console.log("item:",item);
  // const route = useRoute<CreateActivityRouteProp>();
  // const { item } = route.params ?? {item:[]}
  // const communityId = item;

  // type ActivityProps = {
  //   id: string;
  //   logo?: string;
  //   name: string;
  //   description: string;
  //   createdBy?: string;
  //   communityId: string; 
  //   endDate?: string | null; // User-chosen end date (ISO string)
  //   postedDate: string; // Automatically set at creation (ISO string)
  // };

  const { control, handleSubmit } = useForm<ActivityProps>();
  const dispatch = useAppDispatch();
  const ownUserId = useAppSelector((state) => state.user.data?.uid);

  const [image, setImage] = useState<string | null>(null);
  const [communityId,setCommunityId] = useState< string |null>(item)
  const [availableAdmins, setAvailableAdmins] = useState<any[]>([]);
  //const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false); // Controls picker visibility
  //fix
    const [filterText, setFilterText] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [isCalendarVisible, setCalendarVisible] = useState(false);
  const AppLogo = () => {
    return <Icon name="volunteer-activism" size={50} color="#FF8D13"/>;
  };
  //setCommunityId(item);
  //console.log("community id:", communityId);
  // const now = new Date();
  // const timestamp = Timestamp.fromDate(now);
  //const endDate = new Date(); // Example: User-selected date
  //const timestamp = firestore.Timestamp.fromDate(endDate);
  //console.log(timestamp); // Logs the Firestore Timestamp
  const filterByDateRange = (dateStr: string) => {
    const pointDate = new Date(convertDate(dateStr));
    return (
      (!startDate || new Date(startDate) <= pointDate) &&
      (!endDate || new Date(endDate) >= pointDate)
    );
  };

  const handleDateSelection = (
    dateString: string,
    dateType: "startDate" | "endDate"
  ) => {
    if (dateType === "startDate") setStartDate(dateString);
    else setEndDate(dateString);
  };

  const resetDateRange = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const normalizeData = (data: any[]) => {
    const filteredData = data.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";
      return (
        title.includes(filterText.toLowerCase()) ||
        description.includes(filterText.toLowerCase())
      );
    });

    // Parse and sort by date and time
    const sortedData = filteredData.sort((a, b) => {
      const dateA = safeParseDateTime(a.date, a.time);
      const dateB = safeParseDateTime(b.date, b.time);
      return dateB - dateA; // Sort in descending order (latest first)
    });

    return sortedData;
  };

  const safeParseDateTime = (dateStr: string, timeStr: string) => {
    const validDateStr = convertDate(dateStr); // 转换为 "YYYY-MM-DD"
    const validTimeStr = validateTime(timeStr); // 确保时间有效
    const dateTimeStr = `${validDateStr}T${validTimeStr}`; // 拼接成 ISO 格式字符串

    const parsedDate = Date.parse(dateTimeStr);
    return isNaN(parsedDate) ? Date.parse("1970-01-01T00:00:00") : parsedDate; // 解析失败则返回默认时间
  };

  const convertDate = (dateStr) => {
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    if (!dateStr) return "1970-01-01"; // 如果日期无效，返回默认日期

    const [dayOfWeek, day, monthStr, year] = dateStr.split(" ");
    const month = months[monthStr];

    if (!day || !month || !year) return "1970-01-01"; // 确保日期解析有效

    return `${year}-${month}-${day.padStart(2, "0")}`; // 返回标准格式日期
  };
  
  // 新增的时间验证函数
  const validateTime = (timeStr) => {
    const validTime = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?\s?(AM|PM)?$/i;

    if (validTime.test(timeStr)) {
      if (timeStr.includes("AM") || timeStr.includes("PM")) {
        // 如果时间包含 AM/PM，我们需要转换为 24 小时制
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":");
        if (modifier.toUpperCase() === "PM" && hours !== "12") {
          hours = String(Number(hours) + 12);
        }
        if (modifier.toUpperCase() === "AM" && hours === "12") {
          hours = "00";
        }
        return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
      }
      return timeStr;
    }

    return "00:00:00"; // 无效时间返回午夜
  };

  //display normalize
  //const displayedData = normalizeData(newActivity || [])

  const generalLogo = "https://firebasestorage.googleapis.com/v0/b/time-wave-88653.appspot.com/o/activitylogo.png?alt=media&token=16563524-d8c6-4b62-8521-40b938684856";
  const handleCreateActivity = async (data: ActivityProps) => {
    if (!ownUserId) {
      console.error("Current user ID is required.");
      return;
    }    
      // Upload image if available
      if (image) {
        try {
          const uploadedImageUrl = await uploadImage(image);
          console.log("uploaded image url", uploadedImageUrl);
          data = { ...data, logo: uploadedImageUrl };
        } catch (error) {
          console.error("Error uploading image:", error);
          data = { ...data, logo: generalLogo };
          }
      }else {
        data = { ...data, logo: generalLogo };
      }
     
      // if(!data.name || !data.description){
      //   console.error("Title and description are required");
      //   return;
      // }
      
      //fix handle time
      // const formattedEndDate = endDate
      // ? firestore.Timestamp.fromDate(endDate)
      // : null;

      // Ensure `endDate` is properly formatted
      //const formattedEndDate = endDate ? endDate.toISOString() : null;
      //const formattedEndDate = endDate ? Timestamp.fromDate(endDate) : null;
      // Automatically set `postedDate`
      
      const activityRef = firestore().collection("Activities").doc();
      console.log("activity.ref: ", activityRef);
      //data = { ...data};

      console.log("item.id inside sending",item);
      const malaysiaTime = firebase.firestore.Timestamp.now();
      //handle time
      const newActivity = {
        ...data,
        communityId:communityId, // From navigation params
        createdBy: ownUserId,
        id: activityRef.id,
        postedDate: malaysiaTime,
        //firestore.Timestamp.now(), // Current time
        endDate: endDate, // Optional user-chosen date
      };
      console.log("Activity to be saved:", newActivity);
      // Save activity to Firestore
      await activityRef.set(newActivity);
      console.log("Activity created successfully!");

      //navigation.goBack(); // Navigate back
      
      navigation.replace("ActivityInfo", { ...data, id: activityRef.id });
   
  };
  
  
  const uploadImage = async (uri: string) => {
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const reference = storage().ref(`activityLogo/${filename}`);
    const task = reference.putFile(uri);
  
    try {
      await task;
      const url = await reference.getDownloadURL();
      return url;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
      return generalLogo;
    }
  };

  // const handleDateChange = (event: any, selectedDate?: Date) => {
  //   if (selectedDate) {
  //     setEndDate(selectedDate);
  //   }
  // };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }

    })();
  }, [ownUserId]);
  
  const pickImage = async () => {
    let result: ImagePickerResult  = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri);
    }
  };
  
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <ContentContainer style={{ paddingTop: 10 }}>
        <View style={styles.logoContainer}>
          {image && (
            <Image source={{ uri: image }} style={{ width: 300, height: 200 }} />
          )}
          <Text style={{ color: "#BCB9B9", fontSize: 18 }} onPress={pickImage}>
            {image ? "" : " + Add a cover photo"}
          </Text>
        </View>
  
        <View style={{ paddingTop: 10 }}>
          <PrimaryText>Activity Name</PrimaryText>
          <ValidatedTextInput
            name={"name"}
            control={control}
            placeholder="Name"
            rules={{ required: "Activity name is required." }}
          />
        </View>

        <View style={{ paddingTop: 10 }}>
          <PrimaryText>Activity Location</PrimaryText>
          <ValidatedTextInput
            name={"location"}
            control={control}
            placeholder="Location"
            rules={{ required: "Activity location is required." }}
          />
        </View>
  
        <View style={{ flex: 1, paddingTop: 10}}>
          <PrimaryText>Activity Description</PrimaryText>
          <ValidatedTextInput
            name={"description"}
            control={control}
            style={styles.textArea}
            placeholder="Description"
            rules={{ required: "Activity description is required." }}
            maxLength={300}
            multiline={true}
          />
        </View>
        <View style={{ flex: 1, paddingTop: 5, paddingBottom: 10 }}>
          <PrimaryText>Activity Terms And Conditions</PrimaryText>
          <ValidatedTextInput
            name={"tac"}
            control={control}
            style={styles.textArea}
            placeholder="Terms And Conditions"
            rules={{ required: "Activity terms&conditions are required." }}
            maxLength={300}
            multiline={true}
          />
        </View>
        {/* <View style={{ paddingTop: 10 }}>
          <PrimaryText>Activity End Date</PrimaryText>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{ padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5 }}
          >
            <Text>{endDate ? endDate.toDateString() : "Select a date"}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View> */}

         {/* Calendar for Date Range Selection */}
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setCalendarVisible(!isCalendarVisible)}
              >
                <Text style={styles.toggleButtonText}>
                  {isCalendarVisible ? "Hide Calendar" : "Select Date"}
                </Text>
              </TouchableOpacity>
        
              {isCalendarVisible && (
                <ScrollView style={styles.calendarContainer}>
                  {/* <Text style={styles.dateText}>
                    Activity Date: {startDate || "Not Selected"}
                  </Text>
                  <Calendar
                    onDayPress={(day) => handleDateSelection(day.dateString, "startDate")}
                    markedDates={{
                      [startDate]: {
                        selected: true,
                        marked: true,
                        selectedColor: "#FF8D13",
                      },
                    }}
                  /> */}
                  <Text style={styles.dateText}>
                    End Date: {endDate || "Not Selected"}
                  </Text>
                  <Calendar
                    onDayPress={(day) => handleDateSelection(day.dateString, "endDate")}
                    markedDates={{
                      [endDate]: {
                        selected: true,
                        marked: true,
                        selectedColor: "#FF8D13",
                      },
                    }}
                  />
                  <TouchableOpacity style={styles.resetButton} onPress={resetDateRange}>
                    <Text style={styles.resetButtonText}>Reset Date Range</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
        <TextButton onPress={handleSubmit(handleCreateActivity)}>
          Create
        </TextButton>
        
      </ContentContainer>
    </KeyboardAwareScrollView>
  );
};
export default CreateActivity;

const styles = StyleSheet.create({
  textArea: {
    minHeight: 120,
    textAlignVertical: "top",
    paddingVertical: 10,
    flex: 1,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF8F8",
    flex: 1,
    borderColor: "#E3E0E0",
    borderWidth: 1,
    borderRadius: 10,
  },
  toggleButton: {
    // backgroundColor: "#FF8D13", // Button background color
    // paddingVertical: 12,
    paddingHorizontal: 20,
    // borderRadius: 8, // Rounded corners
    alignItems:"flex-start",
    marginVertical: 10,
    // alignSelf: "center", // Center the button
  },
  toggleButtonText: {
    color: "#FF8D13", // Button text color
    fontSize: 16,
    fontWeight: "bold",
  },
  calendarContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#FF8D13",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
  },
});
