import ICloudStorage from "@powerauth/lib-contracts/ICloudStorage";
import * as Path from "path";

type File = {
  path: string;
  value: any;
};

export class MockCloudStorage implements ICloudStorage {
  private _rootPath: string = "/";
  private _files: File[] = [];

  lsAsync(path: string): Promise<string[]> {
    const paths = this._files
      .filter((file) => file.path.startsWith(this.fullPath(path)))
      .map((file) => file.path);

    return Promise.resolve(paths);
  }

  existsAsync(path: string): Promise<boolean> {
    const exists = this._files.some(
      (file) => file.path === this.fullPath(path)
    );

    return Promise.resolve(exists);
  }

  getAsync<T>(path: string): Promise<T | null> {
    const file = this._files.find((file) => file.path === this.fullPath(path));

    if (file) {
      return Promise.resolve(file.value as T);
    } else {
      return Promise.resolve(null);
    }
  }

  removeAsync(path: string): Promise<void> {
    const index = this._files.findIndex(
      (file) => file.path === this.fullPath(path)
    );

    if (index >= 0) {
      this._files.splice(index, 1);
    }

    return Promise.resolve();
  }

  setAsync(path: string, value: string | object): Promise<void> {
    const index = this._files.findIndex(
      (file) => file.path === this.fullPath(path)
    );

    if (index >= 0) {
      this._files[index].value = value;
    } else {
      this._files.push({ path: this.fullPath(path), value });
    }

    return Promise.resolve();
  }

  setRootPath(rootPath: string): void {
    if (!rootPath.endsWith("/")) {
      rootPath += "/";
    }

    if (!rootPath.startsWith("/")) {
      rootPath = "/" + rootPath;
    }

    this._rootPath = rootPath;
  }

  createRootAsync(): Promise<void> {
    return Promise.resolve();
  }

  getRootPath(): string {
    return this._rootPath;
  }

  getRawAsync(path: string): Promise<string | null> {
    const file = this._files.find((file) => file.path === this.fullPath(path));

    return file?.value ?? null;
  }

  private fullPath(path: string): string {
    return Path.join(this._rootPath, path);
  }
}
