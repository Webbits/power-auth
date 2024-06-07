import { Instance, types } from "mobx-state-tree"
import { BackendDevice } from "@powerauth/lib-contracts/models/backendDevice"
import { CloudStorageType } from "@powerauth/lib-contracts/models/cloudStorageType"
import { withSetPropAction } from "app/models/helpers/withSetPropAction"
import ICloudStorage from "@powerauth/lib-contracts/ICloudStorage"
import { resolveCloudStorage } from "@powerauth/lib-core/storage/resolver"

export const BackendStoreModel = types
  .model("BackendStore")
  .props({
    isConfigured: types.optional(types.boolean, false),
    isConnected: types.optional(types.boolean, false),
    isConnecting: types.optional(types.boolean, false),
    isSyncing: types.optional(types.boolean, false),
    lastSyncedAt: types.maybe(types.Date),
    backendDevices: types.maybe(types.frozen<BackendDevice[]>()),
    backendId: types.maybe(types.string),
    cloudStorageRootPath: types.maybe(types.string),
    cloudStorageType: types.maybe(types.frozen<CloudStorageType>()),
    cloudStorageCredentials: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    configureCloudStorage(
      type: CloudStorageType,
      credentials: object,
      cloudStorageRootPath: string,
    ) {
      store.cloudStorageType = type
      store.cloudStorageCredentials = JSON.stringify(credentials)
      store.cloudStorageRootPath = cloudStorageRootPath
    },
  }))
  .views((store) => ({
    get cloudStorageInstance(): ICloudStorage | undefined {
      if (store.cloudStorageType === undefined || store.cloudStorageCredentials === undefined) {
        console.log(
          "Cloud storage not configured",
          store.cloudStorageType,
          store.cloudStorageCredentials,
        )
        return undefined
      }

      try {
        const instance = resolveCloudStorage(
          store.cloudStorageType,
          JSON.parse(store.cloudStorageCredentials),
        )

        if (store.cloudStorageRootPath) {
          instance.setRootPath(store.cloudStorageRootPath)
        }

        return instance
      } catch (error) {
        console.error("Failed to resolve cloud storage credentials", error)
        return undefined
      }
    },
  }))

export interface BackendStore extends Instance<typeof BackendStoreModel> {}
