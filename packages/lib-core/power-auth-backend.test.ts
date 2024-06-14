import {
  BackendDefaultPaths,
  BackendStoredBackendInfo,
  BackendStoredDeviceInfo,
  BackendStoredSharedSecret,
  PowerAuthBackend,
} from "./power-auth-backend";
import { MockCloudStorage } from "@powerauth/lib-testing/mock-cloud-storage";
import { MockEncryption } from "@powerauth/lib-testing/mock-encryption";
import MemoryCache from "./memory-cache";
import { Device, DevicePlatform } from "@powerauth/lib-contracts/models/device";
import {
  createBackendWithExistingDevice,
  createRandomDevice,
} from "@powerauth/lib-testing/factories/backend-factory";
import { secondsDiff } from "@powerauth/lib-testing/utils/datetime";

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
  const mockEncryption = new MockEncryption();

  const backend = new PowerAuthBackend(
    mockCloudStorage,
    mockEncryption,
    new MemoryCache(),
    device
  );

  await backend.initAsync();

  // Assert that it created the backend info file
  const storedBackendInfo =
    await mockCloudStorage.getAsync<BackendStoredBackendInfo>(
      BackendDefaultPaths.backendInfoFile
    );
  expect(storedBackendInfo.id).toBeDefined();
  expect(storedBackendInfo.createdAt).toBeDefined();

  expect(secondsDiff(storedBackendInfo.createdAt)).toBeLessThan(5);

  // Assert that it created the device file on the backend
  const deviceInfoFile =
    await mockCloudStorage.getAsync<BackendStoredDeviceInfo>(
      BackendDefaultPaths.deviceInfoFile(device.id)
    );

  expect(deviceInfoFile).toBeDefined();
  expect(deviceInfoFile.id).toEqual(device.id);
  expect(deviceInfoFile.name).toEqual(device.name);
  expect(deviceInfoFile.publicKey).toEqual(device.keyPair.publicKey);
  expect(deviceInfoFile.sharedSignature).toEqual(
    "[signed-symmetric]" + device.keyPair.publicKey
  );
  expect(deviceInfoFile.platform).toEqual(device.platform.toString());
  expect(deviceInfoFile.createdAt).toBeDefined();
  expect(deviceInfoFile.createdAt).toEqual(deviceInfoFile.updatedAt);
  expect(deviceInfoFile.version).toEqual(device.version);

  // Assert that a shared secret has been created
  const sharedSecretEncrypted = await mockCloudStorage.getAsync<string>(
    BackendDefaultPaths.deviceSharedSecretFile(device.id)
  );
  const sharedSecretFileString = await mockEncryption.decryptAsymmetricAsync(
    sharedSecretEncrypted,
    device.keyPair.privateKey
  );
  const sharedSecretFile = JSON.parse(
    sharedSecretFileString
  ) as BackendStoredSharedSecret;

  expect(sharedSecretFile.key).toBe("symmetrickey");
  expect(sharedSecretFile.iv).toBe("symmetrickey");
  expect(sharedSecretFile.backendId).toBe(storedBackendInfo.id);
});

test("it will work with an already existing backend and a new device but the device won't be joined yet", async () => {
  const { backend } = await createBackendWithExistingDevice(
    createRandomDevice()
  );

  await backend.initAsync();

  expect(backend.isInitialized()).toBe(true);
  expect(backend.clientDeviceIsJoined).toBe(false);
});

test("it will fail when the backend id does not match the backend id in the shared secret", () => {});

test("it can create a new join request", async () => {
  const newDevice: Device = {
    ...createRandomDevice(),
    keyPair: {
      privateKey: "privatekey",
      publicKey: "thepublickey",
    },
  };

  const { backend } = await createBackendWithExistingDevice(newDevice);

  await backend.initAsync();
  await backend.requestToJoinAsync();

  const joinRequestFile =
    await backend.storage.getAsync<BackendStoredDeviceInfo>(
      backend.storagePaths.deviceJoinRequestFile(newDevice.id)
    );

  expect(joinRequestFile).toBeDefined();
  expect(joinRequestFile.name).toEqual(newDevice.name);
  expect(secondsDiff(joinRequestFile.createdAt)).toBeLessThan(1);
  expect(secondsDiff(joinRequestFile.updatedAt)).toBeLessThan(1);
  expect(joinRequestFile.sharedSignature).toHaveLength(0);
  expect(joinRequestFile.publicKey).toBe("thepublickey");

  const joinRequestDevices = await backend.getJoinRequestDevicesAsync();

  expect(joinRequestDevices).toHaveLength(1);
  expect(joinRequestDevices[0].isTrusted).toBe(false);
});

test("it can join a new device by accepting a join request", () => {});

test("it can remove a join request", () => {});

test("it will fail when the local device data does not match the backend device data", () => {});
