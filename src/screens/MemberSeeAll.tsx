import { 
  StyleSheet, 
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  ScrollView,
  Alert,
  TextInput
} from "react-native";
import { Button, Checkbox } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ContentContainer from "../components/ContentContainer";
import { RootStackParamList } from "../Screen.types";
import firebase from "@react-native-firebase/firestore";
import firestore from "@react-native-firebase/firestore";
import { useAppSelector } from "../hooks";
import TextButton from "../components/TextButton";

const MemberSeeAll = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "MemberSeeAll">) => {
  const { item, member } = route.params;
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [memberData, setMemberData] = useState<any[]>([]);
  const userId = useAppSelector((state) => state.user.data?.uid) || "";

  // Check for user role
  useEffect(() => {
    if (item.admins && item.admins.includes(userId)) {
      setIsAdmin(true);
    }
    fetchMemberData();
  }, [item, userId]);

  const fetchMemberData = async () => {
    const memberList = member ? item.admins : item.volunteer;
    if (memberList && memberList.length > 0) {
      useEffect(() => {
        const unsubscribe = firebase()
          .collection("Users")
          .where("uid", "in", item.volunteer || [])
          .onSnapshot(
            (snapshot) => {
              const fetchedData = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));
              setMemberData(fetchedData);
            },
            (error) => {
              console.error("Error fetching real-time member data:", error);
            }
          );

        return () => unsubscribe(); // Cleanup listener on unmount
      }, [item.volunteer]);

    } else {
      setMemberData([]); // Ensure empty state is handled
    }
  };

  const handleSelect = () => setSelectMode(!selectMode);

  const handleSelectMember = (uid: string) => {
    setSelectedMembers(prev =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  const handleRemoveMember = async () => {
    if (selectedMembers.length === 0) return;

    const memberType = member ? 'admins' : 'volunteer';
    const action = member ? 'Remove admin(s)' : 'Remove volunteer(s)';

    Alert.alert(
      'Caution',
      `Are you sure you want to ${action.toLowerCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              await firebase().collection("Communities").doc(item.id).update({
                [memberType]: firestore.FieldValue.arrayRemove(...selectedMembers)
              });
              fetchMemberData(); // Refresh the list
              setSelectedMembers([]);
              setSelectMode(false);
            } catch (error) {
              console.error(`Error ${action.toLowerCase()}:`, error);
            }
          }
        }
      ]
    );
  };


  const renderMemberItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => selectMode ? handleSelectMember(item.uid) : navigation.navigate("ProfileInfo", { item })}
      onLongPress={handleSelect}
      style={[styles.gridItem, selectMode && selectedMembers.includes(item.uid) && styles.selectedGrid]}
    >
      <Image source={{ uri: item.logo }} style={styles.image} />
      <View style={styles.text}>
        <Text style={styles.description}>{item.name}</Text>
        <Text style={styles.subDescription}>{item.description}</Text>
      </View>
      {selectMode && (
        <Checkbox
          status={selectedMembers.includes(item.uid) ? "checked" : "unchecked"}
          onPress={() => handleSelectMember(item.uid)}
        />
      )}
    </Pressable>
  );

  return (
    <ContentContainer>
      <View style={styles.header}>
        <Text style={styles.title}>{member ? "Admins" : "Volunteers"}</Text>
        {isAdmin && (
          <Pressable onPress={handleSelect}>
            <Text>{selectMode ? "Cancel" : "Select"}</Text>
          </Pressable>
        )}
      </View>
      <FlatList
        data={memberData}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.uid}
        ListEmptyComponent={() => <Text style={styles.emptyText}>No members available</Text>}
      />
      {isAdmin && selectMode && (
        <TextButton onPress={handleRemoveMember}>
          {member ? "Remove Admin(s)" : "Remove Volunteer(s)"}
        </TextButton>
      )}
    </ContentContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  gridItem: {
    flexDirection: "row",
    alignItems: 'center',
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  selectedGrid: {
    backgroundColor: "#FF7A00",
  },
  image: {
    height: 46,
    width: 46,
    borderRadius: 23,
  },
  text: {
    flex: 1,
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subDescription: {
    fontSize: 14,
    color: "#555555",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default MemberSeeAll;
