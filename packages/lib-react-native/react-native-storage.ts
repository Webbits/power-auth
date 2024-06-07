import * as SecureStore from "expo-secure-store";
import ISecureLocalStorage from "@powerauth/lib-contracts/ISecureLocalStorage"; // This class uses the SecureStore API from Expo to store data securely on the device.

// This class uses the SecureStore API from Expo to store data securely on the device.
// The bytes limit per key is 2048, so we need to split the data into chunks if it's bigger than that.
export class ReactNativeStorage implements ISecureLocalStorage {
  SECURE_STORE_CHUNK_SIZE = 2048;

  async exists(key: string): Promise<boolean> {
    const result = await SecureStore.getItemAsync(this.getChunkKey(key));

    return result !== null;
  }

  async getAsync<T>(key: string): Promise<T | null> {
    // First try to get the first chunk
    const firstChunk = await SecureStore.getItemAsync(this.getChunkKey(key));

    if (firstChunk === null) {
      return null;
    }

    // The first chunk exists, so we need to get the rest of the chunks
    const chunks = [firstChunk];
    let index = 1;
    let hasMoreChunks = true;

    while (hasMoreChunks) {
      const chunk = await SecureStore.getItemAsync(
        this.getChunkKey(key, index)
      );

      if (chunk === null) {
        hasMoreChunks = false;
        continue;
      }

      chunks.push(chunk);
      index++;
    }

    // Merge the chunks into one string
    const value = chunks.join("");

    try {
      return JSON.parse(value) as T;
    } catch (e) {
      return value as T;
    }
  }

  async removeAsync(key: string): Promise<void> {
    let hasMoreChunks = true;
    let index = 0;

    while (hasMoreChunks) {
      const exists = await this.exists(this.getChunkKey(key, index));

      if (!exists) {
        hasMoreChunks = false;
        continue;
      }

      await SecureStore.deleteItemAsync(this.getChunkKey(key, index));
      index++;
    }
  }

  async setAsync(key: string, value: string | object): Promise<void> {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }

    const chunks = this.chunk(value);

    await Promise.all(
      chunks.map((chunk, index) => {
        return SecureStore.setItemAsync(this.getChunkKey(key, index), chunk);
      })
    );
  }

  private getChunkKey(key: string, index: number = 0): string {
    return `${key}_chunkerv1_${index}`;
  }

  private chunk(value: string): string[] {
    const chunks = [];

    for (let i = 0; i < value.length; i += this.SECURE_STORE_CHUNK_SIZE) {
      chunks.push(value.substring(i, i + this.SECURE_STORE_CHUNK_SIZE));
    }

    return chunks;
  }
}
