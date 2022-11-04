import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import { ResponseDecodeJWT } from './commonInterface.utils';

const JTI_SER = process.env.JTI_SER as string;

export function sign(object: Object, privateKey: string, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, privateKey, options);
}

export function decode(token: string, privateKey: string): Promise<ResponseDecodeJWT> {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, privateKey, (error, payload) => {
        if (error) return reject(error);
        resolve({ valid: true, expired: false, payload: payload });
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.name);

        if (error.name === 'TokenExpiredError')
          reject({
            valid: false,
            expired: error.message,
            decoded: null,
          });
      }
    }
  });
}

export function signJti(others: Object): string {
  return CryptoJS.AES.encrypt(JSON.stringify(others), JTI_SER).toString();
}

export function decodeJti(jti: string): string {
  return CryptoJS.AES.decrypt(jti, JTI_SER).toString(CryptoJS.enc.Utf8);
}
