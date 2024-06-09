import {
  BackendDefaultPaths,
  BackendStoredBackendInfo,
  PowerAuthBackend,
} from "./power-auth-backend";
import { MockCloudStorage } from "@powerauth/lib-testing/mock-cloud-storage";
import { MockEncryption } from "@powerauth/lib-testing/mock-encryption";
import MemoryCache from "./memory-cache";
import { Device, DevicePlatform } from "@powerauth/lib-contracts/models/device";

test("it will create a new backend when none exists", async () => {
  const device: Device = {
    id: "766edb8b-11a3-4912-b308-f5cdb90ee97d",
    name: "Test device",
    version: "1.0",
    platform: DevicePlatform.Ios,
    keyPair: {
      privateKey: "privkey",
      publicKey: "pubkey",
    },
  };
  const mockCloudStorage = new MockCloudStorage();

  const backend = new PowerAuthBackend(
    mockCloudStorage,
    new MockEncryption(),
    new MemoryCache(),
    device
  );

  await backend.initAsync();

  const storedInfo = mockCloudStorage.getAsync<BackendStoredBackendInfo>(
    BackendDefaultPaths.backendInfoFile
  );

  expect(storedInfo).toBeDefined();
});
