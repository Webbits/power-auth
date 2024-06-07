import { TotpAccountModel } from "./TotpAccount"

test("can be created", () => {
  const instance = TotpAccountModel.create({
    guid: "1",
    issuer: "issuer",
    accountName: "account",
    digits: 6,
    secret: "test"
  })

  expect(instance).toBeTruthy()
})
