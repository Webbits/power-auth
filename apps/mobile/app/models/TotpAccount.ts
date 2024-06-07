import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const TotpAccountModel = types
  .model("TotpAccount")
  .props({
    guid: types.identifier,
    issuer: types.string,
    accountName: types.string,
    secret: types.string,
    digits: types.optional(types.number, 6),
    period: types.optional(types.number, 30),
    algorithm: types.optional(types.string, "SHA1"),
    otpToken: types.maybe(types.string),
    tokenValidTill: types.maybe(types.Date),
  })
  .actions(withSetPropAction);

export interface TotpAccount extends Instance<typeof TotpAccountModel> {
}

export interface TotpAccountSnapshotIn extends SnapshotIn<typeof TotpAccountModel> {
}

export interface TotpAccountSnapshotOut extends SnapshotOut<typeof TotpAccountModel> {
}
