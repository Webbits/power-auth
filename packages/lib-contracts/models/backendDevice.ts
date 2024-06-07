import { DevicePlatform } from "./device"

export interface BackendDevice {
  id: string
  name: string
  platform: DevicePlatform
  version: string
  publicKey: string
  signature: string
  isTrusted: boolean
}
