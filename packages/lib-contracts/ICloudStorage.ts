export default interface ICloudStorage {
  lsAsync(path: string): Promise<string[]>;

  existsAsync(path: string): Promise<boolean>;

  getRawAsync(path: string): Promise<string | null>;

  getAsync<T extends object>(path: string): Promise<T | null>;

  removeAsync(path: string): Promise<void>;

  setAsync(path: string, value: string | object): Promise<void>;

  setRootPath(rootPath: string): void;

  createRootAsync(): Promise<void>;

  getRootPath(): string;
}
