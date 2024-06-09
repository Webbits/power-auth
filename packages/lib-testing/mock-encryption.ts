import IEncryption from "@powerauth/lib-contracts/IEncryption";
import { KeyPair } from "@powerauth/lib-contracts/models/keyPair";
import { createUnsafeUuid } from "./utils/uuid";

export class MockEncryption implements IEncryption {
  decryptAsymmetricAsync(
    encrypted: string,
    _privateKey: string
  ): Promise<string> {
    const prefix = `[encrypted]`;

    if (!encrypted.startsWith(prefix)) {
      throw new Error("Could not decrypt");
    }

    const decrypted = encrypted.replace(prefix, "");

    return Promise.resolve(decrypted);
  }

  decryptSymmetricAsync(
    encrypted: string,
    _key: string,
    _iv: string
  ): Promise<string> {
    const prefix = `[encrypted]`;

    if (!encrypted.startsWith(prefix)) {
      throw new Error("Could not decrypt");
    }

    const decrypted = encrypted.replace(prefix, "");

    return Promise.resolve(decrypted);
  }

  encryptAsymmetricAsync(plain: string, _publicKey: string): Promise<string> {
    const prefix = `[encrypted]`;

    return Promise.resolve(`${prefix}${plain}`);
  }

  encryptSymmetricAsync(
    plain: string,
    _key: string,
    _iv: string
  ): Promise<string> {
    const prefix = `[encrypted]`;

    return Promise.resolve(`${prefix}${plain}`);
  }

  generateAsymmetricKeyPairAsync(_length?: number): Promise<KeyPair> {
    return Promise.resolve({
      privateKey: "mockedprivatekey",
      publicKey: "mockedpublickey",
    });
  }

  generateSymmetricKeyAsync(_length?: number): Promise<string> {
    return Promise.resolve("symmetrickey");
  }

  signAsymmetricAsync(_privateKey: string, value: string): Promise<string> {
    return Promise.resolve("[signed-assyemtric]" + value);
  }

  signSymmetricAsync(_key: string, value: string): Promise<string> {
    return Promise.resolve("[signed-symmetric]" + value);
  }

  uuid(): string {
    return createUnsafeUuid();
  }

  verifyAsymmetricAsync(
    _publicKey: string,
    _value: string,
    _signature: string
  ): Promise<boolean> {
    return Promise.resolve(false);
  }
}
