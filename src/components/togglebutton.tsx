import React,{ useState} from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';

const ToggleButton = () => {
    const [istoggle, setToggle] = useState(false);

    const handleToggle =() => {
        setToggle(!istoggle);

    };

    return (
        <View style={styles.container}>
      <Button title={istoggle ? "ON" : "OFF"} onPress={handleToggle} />
      <Text style={styles.statusText}>{istoggle ? "The button is ON" : "The button is OFF"}</Text>
    </View>
  );
}; 

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: 20,
    },
    statusText: {
      marginTop: 10,
      fontSize: 16,
    },
  });

export default ToggleButton;
