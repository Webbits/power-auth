import IAccountsRepository from "@powerauth/lib-contracts/IAccountsRepository";
import Account from "@powerauth/lib-contracts/models/account";

interface MemoryAccountRepositoryOptions {
  onChange?: (accounts: Account[]) => Promise<void>;
}

export class MemoryAccountRepository implements IAccountsRepository {
  private _accounts: Account[] = [];
  private _options: MemoryAccountRepositoryOptions;

  constructor(
    accounts: Account[] = [],
    options: MemoryAccountRepositoryOptions = {}
  ) {
    this._accounts = accounts;
    this._options = options;
  }

  async add(account: Account): Promise<void> {
    if ((await this.getById(account.id)) !== null) {
      throw new Error(`Account with id ${account.id} already exists`);
    }

    this._accounts.push(account);

    this.handleChange();

    return Promise.resolve();
  }

  async addOrUpdate(account: Account): Promise<void> {
    if ((await this.getById(account.id)) !== null) {
      await this.update(account);
      return;
    }

    await this.add(account);
  }

  getAll(): Promise<Account[]> {
    return Promise.resolve(this._accounts);
  }

  getById(id: string): Promise<Account | null> {
    return Promise.resolve(this._accounts.find((x) => x.id === id) ?? null);
  }

  remove(id: string): Promise<void> {
    this._accounts = this._accounts.filter((x) => x.id !== id);
    this.handleChange();

    return Promise.resolve();
  }

  search(query: string): Promise<Account[]> {
    query = query.toLowerCase();
    const results = this._accounts.filter((account) => {
      return (
        account.label.toLowerCase().includes(query) ||
        account.issuer.toLowerCase().includes(query)
      );
    });

    return Promise.resolve(results);
  }

  update(account: Account): Promise<void> {
    const index = this._accounts.findIndex((x) => x.id === account.id);

    if (index === -1) {
      throw new Error(`Account with id ${account.id} does not exist`);
    }

    this._accounts[index] = account;
    this.handleChange();

    return Promise.resolve();
  }

  private async handleChange(): Promise<void> {
    await this._options.onChange?.(this._accounts);
  }
}
