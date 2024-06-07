import ICloudStorage from "@powerauth/lib-contracts/ICloudStorage";
import IEncryption from "@powerauth/lib-contracts/IEncryption";
import ICache from "@powerauth/lib-contracts/ICache";
import { Device, DevicePlatform } from "@powerauth/lib-contracts/models/device";
import Account from "@powerauth/lib-contracts/models/account";
import { BackendDevice } from "@powerauth/lib-contracts/models/backendDevice";
import { SharedSecret } from "@powerauth/lib-contracts/models/sharedSecret";
import IAccountsRepository from "@powerauth/lib-contracts/IAccountsRepository";
import { MemoryAccountRepository } from "./memory-account-repository";

interface StoredDeviceInfo {
  id: string;
  name: string;
  version: string;
  platform: DevicePlatform;
  publicKey: string;
  sharedSignature: string;
  createdAt: string;
  updatedAt: string;
}

interface StoredAccountInfo {
  id: string;
  label: string;
  issuer: string;
  period: number;
  digits: number;
  algorithm: string;
  createdAt: string;
  updatedAt: string;
}

interface StoredSharedSecret {
  backendId: string;
  key: string;
  iv: string;
}

interface StoredBackendInfo {
  id: string;
  createdAt: string;
}

interface StoredAccountSecret {
  id: string;
  deviceId: string;
  secret: string;
}

const CACHE_KEYS = {
  DEVICES: "devices",
  JOIN_REQUESTS: "join_requests",
  ACCOUNTS: "accounts",
};

type IStoragePaths = {
  root: string;
  backendInfoFile: string;
  devicesFolder: string;
  deviceFolder: (deviceId: string) => string;
  deviceInfoFile: (deviceId: string) => string;
  deviceSharedSecretFile: (deviceId: string) => string;
  deviceJoinRequestsFolder: string;
  deviceJoinRequestFile: (requestingDeviceId: string) => string;
  accountsFolder: string;
  accountInfoFile: (accountId: string) => string;
  accountSecretFile: (accountId: string) => string;
};

const DefaultStoragePaths: IStoragePaths = {
  root: "power-auth",
  backendInfoFile: "backend.json",
  devicesFolder: "devices",
  deviceFolder: (deviceId) => `devices/${deviceId}`,
  deviceInfoFile: (deviceId) => `devices/${deviceId}/device.json`,
  deviceSharedSecretFile: (deviceId) =>
    `devices/${deviceId}/shared-secret.json.encrypted`,
  deviceJoinRequestsFolder: `device-join-requests`,
  deviceJoinRequestFile: (requestingDeviceId) =>
    `device-join-requests/${requestingDeviceId}/device.json`,
  accountsFolder: "accounts",
  accountInfoFile: (accountId) => `accounts/${accountId}/accounts.json`,
  accountSecretFile: (accountId) =>
    `accounts/${accountId}/secret.json.encrypted`,
};

interface BackendOptions {
  storagePaths?: IStoragePaths;
}

export class PowerAuthBackend {
  storage: ICloudStorage;
  storagePaths: IStoragePaths;
  cache: ICache;
  encryption: IEncryption;

  accountsRepository: IAccountsRepository;

  backendInfo?: StoredBackendInfo;

  deviceIsJoined: boolean;
  device: Device;

  sharedSecret?: SharedSecret;

  constructor(
    storage: ICloudStorage,
    encryption: IEncryption,
    cache: ICache,
    device: Device,
    options?: BackendOptions
  ) {
    this.storage = storage;
    this.encryption = encryption;
    this.cache = cache;
    this.storagePaths = {
      ...DefaultStoragePaths,
      ...(options?.storagePaths ?? {}),
    };

    this.deviceIsJoined = false;
    this.device = device;

    this.storage.setRootPath(this.storagePaths.root);

    this.accountsRepository = new MemoryAccountRepository(); // Replace by actual backend accounts repository
  }

  static async storageHasInitializedBackendAsync(
    storage: ICloudStorage
  ): Promise<boolean> {
    const backendInfo = await storage.getAsync<StoredBackendInfo>(
      DefaultStoragePaths.backendInfoFile
    );

    return backendInfo !== null;
  }

