export default interface ICache {
  getAsync<T>(key: string): Promise<T | null>;

  setAsync<T>(key: string, value: T, expiry?: Date): Promise<void>;

  removeAsync(key: string): Promise<void>;
}
