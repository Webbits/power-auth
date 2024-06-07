import ICloudStorage from "@powerauth/lib-contracts/ICloudStorage";
// @ts-ignore
import { createClient } from "webdav/dist/web";
import { FileStat, WebDAVClient } from "webdav";

export class WebdavCloudStorage implements ICloudStorage {
  private _client: WebDAVClient;
  private _rootPath: string = "/";

  constructor(endpoint: string, username: string, password: string) {
    this._client = createClient(endpoint, {
      username,
      password,
    });
  }

  static normalisePath(path: string): string {
    return path.replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/");
  }

  static joinPaths(...paths: string[]): string {
    return paths.map(WebdavCloudStorage.normalisePath).join("/");
  }

  async lsAsync(path: string): Promise<string[]> {
    const directoryContents = (await this._client.getDirectoryContents(
      this.fullPath(path)
    )) as FileStat[];

    return directoryContents.map((item) => item.filename);
  }

  existsAsync(path: string): Promise<boolean> {
    return this._client.exists(this.fullPath(path));
  }

  async getRawAsync(path: string): Promise<string | null> {
    try {
      const fileContents = await this._client.getFileContents(
        this.fullPath(path),
        {
          format: "text",
        }
      );

      return fileContents.toString();
    } catch (e) {
      return null;
    }
  }

  async getAsync<T extends object>(path: string): Promise<T | null> {
    try {
      const fileContents = await this._client.getFileContents(
        this.fullPath(path),
        {
          format: "text",
        }
      );

      return JSON.parse(fileContents.toString()) as T;
    } catch (e) {
      return null;
    }
  }

  removeAsync(path: string): Promise<void> {
    return this._client.deleteFile(this.fullPath(path));
  }

  async setAsync(path: string, value: string | object): Promise<void> {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }

    // Create directory if not exists
    const pathParts = path.split("/");
    pathParts.pop();
    const directory = pathParts.join("/");
    const directoryExists = await this._client.exists(this.fullPath(directory));

    if (!directoryExists) {
      await this._client.createDirectory(this.fullPath(directory), {
        recursive: true,
      });
    }

    try {
      await this._client.putFileContents(this.fullPath(path), value);
    } catch (e) {
      console.error("error saving files on path " + path, e);
    }
  }

  setRootPath(rootPath: string): void {
    this._rootPath = `/${WebdavCloudStorage.normalisePath(rootPath)}`;
  }

  createRootAsync(): Promise<void> {
    return this._client.createDirectory(this._rootPath);
  }

  getRootPath(): string {
    return this._rootPath;
  }

  private fullPath(path: string): string {
    return WebdavCloudStorage.joinPaths(this._rootPath, path);
  }
}
