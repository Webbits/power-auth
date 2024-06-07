import ISecureLocalStorage from "@powerauth/lib-contracts/ISecureLocalStorage";

export class MockSecureLocalStorage implements ISecureLocalStorage {
  items: { [key: string]: object | string } = {};

  getAsync<T>(path: string): Promise<T | null> {
    if (!this.items.hasOwnProperty(path)) {
      return Promise.resolve(null);
    }

    return Promise.resolve(this.items[path] as T);
  }

  removeAsync(path: string): Promise<void> {
    delete this.items[path];

    return Promise.resolve();
  }

  setAsync(path: string, value: string | object): Promise<void> {
    this.items[path] = value;

    return Promise.resolve();
  }
}
