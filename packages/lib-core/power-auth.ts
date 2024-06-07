import ICloudStorage from "@powerauth/lib-contracts/ICloudStorage";
import { PowerAuthBackend } from "./power-auth-backend";
import IEncryption from "@powerauth/lib-contracts/IEncryption";
import { Device, DevicePlatform } from "@powerauth/lib-contracts/models/device";
import MemoryCache from "./memory-cache";
import IAccountsRepository from "@powerauth/lib-contracts/IAccountsRepository";
import ISecureLocalStorage from "@powerauth/lib-contracts/ISecureLocalStorage";

export interface PowerAuthConfiguration {
  secureLocalStorage: ISecureLocalStorage;
  encryption: IEncryption;
  accountRepository: IAccountsRepository;
  backend?: PowerAuthBackend;
}

export interface DeviceSetupOptions {
  name: string;
  platform: DevicePlatform;
  version: string;
}

export class PowerAuth {
  private _config?: PowerAuthConfiguration;

  init(config: PowerAuthConfiguration) {
    this._config = config;
  }

  async initBackend(cloudStorage: ICloudStorage): Promise<void> {
    if (!this.isInitialized()) throw new Error("PowerAuth not initialized");

    const device = await this.getDeviceAsync();

    if (!device) {
      throw new Error("Device not found");
    }

    const backend = new PowerAuthBackend(
      cloudStorage,
      this.encryption(),
      new MemoryCache(),
      device
    );

    await backend.initAsync();

    this._config!.backend = backend;
  }

  isInitialized(): boolean {
    return this._config !== undefined;
  }

  async synchronize(): Promise<void> {
    throw new Error("Not implemented");
  }

  config(): PowerAuthConfiguration {
    if (!this.isInitialized()) throw new Error("PowerAuth not initialized");
    return this._config!;
  }

  secureLocalStorage(): ISecureLocalStorage {
    return this.config().secureLocalStorage;
  }

  encryption(): IEncryption {
    return this.config().encryption;
  }

  hasBackend(): boolean {
    return this.config().backend !== undefined;
  }

  getDeviceAsync(): Promise<Device | null> {
    return this.secureLocalStorage().getAsync<Device>("device_v1");
  }

  async setupDeviceAsync({
    name,
    platform,
    version,
  }: DeviceSetupOptions): Promise<Device> {
    let device = await this.getDeviceAsync();

    if (device) {
      return device;
    }

    device = {
      id: this.encryption().uuid(),
      name,
      keyPair: await this.encryption().generateAsymmetricKeyPairAsync(),
      platform,
      version,
    };

    await this.secureLocalStorage().setAsync("device_v1", device);

    return device;
  }

  accounts(): IAccountsRepository {
    return this.config().accountRepository;
  }
}
