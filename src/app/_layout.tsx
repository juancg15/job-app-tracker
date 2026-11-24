import { Stack } from "expo-router";
import { ApplicationProvider } from "../context/ApplicationContext";

export default function RootLayout() {
  return (
    <ApplicationProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#172554",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: "#f1f5f9",
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "JobTrack" }} />

        <Stack.Screen
          name="application"
          options={{ title: "Job Application" }}
        />
      </Stack>
    </ApplicationProvider>
  );
}
