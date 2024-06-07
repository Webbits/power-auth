import { Text } from "app/components"
import { View } from "react-native"
import React, { ReactElement } from "react"
import { spacing } from "app/theme"

interface InputSetProps {
  label: string
  children: ReactElement
}

export function InputSet({ label, children }: InputSetProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: spacing.xs,
      }}
    >
      <Text style={{ flex: 1, maxWidth: 120, fontWeight: "600" }} text={label} />
      {children}
    </View>
  )
}
