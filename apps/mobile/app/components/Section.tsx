import { ReactElement } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { colors, spacing } from "app/theme"
import { radius } from "app/theme/radius"

interface SectionProps {
  style?: StyleProp<ViewStyle>
  children?: ReactElement
  fullWidth?: boolean
  filled?: boolean
}

const $container: ViewStyle = {
  backgroundColor: colors.transparent,
  borderRadius: radius.md,
}

const $fullWidthContainer: ViewStyle = {
  width: "100%",
  borderRadius: 0,
  margin: 0,
}

const $filledContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xxs,
}

const $margin = {
  marginHorizontal: spacing.md,
  marginVertical: spacing.xxs,
}

export function Section({ style, children, fullWidth, filled }: SectionProps) {
  const containerStyle = [
    $container,
    fullWidth ? $fullWidthContainer : undefined,
    filled ? $filledContainer : undefined,
    !fullWidth ? $margin : undefined,
    style,
  ]

  return <View style={containerStyle}>{children}</View>
}