  async initAsync(): Promise<void> {
    const backendInfo = await this.storage.getAsync<StoredBackendInfo>(
      this.storagePaths.backendInfoFile
    );

    if (backendInfo === null) {
      await this.initializeNewBackendAsync();
      return;
    }

    this.deviceIsJoined = await this.storage.existsAsync(
      this.storagePaths.deviceFolder(this.device.id)
    );

    if (this.deviceIsJoined) {
      await this.updateDeviceInfoAsync();
      this.sharedSecret = (await this.getSharedSecret()) ?? undefined;
    }
  }

  async initializeNewBackendAsync(): Promise<void> {
    const now = new Date().toUTCString();

    const backendInfo: StoredBackendInfo = {
      id: this.encryption.uuid(),
      createdAt: now,
    };

    const sharedSecret: StoredSharedSecret = {
      backendId: backendInfo.id,
      key: await this.encryption.generateSymmetricKeyAsync(),
      iv: await this.encryption.generateSymmetricKeyAsync(16),
    };

    console.log("initializing new backed with device", this.device);
    const deviceInfo: StoredDeviceInfo = {
      id: this.device.id,
      name: this.device.name,
      version: this.device.version,
      platform: this.device.platform,
      publicKey: this.device.keyPair.publicKey,
      sharedSignature: await this.encryption.signSymmetricAsync(
        sharedSecret.key,
        this.device.keyPair.publicKey
      ),
      createdAt: now,
      updatedAt: now,
    };

    await this.storage.createRootAsync();

    const encryptedSharedSecret = await this.encryption.encryptAsymmetricAsync(
      JSON.stringify(sharedSecret),
      this.device.keyPair.publicKey
    );

    await this.storage.setAsync(
      this.storagePaths.deviceInfoFile(this.device.id),
      deviceInfo
    );
    await this.storage.setAsync(this.storagePaths.backendInfoFile, backendInfo);
    await this.storage.setAsync(
      this.storagePaths.deviceSharedSecretFile(this.device.id),
      encryptedSharedSecret
    );

    this.deviceIsJoined = true;
    this.backendInfo = backendInfo;
  }

  async updateDeviceInfoAsync(): Promise<void> {
    let deviceInfo = await this.storage.getAsync<StoredDeviceInfo>(
      this.storagePaths.deviceInfoFile(this.device.id)
    );

    if (deviceInfo === null) return;

    deviceInfo = {
      ...deviceInfo,
      name: this.device.name,
      version: this.device.version,
      platform: this.device.platform,
      updatedAt: new Date().toUTCString(),
    };

    await this.storage.setAsync(
      this.storagePaths.deviceInfoFile(this.device.id),
      deviceInfo
    );
  }

  async getDevicesAsync(): Promise<BackendDevice[]> {
    const cache = await this.cache.getAsync<BackendDevice[]>(
      CACHE_KEYS.DEVICES
    );
    if (cache !== null) return cache;

    const devicesPaths = await this.storage.lsAsync(
      this.storagePaths.devicesFolder
    );

    const deviceInfos = await Promise.all(
      devicesPaths.map(async (devicePath) => {
        return await this.storage.getAsync<StoredDeviceInfo>(devicePath);
      })
    );

    const devices = deviceInfos
      .filter((x) => x !== null)
      .map((deviceInfo) => {
        if (deviceInfo === null) throw new Error("Device info is null");

        return this.mapStoredDeviceInfoToBackendDevice(deviceInfo, false);
      });

    const sharedSecret = await this.getSharedSecret();

    const trustCheckedDevices = await Promise.all(
      devices.map(async (device) => {
        if (sharedSecret === null) return device;

        const calculatedSignature = await this.encryption.signSymmetricAsync(
          sharedSecret.key,
          device.publicKey
        );

        // If the calculated signature does not match the stored signature, the device is not trusted
        return {
          ...device,
          isTrusted: calculatedSignature === device.signature,
        };
      })
    );

    const trustedDevices = trustCheckedDevices.filter(
      (device) => device.isTrusted
    );

    await this.cache.setAsync<BackendDevice[]>(
      CACHE_KEYS.DEVICES,
      trustedDevices
    );

    return trustedDevices;
  }

