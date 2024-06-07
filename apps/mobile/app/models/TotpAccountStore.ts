import { Instance, onSnapshot, types } from "mobx-state-tree"
import { TotpAccount, TotpAccountModel } from "app/models/TotpAccount"
import { withSetPropAction } from "app/models/helpers/withSetPropAction"
import { repository } from "app/services/backend/repository"
import * as OTPAuth from "otpauth"

export const TotpAccountStoreModel = types
  .model("TotpAccountStore")
  .props({
    accounts: types.array(TotpAccountModel),
  })
  .actions(withSetPropAction)
  .actions((store) => ({

    async fetchAccounts() {
      store.setProp("accounts", await repository.getAccounts());
    },

    addAccount(account: TotpAccount) {
      store.accounts.push(account)
    },

    removeAccount(account: TotpAccount) {
      store.accounts.remove(account)
    },

    updateAccountToken(guid: string) {var account = store.accounts.find(x => x.guid === guid);

      if (!account) {
        return;
      }

      const otp = new OTPAuth.TOTP({
        issuer: account.issuer,
        label: account.accountName,
        secret: account.secret,
        digits: account.digits,
        period: account.period,
        algorithm: account.algorithm,
      });

      const newToken = otp.generate();

      const now = new Date();
      const currentSeconds = now.getSeconds();
      const currentMilliseconds = now.getMilliseconds();
      const millisecondsToSubtract = (currentSeconds % 30) * 1000 + currentMilliseconds;
      const startOfPeriod = new Date(now.getTime() - millisecondsToSubtract);
      const expiryTime = new Date(startOfPeriod.getTime() + (30 * 1000));

      account.otpToken = newToken;
      account.tokenValidTill = expiryTime;

      const timeoutDuration = expiryTime.getTime() - now.getTime();
      setTimeout(() => {
        // @ts-ignore
        store.updateAccountToken(guid)
      }, timeoutDuration);
    }

  }))
  .actions((store) => ({
    afterCreate() {
      onSnapshot(store, _ => {
        store.accounts.filter(x => x.otpToken === undefined).forEach(account => {
          store.updateAccountToken(account.guid);
        });
      })
    }
  }));

export interface TotpAccountStore extends Instance<typeof TotpAccountStoreModel> {}
