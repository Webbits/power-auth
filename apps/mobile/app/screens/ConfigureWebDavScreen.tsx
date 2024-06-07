import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { BackendConfigStackScreenProps, navigate } from "app/navigators"
import { Button, Screen, TextField, Toggle } from "app/components"
import { ViewStyle } from "react-native"
import { Section } from "app/components/Section"
import { spacing } from "app/theme"
import { InputSet } from "app/components/Input/InputSet"
// @ts-ignore
import { createClient } from "webdav/dist/web"
import { WebDAVClient } from "webdav"
import AlertBox from "app/components/AlertBox"
import { useStores } from "app/models"
import { CloudStorageType } from "@powerauth/lib-contracts/models/cloudStorageType"
import { WebDavCredentials } from "@powerauth/lib-contracts/models/cloud-credentials/webDavCredentials"

interface ConfigureWebDavScreenProps extends BackendConfigStackScreenProps<"ConfigureWebDav"> {}

export const ConfigureWebDavScreen: FC<ConfigureWebDavScreenProps> = observer(
  function ConfigureWebDavScreen() {
    const [server, setServer] = React.useState<string>("")
    const [username, setUsername] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [path, setPath] = React.useState<string>("/PowerAuth")
    const [useSSL, setUseSSL] = React.useState<boolean>(true)

    const [isSaving, setIsSaving] = React.useState<boolean>(false)
    const [connectionError, setConnectionError] = React.useState<string | null>(null)

    const { backendStore } = useStores()

    const fieldStatus = isSaving ? "disabled" : undefined

    const handleSave = async () => {
      if (isSaving) return

      setIsSaving(true)

      const webDavClient = createClient(server, {
        username,
        password,
      }) as WebDAVClient

      try {
        await webDavClient.getDirectoryContents("/")
        setConnectionError(null)

        const webDavCredentials: WebDavCredentials = {
          url: server,
          username,
          password,
          ssl: useSSL,
        }

        backendStore.configureCloudStorage(CloudStorageType.WebDav, webDavCredentials, path)
        setIsSaving(false)
        navigate("SetupBackendScreen")
      } catch (error) {
        setConnectionError(error as string)
      }

      setIsSaving(false)
    }

    return (
      <Screen style={$root} preset="auto">
        <Section filled fullWidth>
          <>
            <InputSet label={"Server"}>
              <TextField
                status={fieldStatus}
                value={server}
                onChangeText={setServer}
                placeholder={"https://example.com/webdav"}
                autoCorrect={false}
                autoCapitalize={"none"}
                autoFocus
              />
            </InputSet>
            <InputSet label={"Username"}>
              <TextField
                status={fieldStatus}
                value={username}
                onChangeText={setUsername}
                placeholder={"J.Doe"}
                autoComplete={"username"}
                autoCapitalize={"none"}
                autoCorrect={false}
              />
            </InputSet>
            <InputSet label={"Password"}>
              <TextField
                status={fieldStatus}
                value={password}
                onChangeText={setPassword}
                placeholder={"YourSecretPassword"}
                autoCapitalize={"none"}
                autoComplete={"password"}
                secureTextEntry
              />
            </InputSet>
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
            <InputSet label={"Use SSL"}>
              <Toggle
                status={fieldStatus}
                variant={"switch"}
                value={useSSL}
                onValueChange={setUseSSL}
              />
            </InputSet>
          </>
        </Section>
        <Section style={{ marginTop: spacing.lg }}>
          <Button disabled={isSaving} preset={"filled"} text={"Save"} onPress={handleSave} />
        </Section>
        {connectionError && (
          <Section style={{ marginTop: spacing.lg }}>
            <AlertBox text={"Could not connect to the server" + connectionError} />
          </Section>
        )}
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
