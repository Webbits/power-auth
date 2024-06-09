import ICloudStorage from "@powerauth/lib-contracts/ICloudStorage";
import { MockCloudStorage } from "../mock-cloud-storage";
import {
  BackendDefaultPaths,
  BackendStoredBackendInfo,
} from "@powerauth/lib-core/power-auth-backend";
import { Device, DevicePlatform } from "@powerauth/lib-contracts/models/device";
import { createUnsafeUuid } from "../utils/uuid";
import { faker } from "@faker-js/faker";

export const createCloudStorageWithOneDeviceBackend = async (): Promise<{
  storage: ICloudStorage;
  deviceOnBackend: Device;
}> => {
  const mockCloudStorage = new MockCloudStorage();
  const backendId = createUnsafeUuid();
  const device = createRandomDevice();

  mockCloudStorage.setRootPath(BackendDefaultPaths.root);

  await mockCloudStorage.setAsync(BackendDefaultPaths.backendInfoFile, {
    id: backendId,
    createdAt: "Sun, 09 Jun 2024 12:14:40 GMT",
  } as BackendStoredBackendInfo);

  await mockCloudStorage.setAsync(
    BackendDefaultPaths.deviceInfoFile(device.id),
    {
      id: device.id,
      name: device.name,
      version: device.version,
      platform: device.platform.toString(),
      publicKey: device.keyPair.publicKey,
      sharedSignature: "[signed-symmetric]" + device.keyPair.publicKey,
      createdAt: "Sun, 09 Jun 2024 12:14:40 GMT",
      updatedAt: "Sun, 09 Jun 2024 12:14:40 GMT",
    }
  );

  await mockCloudStorage.setAsync(
    BackendDefaultPaths.deviceSharedSecretFile(device.id),
    `[encrypted]{"backendId":"${backendId}","key":"symmetrickey","iv":"symmetrickey"}`
  );

  return {
    storage: mockCloudStorage,
    deviceOnBackend: device,
  };
};

export const createRandomDevice = (): Device => {
  return {
    id: createUnsafeUuid(),
    name: faker.person.firstName() + "'s " + "phone",
    version: "1.0",
    platform: DevicePlatform.Ios,
    keyPair: {
      privateKey: "privkey",
      publicKey: "pubkey",
    },
  };
};
