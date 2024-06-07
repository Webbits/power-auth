import ICloudStorage from "@powerauth/lib-contracts/ICloudStorage";
import { CloudStorageType } from "@powerauth/lib-contracts/models/cloudStorageType";
import { WebdavCloudStorage } from "./webdav-cloud-storage";
import { WebDavCredentials } from "@powerauth/lib-contracts/models/cloud-credentials/webDavCredentials";

export function resolveCloudStorage(
  type: CloudStorageType,
  credentials: object
): ICloudStorage {
  if (type === CloudStorageType.WebDav) {
    const webDavCredentials = credentials as WebDavCredentials;
    return new WebdavCloudStorage(
      webDavCredentials.url,
      webDavCredentials.username,
      webDavCredentials.password
    );
  }

  throw new Error(`Unsupported cloud storage type: ${type}`);
}
