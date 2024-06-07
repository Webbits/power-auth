import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { TotpAccountStoreModel } from "app/models/TotpAccountStore"
import { BackendStoreModel } from "app/models/BackendStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  totpAccountStore: types.optional(TotpAccountStoreModel, {}),
  backendStore: types.optional(BackendStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
