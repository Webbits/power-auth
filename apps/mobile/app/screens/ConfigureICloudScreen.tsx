import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Platform, View, ViewStyle } from "react-native"
import { BackendConfigStackScreenProps } from "app/navigators"
import { Button, Screen, Text, TextField } from "app/components"
import { Section } from "app/components/Section"
import { InputSet } from "app/components/Input/InputSet"
import { spacing } from "app/theme"

interface ConfigureICloudScreenProps extends BackendConfigStackScreenProps<"ConfigureICloud"> {}

export const ConfigureICloudScreen: FC<ConfigureICloudScreenProps> = observer(
  function ConfigureICloudScreen() {
    const [path, setPath] = React.useState<string>("/PowerAuth")
    const [isSaving] = React.useState<boolean>(false)

    const fieldStatus = isSaving ? "disabled" : undefined

    const handleSave = () => {}

    return (
      <Screen style={$root} preset="auto">
        {Platform.OS !== "ios" && (
          <View style={{ backgroundColor: "red", padding: spacing.md }}>
            <Text>iCloud is not available on this device</Text>
          </View>
        )}

        <Section filled fullWidth>
          <InputSet label={"Path"}>
            <TextField
              status={fieldStatus}
              onChangeText={setPath}
              placeholder={"/PowerAuth"}
              value={path}
              autoCorrect={false}
              autoCapitalize={"none"}
              autoComplete={"off"}
            />
          </InputSet>
        </Section>
        <Section style={{ marginTop: spacing.lg }}>
          <Button disabled={isSaving} preset={"filled"} text={"Save"} onPress={handleSave} />
        </Section>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
