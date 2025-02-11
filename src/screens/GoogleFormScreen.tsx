import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View, Text, Button, Alert } from "react-native";
import { WebView } from "react-native-webview";

const GoogleFormScreen: React.FC = () => {
  const navigation = useNavigation();

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Google Form URL
  // const googleFormUrl = "https://www.google.com";
  const googleFormUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSf70f21_buRqzmVTulRffOclNObJHm-qBdidi-FKnqtWqbNQg/viewform";

  // 目标跳转链接（在用户提交表单后跳转的页面）
  const successUrlFragment = "/formResponse";

  return (
    <View style={styles.container}>
      {!isSubmitted ? (
        <WebView
          source={{ uri: googleFormUrl }}
          style={styles.webview}
          onNavigationStateChange={(navState) => {
            // 检测是否为表单提交后的 URL
            if (navState.url.includes(successUrlFragment)) {
              console.log("test success");
              setIsSubmitted(true);
              Alert.alert("Success", "Thank you for submitting the form!", [
                {
                  text: "OK",
                  // onPress: () => navigation.goBack(), // 返回上一页面（Reward Page）
                  onPress: () => {
                    navigation.navigate("Reward", { formSubmitted: true });
                  },
                },
              ]);
            }
          }}
        />
      ) : (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>表单已提交！您可以继续下一步。</Text>
          <Button
            title="下一步"
            onPress={() => console.log("进入下一步逻辑")}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default GoogleFormScreen;
