import { Button, Screen, Text } from "app/components"
import React, { useLayoutEffect } from "react"
import { AppStackParamList } from "app/navigators"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Item } from "react-navigation-header-buttons"
import { View } from "react-native"
import { colors } from "app/theme"

type ScreenProps = NativeStackScreenProps<AppStackParamList, "Settings">

function SetupBackendAlert(props: { onPress: () => void }) {
  return (
    <View style={{ padding: 26 }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        Set up synchronization
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.palette.neutral700,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Set up synchronization so you can access your data from other devices and prevent losing
        your 2FA tokens.
      </Text>
      <Button
        text={"Configure synchronization"}
        preset={"filled"}
        onPress={props.onPress}
        style={{ marginBottom: 10 }}
      />
      <Button text={"I will do this later"} preset={"default"} onPress={props.onPress} />
    </View>
  )
}

export const SettingsScreen = ({ navigation }: ScreenProps) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerRight: () => <Item title={"Close"} onPress={() => navigation.goBack()} />,
    })
  }, [navigation])

  return (
    <Screen preset="auto" style={{ paddingTop: 130 }}>
      <SetupBackendAlert
        onPress={() => {
          navigation.navigate("BackendConfig")
        }}
      />
    </Screen>
  )
}
