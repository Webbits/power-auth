import React from "react"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import {
  ConfigureICloudScreen,
  ConfigureWebDavScreen,
  SelectBackendStorageScreen,
} from "app/screens"
import { SetupBackendScreen } from "app/screens/SetupBackendScreen"

export type BackendConfigStackParamList = {
  SelectBackendStorage: undefined
  SetupBackendScreen: undefined
  ConfigureWebDav: undefined
  ConfigureGoogleDrive: undefined
  ConfigureICloud: undefined
  ConfigureSFtp: undefined
}

export type BackendConfigStackScreenProps<T extends keyof BackendConfigStackParamList> =
  NativeStackScreenProps<BackendConfigStackParamList, T>

const Stack = createNativeStackNavigator<BackendConfigStackParamList>()
export const BackendConfigNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
      }}
      initialRouteName={"SelectBackendStorage"}
    >
      <Stack.Screen
        name="SelectBackendStorage"
        options={{ title: "Configure sync" }}
        component={SelectBackendStorageScreen}
      />
      <Stack.Screen
        name="SetupBackendScreen"
        options={{ title: "Setup backend" }}
        component={SetupBackendScreen}
      />
      <Stack.Screen
        name={"ConfigureWebDav"}
        options={{ title: "WebDav" }}
        component={ConfigureWebDavScreen}
      />
      <Stack.Screen
        name={"ConfigureICloud"}
        options={{ title: "iCloud Drive" }}
        component={ConfigureICloudScreen}
      />
    </Stack.Navigator>
  )
}
