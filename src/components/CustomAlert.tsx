import React, { useCallback, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import RNModal from "react-native-modal";

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "cancel" | "default" | "destructive";
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  onClose: () => void;
  position?: "center" | "bottom"; // 新增
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: "OK", onPress: () => {} }],
  onClose,
  position = "bottom",
}) => {
  // Center 弹窗
  if (position === "center") {
    return (
      <RNModal
        isVisible={visible}
        onBackdropPress={onClose}
        onBackButtonPress={onClose}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.5}
        useNativeDriver
        style={{ justifyContent: "center", alignItems: "center", margin: 0 }}
      >
        <View style={styles.centerBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonRow}>
            {buttons.map((button, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.button,
                  button.style === "cancel" && styles.cancelButton,
                  button.style === "destructive" && styles.destructiveButton,
                ]}
                onPress={() => {
                  button.onPress?.();
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    button.style === "cancel" && styles.cancelButtonText,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </RNModal>
    );
  }

  // Bottom 弹窗
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%"], []);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backgroundStyle={styles.sheetBackground}
      handleComponent={() => null} // 隐藏顶部indicator
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      )}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonRow}>
          {buttons.map((button, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.button,
                button.style === "cancel" && styles.cancelButton,
                button.style === "destructive" && styles.destructiveButton,
              ]}
              onPress={() => {
                button.onPress?.();
                onClose();
              }}
            >
              <Text
                style={[
                  styles.buttonText,
                  button.style === "cancel" && styles.cancelButtonText,
                ]}
              >
                {button.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </BottomSheet>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  // Center modal styles
  centerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  centerBox: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  // Bottom sheet styles
  sheetBackground: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: "#fff",
  },
  // handleIndicator: {
  //   backgroundColor: "#E0E0E0",
  //   width: 60,
  // },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF8D13",
    marginBottom: 15,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#FF8D13",
    marginHorizontal: 6,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FFF3E0",
    borderColor: "#FF8D13",
  },
  destructiveButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#FF8D13",
  },
});

export default CustomAlert;
