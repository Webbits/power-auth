import { TotpAccountSnapshotIn } from "app/models"

class Repository {
  async getAccounts(): Promise<TotpAccountSnapshotIn[]> {
    return [
      {
        guid: "d97d9140-a34a-431d-83c2-11a321c5a704",
        accountName: "john.doe@example.com",
        issuer: "Google",
        secret: "2iasdljaslkjqw",
      },
      {
        guid: "21ef1c24-ba55-4c96-bdde-2f5fd38a0dbc",
        accountName: "john.doe@example.com",
        issuer: "LastPass",
        secret: "fasdasdasd",
      },
      {
        guid: "f56bb5d8-2e0e-4b13-a174-b9c3801da5c3",
        accountName: "john.doe@example.com",
        issuer: "Microsoft",
        secret: "test",
      },
    ]
  }
}

export const repository = new Repository()
