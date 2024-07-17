import { StyleSheet, Image, View, Text, TouchableOpacity } from "react-native";
import React , { useState } from 'react';
import PrimaryText from "../components/text_components/PrimaryText";
import ContentContainer from "../components/ContentContainer";
import { useAppSelector } from "../hooks";
import RightDrop from "../components/RightDrop";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";
import SearchBar from "../components/SearchBar";


const NewProfile = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "NewProfile">) => {
  const name = useAppSelector((state) => state.user.data?.name);
  const email = useAppSelector((state) => state.user.data?.emailAddress);
  const phone = useAppSelector((state) => state.user.data?.phoneNumber);
  const ic = useAppSelector((state) => state.user.data?.identityCardNumber);

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [dataToShow, setDataToShow] = useState<string[]>([]);
  const handleSearch = (keyword: string) => {
    // 执行搜索逻辑，比如发起 API 请求等
    console.log('Searching for:', keyword);
    setSearchKeyword(keyword);
    switch (keyword.toLowerCase()) {
      case 'apple':
        setDataToShow(['red', 'medium']);
        break;
      case 'banana':
        setDataToShow(['yellow', 'medium']);
        break;
      case 'orange':
        setDataToShow(['orange', 'small']);
        break;
      default:
        setDataToShow([]);
        break;}
  };

  return (
    <ContentContainer style={{ flex: 1 }}>
      <View style={styles.editcontainer}>
      <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
      <Text style={{ color: '#FF8D13' }}>Edit</Text>
    </TouchableOpacity>
      </View>


      <View style={styles.centercontainer}>
      <Image source={require("../assets/profile-picture.png")} style={styles.image} />
      </View>
      <View style={styles.alternativesContainer}>
      <View style={styles.pointContainer}>
        <Text style={styles.boldtext}>Name:</Text>
        </View>
        <View style={styles.validityContainer}>
        <Text style={{ fontSize: 14}}>{name}</Text>
        </View>
        </View>
        <View style={styles.alternativesContainer}>
      <View style={styles.pointContainer}>
        <Text style={styles.boldtext}>IC:</Text>
        </View>
        <View style={styles.validityContainer}>
        <Text style={{ fontSize: 14}}>{ic}</Text>
        </View>
        </View>
        <View style={styles.alternativesContainer}>
      <View style={styles.pointContainer}>
        <Text style={styles.boldtext}>Phone No:</Text>
        </View>
        <View style={styles.validityContainer}>
        <Text style={{ fontSize: 14}}>{phone}</Text>
        </View>
        </View>
        <View style={styles.alternativesContainer}>
      <View style={styles.pointContainer}>
        <Text style={styles.boldtext}>Email:</Text>
        </View>
        <View style={styles.validityContainer}>
        <Text style={{ fontSize: 14}}>{email}</Text>
        </View>
        </View>
        <Text></Text>
        <Text></Text>
        <Text></Text>
      <View style={styles.alternativesContainer}>
      <View style={styles.pointContainer}>
      <Text>Change Password
      
      </Text>
      </View>

      <View style={styles.nextcontainer}>
      <TouchableOpacity onPress={() => navigation.navigate("ChangeYourPassword")}>
      <Image source={require("../assets/next_icon_orange.png")} />
      </TouchableOpacity>

      </View>
      </View>



    </ContentContainer>
  );
};

type FieldProps = {
  label: string;
  children: string | undefined;
};

const Field = ({ label, children }: FieldProps) => {
  return (
    <View>
      <Text>{label}</Text>
      <PrimaryText>{children || ""}</PrimaryText>
    </View>
  );
};

export default NewProfile;

const styles = StyleSheet.create({
  boldtext:{fontWeight: "bold",fontSize: 16},
  fieldContainer: {},
  centercontainer: {
    
    marginBottom:10,
    marginLeft:20,
  
    alignItems: 'center', // 图像在垂直方向上右对齐
  },
  pointContainer: {
    justifyContent: "space-evenly",
    width: "35%",
    marginBottom:10,
  },
  validityContainer: {
    justifyContent: "space-evenly",
    width: "65%",
    marginBottom:10,
    marginLeft:20,
  },
  nextcontainer: {
    justifyContent: "space-evenly",
    width: "65%",
    marginBottom:10,
    marginLeft:20,
  
    alignItems: 'flex-end', // 图像在垂直方向上右对齐
  },
  editcontainer: {
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom:10,
    marginLeft:20,
  
    alignItems: 'flex-end', // 图像在垂直方向上右对齐
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: '#909090',
  },
  alternativesContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginTop: 10,
  },//container
  image: {
    width: 100, // 设置图片宽度
    height: 100, // 设置图片高度
  },
});
