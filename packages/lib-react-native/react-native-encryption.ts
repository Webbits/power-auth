import IEncryption from "@powerauth/lib-contracts/IEncryption";
import { RSA } from "react-native-rsa-native";
import CryptoJS from "react-native-crypto-js";
import Aes from "react-native-aes-crypto";
import { KeyPair } from "@powerauth/lib-contracts/models/keyPair";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import OriginalCryptoJs from "crypto-js";

export class ReactNativeEncryption implements IEncryption {
  decryptAsymmetricAsync(
    encrypted: string,
    privateKey: string
  ): Promise<string> {
    return RSA.decrypt(encrypted, privateKey);
  }

  encryptAsymmetricAsync(plain: string, publicKey: string): Promise<string> {
    return RSA.encrypt(plain, publicKey);
  }

  signAsymmetricAsync(privateKey: string, value: string): Promise<string> {
    return RSA.sign(value, privateKey);
  }

  verifyAsymmetricAsync(
    publicKey: string,
    value: string,
    signature: string
  ): Promise<boolean> {
    return RSA.verify(value, signature, publicKey);
  }

  signSymmetricAsync(key: string, value: string): Promise<string> {
    return Promise.resolve(
      OriginalCryptoJs.HmacSHA256(value, key).toString(CryptoJS.enc.Base64)
    );
  }

  async decryptSymmetricAsync(
    encrypted: string,
    key: string,
    iv: string
  ): Promise<string> {
    return await Aes.decrypt(encrypted, key, iv, "aes-256-cbc");
  }

  async encryptSymmetricAsync(
    plain: string,
    key: string,
    iv: string
  ): Promise<string> {
    return await Aes.encrypt(plain, key, iv, "aes-256-cbc");
  }

  async generateAsymmetricKeyPairAsync(
    length: number = 4096
  ): Promise<KeyPair> {
    const keys = await RSA.generateKeys(length);

    return {
      privateKey: keys.private,
      publicKey: keys.public,
    };
  }

  async generateSymmetricKeyAsync(length: number = 32): Promise<string> {
    return Aes.randomKey(length);
  }

  uuid(): string {
    return uuidv4();
  }
}