  async getJoinRequestDevicesAsync(): Promise<BackendDevice[]> {
    const cache = await this.cache.getAsync<BackendDevice[]>(
      CACHE_KEYS.JOIN_REQUESTS
    );
    if (cache !== null) return cache;

    const joinRequestPaths = await this.storage.lsAsync(
      this.storagePaths.deviceJoinRequestsFolder
    );

    const joinRequestDeviceInfos = await Promise.all(
      joinRequestPaths.map(async (joinRequestPath) => {
        return await this.storage.getAsync<StoredDeviceInfo>(joinRequestPath);
      })
    );

    const devices = joinRequestDeviceInfos
      .filter((deviceInfo) => deviceInfo !== null)
      .map((deviceInfo) => {
        if (deviceInfo === null) throw new Error("Device info is null");

        return this.mapStoredDeviceInfoToBackendDevice(deviceInfo, false);
      });

    await this.cache.setAsync<BackendDevice[]>(
      CACHE_KEYS.JOIN_REQUESTS,
      devices
    );

    return devices;
  }

  requestToJoinAsync(): Promise<void> {
    const now = new Date().toUTCString();

    const storedDeviceInfo: StoredDeviceInfo = {
      id: this.device.id,
      name: this.device.name,
      version: this.device.version,
      platform: this.device.platform,
      publicKey: this.device.keyPair.publicKey,
      sharedSignature: "", // Requesting device does not have a signature as it is not trusted yet
      createdAt: now,
      updatedAt: now,
    };

    return this.storage.setAsync(
      this.storagePaths.deviceJoinRequestFile(this.device.id),
      storedDeviceInfo
    );
  }

  async joinDeviceAsync(device: BackendDevice): Promise<void> {
    await this.storage.removeAsync(
      this.storagePaths.deviceJoinRequestFile(device.id)
    );
    const sharedSecret = await this.getSharedSecret();

    if (sharedSecret === null) throw new Error("Shared secret not found");

    const now = new Date().toUTCString();

    const storedDeviceInfo: StoredDeviceInfo = {
      id: device.id,
      name: device.name,
      version: device.version,
      platform: device.platform,
      publicKey: device.publicKey,
      sharedSignature: await this.encryption.signSymmetricAsync(
        sharedSecret.key,
        device.publicKey
      ),
      createdAt: now,
      updatedAt: now,
    };

    await this.storage.setAsync(
      this.storagePaths.deviceInfoFile(device.id),
      storedDeviceInfo
    );

    const sharedSecretForDevice: StoredSharedSecret = {
      backendId: this.backendInfo?.id || "",
      key: sharedSecret.key,
      iv: sharedSecret.iv,
    };

    const encryptedSharedSecret = await this.encryption.encryptAsymmetricAsync(
      JSON.stringify(sharedSecretForDevice),
      device.publicKey
    );

    await this.storage.setAsync(
      this.storagePaths.deviceSharedSecretFile(device.id),
      encryptedSharedSecret
    );

    await this.cache.removeAsync(CACHE_KEYS.DEVICES);
  }

  removeDeviceAsync(device: BackendDevice): Promise<void> {
    return this.storage.removeAsync(this.storagePaths.deviceFolder(device.id));
  }

  async getAccountsAsync(): Promise<Account[]> {
    if (!this.deviceIsJoined) throw new Error("Device is not joined");
    if (!this.sharedSecret)
      throw new Error("Can not get accounts without shared secret");

    const cache = await this.cache.getAsync<Account[]>(CACHE_KEYS.ACCOUNTS);
    if (cache !== null) return cache;

    const accountsPaths = await this.storage.lsAsync(
      this.storagePaths.accountsFolder
    );

    let accountInfos = (
      await Promise.all(
        accountsPaths.map(async (accountPath) => {
          return await this.storage.getAsync<StoredAccountInfo>(accountPath);
        })
      )
    )
      .filter((x) => x !== null)
      .map((x) => x as StoredAccountInfo);

    const accounts = await Promise.all(
      accountInfos.map(async (accountInfo) => {
        const account: Account = {
          id: accountInfo.id,
          label: accountInfo.label,
          issuer: accountInfo.issuer,
          period: accountInfo.period,
          digits: accountInfo.digits,
          algorithm: accountInfo.algorithm,
          lastUpdatedAt: accountInfo.updatedAt,
        };

        const encryptedSecretFile = await this.storage.getRawAsync(
          this.storagePaths.accountSecretFile(accountInfo.id)
        );

        // If the encrypted secret is not found, the account is not shared with the device
        if (encryptedSecretFile === null) return account;

        const decryptedSecretString =
          await this.encryption.decryptSymmetricAsync(
            encryptedSecretFile,
            this.sharedSecret!.key,
            this.sharedSecret!.iv
          );
        const decryptedSecret = JSON.parse(
          decryptedSecretString
        ) as StoredAccountSecret;

        // If the decrypted secret does not match the account info, the account is not shared with the device
        if (
          decryptedSecret.deviceId !== this.device.id ||
          decryptedSecret.id !== accountInfo.id
        ) {
          return account;
        }

        account.secret = decryptedSecret.secret;

        return account;
      })
    );

    await this.cache.setAsync<Account[]>(CACHE_KEYS.ACCOUNTS, accounts);

    return accounts;
  }

