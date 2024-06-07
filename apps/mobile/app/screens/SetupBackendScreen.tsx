import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { BackendConfigStackScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { ViewStyle } from "react-native"
import { Section } from "app/components/Section"
import { useStores } from "app/models"
import ICloudStorage from "@powerauth/lib-contracts/ICloudStorage"
import { PowerAuthBackend } from "@powerauth/lib-core/power-auth-backend"
import { CloudStorageType } from "@powerauth/lib-contracts/models/cloudStorageType"
import { colors, spacing } from "app/theme"
import PowerAuth from "@powerauth/lib-core"

interface SetupBackendStorageScreenProps
  extends BackendConfigStackScreenProps<"SetupBackendScreen"> {}

export const SetupBackendScreen: FC<SetupBackendStorageScreenProps> = observer(
  function ConfigureWebDavScreen() {
    const { backendStore } = useStores()
    const [cloudStorage, setCloudStorage] = React.useState<ICloudStorage | undefined>()
    const [cloudStorageHasBackend, setCloudStorageHasBackend] = React.useState<boolean>(false)
    const [initializedBackend, setInitializedBackend] = React.useState<boolean>(false)

    const handleInitializeBackend = async () => {
      await PowerAuth.initBackend(cloudStorage!)

      setInitializedBackend(true)
    }

    useEffect(() => {
      async function runAsync() {
        const {
          cloudStorageType,
          cloudStorageRootPath,
          cloudStorageInstance,
          cloudStorageCredentials,
        } = backendStore

        if (
          cloudStorageType === undefined ||
          cloudStorageInstance === undefined ||
          cloudStorageRootPath === undefined
        ) {
          console.log(
            "No instanc fe",
            cloudStorageType === CloudStorageType.WebDav,
            cloudStorageInstance,
            cloudStorageRootPath,
            cloudStorageCredentials,
          )
          return
        }

        const hasBackend = await PowerAuthBackend.storageHasInitializedBackendAsync(
          cloudStorageInstance,
        )

        setCloudStorage(cloudStorageInstance)
        setCloudStorageHasBackend(hasBackend)
      }

      runAsync()
    }, [
      backendStore.cloudStorageType,
      backendStore.cloudStorageCredentials,
      backendStore.cloudStorageRootPath,
      initializedBackend,
    ])

    return (
      <Screen style={$root} preset="auto">
        <Section style={{ marginTop: spacing.xl }}>
          <>
            {initializedBackend && <Text>Initialized backend</Text>}
            {cloudStorage && !cloudStorageHasBackend && (
              <>
                <Text style={{ marginBottom: spacing.xl, textAlign: "center" }}>
                  Initialize the PowerAuth backend in your cloud storage location. It will create
                  the necessary files at{" "}
                  <Text
                    style={{
                      backgroundColor: colors.palette.neutral400,
                      paddingHorizontal: spacing.xs,
                    }}
                  >
                    {cloudStorage.getRootPath()}
                  </Text>
                </Text>
                <Button
                  text={"Initialize new backend"}
                  onPress={handleInitializeBackend}
                  style={{ marginBottom: spacing.sm }}
                />
                <Text
                  style={{ fontSize: 13, paddingHorizontal: spacing.xs, marginBottom: spacing.sm }}
                >
                  By creating a new backend you will create a new PowerAuth backend in your cloud
                  storage. Existing two-factor accounts will be strongly encrypted and stored on the
                  backend, so even if someone gains access to your cloud storage, still only this
                  device will be able to decrypt your two-factor accounts.
                </Text>
                <Text
                  style={{ fontSize: 13, paddingHorizontal: spacing.xs, marginBottom: spacing.xl }}
                >
                  You can later join other devices to this backend, so you can access your
                  two-factor accounts from multiple devices.
                </Text>
              </>
            )}

            {cloudStorageHasBackend && (
              <>
                <Text style={{ marginBottom: spacing.xl, textAlign: "center" }}>
                  Your cloud storage contains a valid PowerAuth backend!
                </Text>
                <Button
                  text={"Join as new device"}
                  preset={"filled"}
                  style={{ marginBottom: spacing.sm }}
                />
                <Text
                  style={{ fontSize: 13, paddingHorizontal: spacing.xs, marginBottom: spacing.xl }}
                >
                  By joining this device you will add your current device as a new device to the
                  PowerAuth backend. This will require another device to approve the addition.
                </Text>
                <Button text={"Restore existing device"} style={{ marginBottom: spacing.sm }} />
                <Text style={{ fontSize: 13, paddingHorizontal: spacing.xs }}>
                  You can also restore an existing device from the cloud storage. You will need to
                  provide the private key of the device you want to restore.
                </Text>
              </>
            )}
          </>
        </Section>
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
