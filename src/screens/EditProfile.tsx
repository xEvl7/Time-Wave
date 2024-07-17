import { StyleSheet, Image, View, Text,TouchableOpacity,TextInput } from "react-native";
import React , { useState } from 'react';
import PrimaryText from "../components/text_components/PrimaryText";
import ContentContainer from "../components/ContentContainer";
import { useAppSelector } from "../hooks";
import RightDrop from "../components/RightDrop";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Screen.types";



const EditProfile = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "EditProfile">) => {
  const name = useAppSelector((state) => state.user.data?.name);
  const email = useAppSelector((state) => state.user.data?.emailAddress);
  const phone = useAppSelector((state) => state.user.data?.phoneNumber);
  const ic = useAppSelector((state) => state.user.data?.identityCardNumber);

  const [keyword, setKeyword] = useState<string>('');
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
      <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
      <Text style={{ color: '#FF8D13' }}>Save</Text>
    </TouchableOpacity>
      </View>

      <View style={styles.centercontainer}>
      <Image source={require("../assets/profile-picture.png")} style={styles.image} />
      </View>
      <View style={styles.alternativesContainer}>
      <View style={styles.pointContainer}>
        <Text style={styles.boldtext}>Full Name:</Text>
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
        <TextInput
        style={styles.input}
        placeholder={phone}
        value={keyword}
        onChangeText={setKeyword}
      />
        </View>
        </View>
        <View style={styles.alternativesContainer}>
      <View style={styles.pointContainer}>
        <Text style={styles.boldtext}>Email:</Text>
        </View>
        <View style={styles.validityContainer}>
        <TextInput
        style={styles.input}
        placeholder={email}
        value={keyword}
        onChangeText={setKeyword}
      />
        </View>
        </View>
        <Text></Text>
        <Text></Text>
        <Text></Text>
      <View style={styles.alternativesContainer}>
      <View style={styles.passContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter your current password to verify"
        value={keyword}
        onChangeText={setKeyword}
      />
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

export default EditProfile;

const styles = StyleSheet.create({
  fieldContainer: {},
  centercontainer: {
    
    marginBottom:10,
    marginLeft:20,
  
    alignItems: 'center', // 图像在垂直方向上右对齐
  },
  editcontainer: {
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom:10,
    marginLeft:20,
  
    alignItems: 'flex-end', // 图像在垂直方向上右对齐
  },
  pointContainer: {
    justifyContent: "space-evenly",
    width: "35%",
    marginBottom:10,
  },
  boldtext:{fontWeight: "bold",fontSize: 16},
  passContainer: {
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom:10,
    marginLeft:20,
    height: 40,

  },
  validityContainer: {
    justifyContent: "space-evenly",
    width: "65%",
    marginBottom:10,
    marginLeft:20,
  },
  nextcontainer: {
    justifyContent: "space-evenly",
    width: "15%",
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
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
