const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#f1f5f9",
  neutral300: "#e2e8f0",
  neutral400: "#cbd5e1",
  neutral500: "#94a3b8",
  neutral600: "#64748b",
  neutral700: "#475569",
  neutral800: "#334155",
  neutral900: "#1e293b",

  primary100: "#d8ecf2",
  primary200: "#b2d8e5",
  primary300: "#8ac5d7",
  primary400: "#5eb2ca",
  primary500: "#219ebc",
  primary600: "#16748b",
  primary700: "#0b4d5d",
  primary800: "#032932",
  primary900: "#00090d",

  secondary100: "#c9d2d8",
  secondary200: "#96a6b2",
  secondary300: "#657d8d",
  secondary400: "#365569",
  secondary500: "#023047",
  secondary600: "#01283d",
  secondary700: "#012132",
  secondary800: "#011a28",
  secondary900: "#00131f",

  accent100: "#fff2da",
  accent200: "#ffe4b5",
  accent300: "#ffd58d",
  accent400: "#ffc65f",
  accent500: "#ffb703",
  accent600: "#be8702",
  accent700: "#805a01",
  accent800: "#483100",
  accent900: "#160c00",

  angry100: "#f6dad2",
  angry500: "#bc3f21",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,
}
