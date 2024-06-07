import { KeyPair } from "./models/keyPair";

export default interface IEncryption {
  decryptSymmetricAsync(
    encrypted: string,
    key: string,
    iv: string
  ): Promise<string>;

  encryptSymmetricAsync(
    plain: string,
    key: string,
    iv: string
  ): Promise<string>;

  decryptAsymmetricAsync(
    encrypted: string,
    privateKey: string
  ): Promise<string>;

  encryptAsymmetricAsync(plain: string, publicKey: string): Promise<string>;

  signAsymmetricAsync(privateKey: string, value: string): Promise<string>;

  verifyAsymmetricAsync(
    publicKey: string,
    value: string,
    signature: string
  ): Promise<boolean>;

  signSymmetricAsync(key: string, value: string): Promise<string>;

  generateAsymmetricKeyPairAsync(length?: number): Promise<KeyPair>;

  generateSymmetricKeyAsync(length?: number): Promise<string>;

  uuid(): string;
}
