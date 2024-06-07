import { KeyPair } from "./keyPair"

export enum DevicePlatform {
  Android = "android-app",
  Ios = "ios-app",
}

export type Device = {
  id: string
  name: string
  keyPair: KeyPair
  platform: DevicePlatform
  version: string
}
