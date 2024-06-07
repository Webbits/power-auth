import { TouchableHighlight, View } from "react-native"
import React from "react"
import { TotpAccount } from "app/models"
import { Text } from "app/components/Text"
import { colors } from "app/theme"
import Toast from "react-native-root-toast"
import { CountdownCircle } from "app/components/CountdownCircle"
import { observer } from "mobx-react-lite"
import Clipboard from "@react-native-clipboard/clipboard"

type Props = { item: TotpAccount; isFirst?: boolean }

function TotpAccountCard({ item }: Props) {
  const { issuer, otpToken } = item

  const handleOnPress = () => {
    if (!otpToken) return

    Clipboard.setString(otpToken)

    Toast.show("Copied to clipboard", { duration: Toast.durations.SHORT })
  }

  return (
    <TouchableHighlight
      onPress={handleOnPress}
      style={{
        borderRadius: 10,
        marginHorizontal: 15,
        marginTop: 20,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: colors.palette.neutral100,
          paddingVertical: 20,
          paddingHorizontal: 20,
          borderWidth: 0,
          borderCurve: "continuous",
          borderRadius: 10,
          borderColor: colors.palette.neutral300,
        }}
      >
        <View>
          <Text
            style={{
              marginBottom: 10,
              fontSize: 14,
              lineHeight: 14,
              color: colors.palette.neutral600,
            }}
          >
            {issuer} - {item.accountName}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 32,
              paddingTop: 2,
              lineHeight: 32,
              color: colors.palette.neutral900,
            }}
          >
            {otpToken}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          {item.tokenValidTill && (
            <CountdownCircle tokenValidTill={item.tokenValidTill} periodInSeconds={item.period} />
          )}
        </View>
      </View>
    </TouchableHighlight>
  )
}

export default observer(TotpAccountCard)
