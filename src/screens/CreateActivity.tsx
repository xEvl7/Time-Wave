import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ContentContainer from "../components/ContentContainer";
import PrimaryText from "../components/text_components/PrimaryText";
import ValidatedTextInput from "../components/ValidatedTextInput";
import TextButton from "../components/TextButton";
import { set, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import { RouteProp } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import storage from "@react-native-firebase/storage";
import firestore, { firebase, FirebaseFirestoreTypes  } from "@react-native-firebase/firestore";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type CreateActivityRouteProp = RouteProp<RootStackParamList, "CreateActivity">;

const CreateActivity = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "CreateActivity">) => {
  const { item } = route.params;
  console.log("item: ",item);
  const { control, handleSubmit, formState: { errors } } = useForm<ActivityProps>();
  const ownUserId = useAppSelector((state) => state.user.data?.uid);
  const [commID,setcommID] = useState<string | null>(item.item.id);
  
  const [image, setImage] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<FirebaseFirestoreTypes.Timestamp | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const generalLogo = "https://firebasestorage.googleapis.com/v0/b/time-wave-88653.appspot.com/o/activitylogo.png?alt=media&token=16563524-d8c6-4b62-8521-40b938684856";

  const handleCreateActivity = async (data: ActivityProps) => {
    if (!ownUserId) {
      Alert.alert("Error", "User authentication required");
      return;
    }

    setcommID(item.item.id); 
    console.log("commID: ", commID);
    console.log("item: ", item); 
  
    try {
      // Sanitize data before sending to Firestore
      const sanitizedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
  
      let activityData = { 
        ...sanitizedData,
        logo        : generalLogo,
        communityId :  commID       || 'default-community-id', // Ensure required field
        createdBy   : ownUserId,
        postedDate  : firebase.firestore.Timestamp.now(),
        endDate     : endDate ? endDate : firebase.firestore.Timestamp.now(), //firebase.firestore.Timestamp.fromDate(new Date(endDate)) //endDate       || firebase.firestore.Timestamp.now(),//.toISOString() // Fallback date
        location    : sanitizedData.location || 'Unspecified location',
      };
  
      if (image) {
        try {
          const uploadedImageUrl = await uploadImage(image);
          activityData.logo = uploadedImageUrl;
        } catch (error) {
          console.error("Image upload failed, using default logo");
        }
      }
  
      const activityRef = firestore().collection("Activities").doc();
      
      // Final validation before write
      const finalData = {
        ...activityData,
        id: activityRef.id,
        // Convert undefined values to null for Firestore
        // tac: activityData.tac || null,
        location: activityData.location || 'Unspecified location'
      };
  
      

      type ActivityProps ={       
          item        :any;
          id          : string;
          logo?       : string;
          name        : string;
          description : string;
          // tac: string;
          location    : string;
          createdBy?  : string;
          communityId : string; 
          endDate?    : string | null; // User-chosen end date (ISO string)
          postedDate  : string; // Automatically set at creation (ISO string)
      };

     await activityRef.set(finalData);
      navigation.navigate("ActivityInfo", { item: finalData } as ActivityProps);
      Alert.alert("Success", "Activity created successfully!");
  
    } catch (error) {
      console.error("Activity creation error:", error);
      Alert.alert("Error", "Failed to create activity");
    }
  };
  

  const uploadImage = async (uri: string) => {
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const reference = storage().ref(`activityLogo/${filename}`);
    await reference.putFile(uri);
    return await reference.getDownloadURL();
  };

  const handleDateConfirm = (date: Date) => {
    setShowDatePicker(false);
    setEndDate(firebase.firestore.Timestamp.fromDate(date)); //.toISOString()
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image");
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission required", "Need camera roll access");
        }
      }
    })();
  }, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
    >
      <ContentContainer style={{ paddingTop: 10 }}>
        <View style={styles.logoContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
              <Icon name="add-a-photo" size={40} color="#FF8D13" />
              <Text style={styles.uploadText}>Add Cover Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputGroup}>
          <PrimaryText>Activity Name</PrimaryText>
          <ValidatedTextInput
            name="name"
            control={control}
            placeholder="Name"
            rules={{ required: "Required field" }}
          />
          {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <PrimaryText>Location</PrimaryText>
          <ValidatedTextInput
            name="location"
            control={control}
            placeholder="Location"
            rules={{ required: "Required field" }}
          />
          {errors.location && <Text style={styles.error}>{errors.location.message}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <PrimaryText>Description</PrimaryText>
          <ValidatedTextInput
            name="description"
            control={control}
            placeholder="Description"
            rules={{ required: "Required field" }}
            multiline
            style={styles.textArea}
          />
          {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <PrimaryText>End Date</PrimaryText>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Text style={styles.dateText}>
              {endDate ? endDate.toDate().toLocaleDateString() : "Select date"}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setShowDatePicker(false)}
        />

        <TextButton style={styles.submitButton} onPress={handleSubmit(handleCreateActivity)}>
          Create Activity
        </TextButton>
      </ContentContainer>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  uploadButton: {
    alignItems: 'center',
    gap: 10,
  },
  uploadText: {
    color: '#FF8D13',
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
  },
  dateText: {
    color: '#333',
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: '#FF8D13',
    paddingVertical: 15,
    borderRadius: 8,
  },
});

export default CreateActivity;
