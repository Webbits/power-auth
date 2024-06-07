import { MemoryAccountRepository } from "./memory-account-repository";
import { Account } from "@powerauth/lib-contracts/";

const googleAccount: Account = {
  id: "ddbbee85-4a3a-4452-afe1-c0a1074c0ef0",
  issuer: "Google",
  label: "Google (john.doe@example.com)",
  lastUpdatedAt: new Date().toUTCString(),
  algorithm: "sha256",
  digits: 6,
  period: 30,
  secret: "secret",
  synced: false,
};

const acmeCorpAccount: Account = {
  id: "cdb058a7-77a3-41a8-a32c-c640651d1bae",
  issuer: "AcmeCorp Issuer",
  label: "AcmeCorp",
  lastUpdatedAt: new Date().toUTCString(),
  algorithm: "sha256",
  digits: 6,
  period: 30,
  secret: "secret",
  synced: false,
};

let instanceWithAccounts: MemoryAccountRepository;

describe("MemoryAccountRepository", () => {
  beforeEach(() => {
    instanceWithAccounts = new MemoryAccountRepository([
      googleAccount,
      acmeCorpAccount,
    ]);
  });

  test("can be constructed with accounts", async () => {
    const instance = new MemoryAccountRepository([
      googleAccount,
      acmeCorpAccount,
    ]);

    expect(await instance.getAll()).toEqual([googleAccount, acmeCorpAccount]);
  });

  test("can add an account", async () => {
    const instance = new MemoryAccountRepository();
    await instance.add(googleAccount);

    expect(await instance.getAll()).toEqual([googleAccount]);
  });

  test("can search an account by issuer", async () => {
    const results = await instanceWithAccounts.search("corp issuer");

    expect(results).toHaveLength(1);
    expect(results).toEqual([acmeCorpAccount]);
  });

  test("can search an account by label", async () => {
    const results = await instanceWithAccounts.search("boyd");

    expect(results).toHaveLength(1);
    expect(results).toEqual([googleAccount]);
  });

  test("can remove an account", async () => {
    await instanceWithAccounts.remove(googleAccount.id);
    expect(await instanceWithAccounts.getById(googleAccount.id)).toBeNull();
    expect(await instanceWithAccounts.getAll()).toHaveLength(1);
  });

  test("can update an account", async () => {
    const updatedGoogleAccount: Account = { ...googleAccount };
    updatedGoogleAccount.label = "Google (john.doe@gmail.com)";

    await instanceWithAccounts.update(updatedGoogleAccount);

    expect(await instanceWithAccounts.getById(googleAccount.id)).toEqual(
      updatedGoogleAccount
    );
  });

  test("can update an account with addOrUpdate", async () => {
    const updatedGoogleAccount: Account = { ...googleAccount };
    updatedGoogleAccount.label = "Google (john.doe@gmail.com)";

    await instanceWithAccounts.addOrUpdate(updatedGoogleAccount);

    expect(await instanceWithAccounts.getById(googleAccount.id)).toEqual(
      updatedGoogleAccount
    );
  });

  test("can create an account with addOrUpdate", async () => {
    const instance = new MemoryAccountRepository();

    await instance.addOrUpdate(googleAccount);

    expect(await instance.getById(googleAccount.id)).toEqual(googleAccount);
  });

  test("will call callback on add", async () => {
    const callback = jest.fn();
    const instance = new MemoryAccountRepository([], { onChange: callback });

    await instance.add(googleAccount);
    expect(callback).toHaveBeenCalledWith([googleAccount]);
  });

  test("will call callback on remove", async () => {
    const callback = jest.fn();
    const instance = new MemoryAccountRepository([googleAccount], {
      onChange: callback,
    });

    await instance.remove(googleAccount.id);
    expect(callback).toHaveBeenCalledWith([]);
  });

  test("will call callback on update", async () => {
    const callback = jest.fn();
    const instance = new MemoryAccountRepository([googleAccount], {
      onChange: callback,
    });
    const updatedGoogleAccount: Account = { ...googleAccount };
    updatedGoogleAccount.label = "Google (john.doe@gmail.com)";

    await instance.addOrUpdate(updatedGoogleAccount);

    expect(callback).toHaveBeenCalledWith([updatedGoogleAccount]);
  });
});
