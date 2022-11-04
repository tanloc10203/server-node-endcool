import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import { decode, decodeJti, Payload } from '../utils';
import { MemberAttribute } from './../models/member.model';

const ACCESS_TOKEN_PRIVATE_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY as string;
// const REFRESH_TOKEN_PRIVATE_KEY = process.env.REFRESH_TOKEN_PRIVATE_KEY as string;

export function requireDataInput(req: Request, res: Response, next: NextFunction) {
  if (_.isEmpty(req.body)) {
    return res.status(404).json({ message: "Is't has data input" });
  }

  return next();
}

export async function authorization(req: Request, res: Response, next: NextFunction) {
  let accessToken = req.headers.authorization;

  if (!accessToken)
    return res.status(401).json({ error: true, message: "You're not authenticated" });

  accessToken = accessToken?.split(' ')[1];

  // console.log('check accessToken: ', accessToken);

  try {
    const response = await decode(accessToken as string, ACCESS_TOKEN_PRIVATE_KEY);

    // console.log('check response: ', response);

    const payload = response.payload as Payload;

    // console.log('check response and payload: ', { response, payload });

    if (!response || !payload.jti)
      return res
        .status(200)
        .json({ error: true, code: 401, message: 'Token or Jti is not valid!' });

    const hashJti: MemberAttribute = JSON.parse(decodeJti(payload.jti));

    // @ts-ignore
    req.member = hashJti;

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError')
        return res.status(200).json({ error: true, code: 401, message: error.message });
      else return res.status(200).json({ error: true, code: 500, message: error.message });
    }
  }
}

export function verifyTokenAndAdmin(req: Request, res: Response, next: NextFunction) {
  authorization(req, res, () => {
    try {
      // @ts-ignore
      const member: MemberAttribute = req.member;
      if (member.role === 'ADMIN') next();
    } catch (error) {
      res.status(403).json({ error: error, message: "You're not allowed to do that!!!" });
    }
  });
}

export function verifyTokenDashboard(req: Request, res: Response, next: NextFunction) {
  authorization(req, res, () => {
    try {
      // @ts-ignore
      const member: MemberAttribute = req.member;
      if (member.role !== 'MEMBER') {
        // @ts-ignore
        req.member = member;
        next();
      } else {
        res.status(403).json({ message: "You're not allow!" });
      }
    } catch (error) {
      res.status(403).json({ error: error, message: "You're not allowed to do that!!!" });
    }
  });
}

export function verifyTokenStaff(req: Request, res: Response, next: NextFunction) {
  authorization(req, res, () => {
    try {
      // @ts-ignore
      const member: MemberAttribute = req.member;

      if (member.role === 'ADMIN' || member.role === 'STAFF') next();
    } catch (error) {
      res.status(403).json({ error: error, message: "You're not allowed to do that!!!" });
    }
  });
}

export function verifyTokenShipper(req: Request, res: Response, next: NextFunction) {
  authorization(req, res, () => {
    try {
      // @ts-ignore
      const member: MemberAttribute = req.member;
      if (member.role === 'SHIPPER') next();
    } catch (error) {
      res.status(403).json({ error: true, message: "You're not allowed to do that!!!" });
    }
  });
}

export function getUser(req: Request, res: Response) {
  try {
    // @ts-ignore
    const member: MemberAttribute = req.member;
    if (!member) return res.status(400).json({ error: false, message: 'Get user failed' });
    res.status(200).json({ error: false, message: 'Get user success', data: member });
  } catch (error) {
    res.status(403).json({ error: error, message: 'Error' });
  }
}
