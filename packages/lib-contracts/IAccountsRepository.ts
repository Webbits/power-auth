import { Account } from "./models/account";

export default interface IAccountsRepository {
  getAll(): Promise<Account[]>;

  getById(id: string): Promise<Account | null>;

  search(query: string): Promise<Account[]>;

  remove(id: string): Promise<void>;

  update(account: Account): Promise<void>;

  add(account: Account): Promise<void>;

  addOrUpdate(account: Account): Promise<void>;
}
