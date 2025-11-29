import { WebView } from "react-native-webview";
import { SafeAreaView, StyleSheet, Platform, StatusBar } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

// Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {

  // Ask Notification Permission (runs once)
  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Please enable notifications to receive job reminders!");
      }
    }
    requestPermissions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: "https://job-trackr-sand.vercel.app/" }}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
