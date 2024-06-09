import { BackendDevice } from "./models/backendDevice";
import Account from "./models/account";
import { SharedSecret } from "./models/sharedSecret";

export interface IPowerAuthBackend {
  initAsync(): Promise<void>;

  updateDeviceInfoAsync(): Promise<void>;

  getDevicesAsync(): Promise<BackendDevice[]>;

  getJoinRequestDevicesAsync(): Promise<BackendDevice[]>;

  requestToJoinAsync(): Promise<void>;

  joinDeviceAsync(device: BackendDevice): Promise<void>;

  removeDeviceAsync(device: BackendDevice): Promise<void>;

  getAccountsAsync(): Promise<Account[]>;

  addAccountAsync(account: Account): Promise<void>;

  removeAccountAsync(id: string): Promise<void>;

  getSharedSecret(): Promise<SharedSecret | null>;
}
