import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View, Text, Button, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useAppSelector, useAppDispatch } from "../hooks";
import { updateIsFeedbackFilled } from "../features/userSlice";

const GoogleFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch(); // 正确使用 Redux Dispatch
  const [isSubmitted, setIsSubmitted] = useState(false);

  const googleFormUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSf70f21_buRqzmVTulRffOclNObJHm-qBdidi-FKnqtWqbNQg/viewform";
  const successUrlFragment = "/formResponse"; // 监听 Google Form 提交成功后的 URL

  const email = useAppSelector((state) => state.user.data?.emailAddress) as
    | string
    | undefined;

  return (
    <View style={styles.container}>
      {!isSubmitted ? (
        <WebView
          source={{ uri: googleFormUrl }}
          style={styles.webview}
          onNavigationStateChange={async (navState) => {
            if (navState.url.includes(successUrlFragment)) {
              console.log("✅ Google Form submitted successfully!");
              setIsSubmitted(true);
              Alert.alert("Success", "Thank you for submitting the form!", [
                {
                  text: "OK",
                  onPress: async () => {
                    if (email) {
                      console.log("🚀 Dispatching updateIsFeedbackFilled...");
                      try {
                        await dispatch(
                          updateIsFeedbackFilled({
                            emailAddress: email,
                            status: true,
                          })
                        );
                        console.log("✅ Feedback status updated!");
                      } catch (error) {
                        console.error(
                          "❌ Failed to update feedback status:",
                          error
                        );
                      }
                    }
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
