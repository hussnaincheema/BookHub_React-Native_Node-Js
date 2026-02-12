import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

const RootLayout = () => {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
      <Toast />
    </>
  );
}

export default RootLayout;
