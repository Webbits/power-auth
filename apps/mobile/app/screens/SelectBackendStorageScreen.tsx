import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { BackendConfigStackScreenProps, navigate } from "app/navigators"
import { ListItem, ListView, Screen } from "app/components"
import { colors, spacing } from "app/theme"

interface SelectBackendStorageScreenProps
  extends BackendConfigStackScreenProps<"SelectBackendStorage"> {}

const $selectorBox: ViewStyle = {
  margin: 20,
  backgroundColor: colors.palette.neutral100,
  overflow: "hidden",
  borderRadius: 10,
}

const $selectorItem: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xxs,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: colors.palette.neutral100,
}

type BackendStorageTypeItem = {
  title: string
  onPress?: () => void
}

const backendStorageTypes = [
  {
    title: "iCloud Drive",
    onPress: () => {
      navigate("ConfigureICloud")
    },
  },
  {
    title: "WebDav",
    onPress: () => {
      navigate("ConfigureWebDav")
    },
  },
  {
    title: "SFTP",
    onPress: () => {},
  },
  {
    title: "Google Drive",
    onPress: () => {},
  },
] as BackendStorageTypeItem[]

export const SelectBackendStorageScreen: FC<SelectBackendStorageScreenProps> = observer(
  function SelectBackendStorageScreen({ navigation }) {
    return (
      <Screen style={$root} preset="auto">
        <View style={$selectorBox}>
          <ListView<BackendStorageTypeItem>
            scrollEnabled={false}
            renderItem={({ item }) => (
              <ListItem
                height={35}
                style={$selectorItem}
                onPress={item.onPress}
                rightIcon={"caretRight"}
                text={item.title}
                containerStyle={{}}
                textStyle={{
                  padding: 0,
                  paddingBottom: 0,
                  paddingTop: 0,
                  marginTop: 0,
                  marginBottom: 0,
                }}
              ></ListItem>
            )}
            data={backendStorageTypes}
          />
        </View>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
