export default interface ISecureLocalStorage {
  getAsync<T>(path: string): Promise<T | null>;

  removeAsync(path: string): Promise<void>;

  setAsync(path: string, value: string | object): Promise<void>;
}