  async addAccountAsync(account: Account): Promise<void> {
    if (!this.deviceIsJoined) throw new Error("Device is not joined");
    if (!this.sharedSecret)
      throw new Error("Can not add account without shared secret");
    if (!account.secret) throw new Error("Account secret is not set");

    const now = new Date().toUTCString();
    const accountInfo: StoredAccountInfo = {
      id: account.id,
      label: account.label,
      issuer: account.issuer,
      period: account.period,
      digits: account.digits,
      algorithm: account.algorithm,
      createdAt: now,
      updatedAt: now,
    };

    await this.storage.setAsync(
      this.storagePaths.accountInfoFile(account.id),
      accountInfo
    );

    const devices = await this.getDevicesAsync();

    // For each device, create an encrypted copy of the account secret using the devices public key to encrypt it
    await Promise.all(
      devices.map(async (device) => {
        const storedAccountSecret: StoredAccountSecret = {
          id: account.id,
          deviceId: device.id,
          secret: account.secret || "",
        };

        const encryptedStoredAccountSecret =
          await this.encryption.encryptSymmetricAsync(
            JSON.stringify(storedAccountSecret),
            this.sharedSecret!.key,
            this.sharedSecret!.iv
          );

        await this.storage.setAsync(
          this.storagePaths.accountSecretFile(account.id),
          encryptedStoredAccountSecret
        );
      })
    );

    await this.cache.removeAsync(CACHE_KEYS.ACCOUNTS);
  }

  async removeAccountAsync(id: string): Promise<void> {
    if (!this.deviceIsJoined) throw new Error("Device is not joined");
    if (!this.sharedSecret)
      throw new Error("Can not remove account without shared secret");

    await this.storage.removeAsync(this.storagePaths.accountInfoFile(id));
    await this.storage.removeAsync(this.storagePaths.accountSecretFile(id));
    await this.cache.removeAsync(CACHE_KEYS.ACCOUNTS);
  }

  async getSharedSecret(): Promise<SharedSecret | null> {
    const encryptedSharedSecretString = await this.storage.getRawAsync(
      this.storagePaths.deviceSharedSecretFile(this.device.id)
    );

    // If the shared secret is not found, the device is not trusted
    if (encryptedSharedSecretString === null) return null;

    try {
      const decryptedSharedSecretString =
        await this.encryption.decryptAsymmetricAsync(
          encryptedSharedSecretString,
          this.device.keyPair.privateKey
        );
      const decryptedSharedSecret = JSON.parse(
        decryptedSharedSecretString
      ) as StoredSharedSecret;

      if (decryptedSharedSecret.backendId !== this.backendInfo?.id) return null;

      return {
        key: decryptedSharedSecret.key,
        iv: decryptedSharedSecret.iv,
      };
    } catch {
      return null;
    }
  }

  private mapStoredDeviceInfoToBackendDevice(
    storedDeviceInfo: StoredDeviceInfo,
    isTrusted: boolean
  ): BackendDevice {
    return {
      id: storedDeviceInfo.id,
      name: storedDeviceInfo.name,
      platform: storedDeviceInfo.platform,
      version: storedDeviceInfo.version,
      publicKey: storedDeviceInfo.publicKey,
      signature: storedDeviceInfo.sharedSignature,
      isTrusted,
    };
  }
}
