import ICache from "@powerauth/lib-contracts/ICache";

class MemoryCache implements ICache {
  private _values: { [key: string]: { expiry?: Date; value: unknown } } = {};

  getAsync<T>(key: string): Promise<T | null> {
    const result = this._values[key];

    if (result === undefined) {
      return Promise.resolve(null);
    }

    if (result.expiry && result.expiry < new Date()) {
      delete this._values[key];
      return Promise.resolve(null);
    }

    return Promise.resolve(this._values[key].value as T);
  }

  setAsync<T>(key: string, value: T, expiry?: Date | undefined): Promise<void> {
    this._values[key] = { value, expiry };
    return Promise.resolve();
  }

  removeAsync(key: string): Promise<void> {
    delete this._values[key];
    return Promise.resolve();
  }
}

export default MemoryCache;
