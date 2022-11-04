import bcrypt from 'bcrypt';
import { Attributes, FindOptions, Model, QueryOptionsWithWhere } from 'sequelize/types';
import { db } from '../config/db';
import { sign, signJti } from '../utils';
import { MemberAttribute } from './../models/member.model';

const salt = bcrypt.genSaltSync(10);
const DOMAIN = process.env.DOMAIN as string;
const JTI_SER = process.env.JTI_SER as string;

export function handleCreateMember(data: MemberAttribute) {
  return db.Member.findCreateFind({
    where: { username: data.username },
    defaults: { ...data },
    raw: true,
  });
}

export function findMember(options: FindOptions<Attributes<Model>>) {
  return db.Member.findOne(options);
}

export function hashPassword(password: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
}

export function comparePassword(password: string, hashPassword: string): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const comparePassword = await bcrypt.compare(password, hashPassword);
      resolve(comparePassword);
    } catch (error) {
      reject(error);
    }
  });
}

function getSub(): string {
  let jti: string = '';
  let possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
    jti += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return jti;
}

export function createToken(
  user: MemberAttribute,
  privateKey: string,
  expiresIn: string,
  isDashboard: boolean
) {
  const { password, ...others } = user;

  const jti: string = signJti({ ...others, isDashboard });

  return sign(
    {
      jti,
      iss: DOMAIN,
      aud: ['my-api-nodejs-with-typescript', DOMAIN],
      sub: getSub(),
      alg: 'HS256',
      key: '/BEGIN/ ' + JTI_SER,
      scope: 'email: g...@gmail.com',
    },
    privateKey,
    {
      expiresIn: expiresIn,
    }
  );
}

export async function createSession(memberId: number | string, token: string) {
  const session = await db.Session.findOne({ where: { memberId: memberId } });
  if (session) {
    return session.update({ token: token });
  }
  return db.Session.create({ memberId: memberId, token: token });
}
