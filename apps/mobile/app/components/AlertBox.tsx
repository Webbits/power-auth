import { View } from "react-native"
import { Text } from "app/components/Text"
import { colors } from "app/theme"

interface Props {
  text: string
}

export default function AlertBox(props: Props) {
  return (
    <View
      style={{
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
      }}
    >
      <Text text={props.text} style={{ color: colors.palette.neutral100 }} />
    </View>
  )
}
