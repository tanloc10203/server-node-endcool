import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db';
import log from '../logger';
import {
  comparePassword,
  createSession,
  createToken,
  emailService,
  findMember,
  handleCreateMember,
  hashPassword,
} from '../services';
import { decode, decodeJti, LoginInterface, Payload, PayloadEmail } from '../utils';
import { Member, MemberAttribute } from './../models/member.model';

const accessTokenTtl = process.env.ACCESS_TOKEN_TTL as string;
const refreshTokenTtl = process.env.REFRESH_TOKEN_TTL as string;
const ACCESS_TOKEN_PRIVATE_KEY = process.env.ACCESS_TOKEN_PRIVATE_KEY as string;
const REFRESH_TOKEN_PRIVATE_KEY = process.env.REFRESH_TOKEN_PRIVATE_KEY as string;
const URL_CLIENT = process.env.URL_CLIENT as string;
const ENVIRONMENTS = process.env.NODE_ENV;

export async function createMember(req: Request, res: Response) {
  try {
    const dataInput: Member = req.body;
    const { username, password, lastName, firstName, role } = dataInput;

    if (username && password && lastName && firstName) {
      try {
        const hashPws = await hashPassword(password);

        const newData: MemberAttribute = {
          ...dataInput,
          role: role ? role : 'MEMBER',
        };

        const [response, created] = await handleCreateMember({ ...newData, password: hashPws });

        if (!created) {
          return res.status(200).json({ message: 'Username was exist', error: true });
        }

        return res.status(201).json({ message: 'Create success', error: false });
      } catch (error) {
        if (error instanceof Error) {
          log.error(error.message);
          return res.status(400).json({ message: error.message, error: error.name });
        }
        log.error(error);
      }
    } else
      return res.status(404).json({
        message: 'Missing parameter username or password or lastName or firstName!!!',
        error: true,
      });
  } catch (error) {
    res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: true });
    log.error(error);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const dataLogin: LoginInterface = req.body;
    const { username, password, isDashboard } = dataLogin;

    if (!username || !password) {
      return res
        .status(404)
        .json({ message: 'Missing parameter username or password', error: true });
    } else {
      try {
        const response = await findMember({ where: { username: username } });

        if (!response) {
          return res.status(401).json({ message: 'Username not exist', error: true });
        }

        const member: MemberAttribute = response?.get();

        const { password: prePassword } = member;

        const isValid = await comparePassword(password, prePassword);

        if (!isValid) {
          return res.status(400).json({ message: 'Password not match', error: true });
        }

        if (isDashboard) {
          const user: Member = response.get();

          // * Check user not role login dashboard require role = ['ADMIN', 'STAFF', 'SHIPPER']
          if (user.role === 'MEMBER') {
            return res.status(403).json({ message: 'You are not role!', error: true });
          }
        }

        // * Create access token
        const accessToken = createToken(
          member,
          ACCESS_TOKEN_PRIVATE_KEY,
          accessTokenTtl,
          isDashboard as boolean // * Check is Dashboard or HomePage for Login
        );

        // * create refresh token
        const refreshToken = createToken(
          member,
          REFRESH_TOKEN_PRIVATE_KEY,
          refreshTokenTtl,
          isDashboard as boolean // * Check is Dashboard or HomePage for Login
        );

        if (isDashboard) {
          res.cookie('refreshTokenDb', refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'none',
            maxAge: 3.154e10, // 1 year
          });
        } else {
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'none',
            maxAge: 3.154e10, // 1 year
          });
        }

        // * Create Session:
        await createSession(member.id as number, refreshToken);

        res.json({ message: 'Logged in Success', error: false, accessToken, isDashboard });
      } catch (error) {
        if (error instanceof Error) {
          log.error(error.message);
          return res.status(400).json({ message: error.message, error: error.name });
        }
        log.error(error);
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: true });
    log.error(error);
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(401).json({ error: true, message: "You're not authenticated!!!" });

    // * DECODE REFRESH TOKEN
    const response = await decode(refreshToken, REFRESH_TOKEN_PRIVATE_KEY);
    const payload = response.payload as Payload;

    if (!response || !payload.jti)
      return res.status(403).json({ error: true, message: 'Token is not valid!' });

    // * GET MEMBER
    const hashJti: MemberAttribute = JSON.parse(decodeJti(payload.jti));

    if (!hashJti) return res.status(403).json({ error: true, message: 'Jti is not valid!' });

    // * CREATE NEW ACCESS AND REFRESH TOKEN
    const newAccessToken = createToken(
      hashJti,
      ACCESS_TOKEN_PRIVATE_KEY,
      accessTokenTtl,
      hashJti.isDashboard // * Check is Dashboard or HomePage for Login
    );

    const newRefreshToken = createToken(
      hashJti,
      REFRESH_TOKEN_PRIVATE_KEY,
      refreshTokenTtl,
      hashJti.isDashboard // * Check is Dashboard or HomePage for Login
    );

    try {
      await createSession(hashJti.id as number, newRefreshToken);
    } catch (error) {
      if (error instanceof Error)
        return res.status(403).json({ error: true, message: error.message });
    }

    // * SET COOKIES NEW REFRESH TOKEN
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'none',
      maxAge: 3.154e10, // 1 year
    });

    res.status(200).json({
      error: false,
      message: 'Refresh Successfully',
      accessToken: newAccessToken,
      isDashboard: hashJti.isDashboard,
    });
  } catch (error) {
    res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: error });
    log.error(error);
  }
}

export async function refreshTokenDb(req: Request, res: Response) {
  try {
    const refreshTokenDb = req.cookies.refreshTokenDb;

    if (!refreshTokenDb)
      return res.status(401).json({ error: true, message: "You're not authenticated!!!" });

    // * DECODE REFRESH TOKEN
    const response = await decode(refreshTokenDb, REFRESH_TOKEN_PRIVATE_KEY);
    const payload = response.payload as Payload;

    if (!response || !payload.jti)
      return res.status(403).json({ error: true, message: 'Token is not valid!' });

    // * GET MEMBER
    const hashJti: MemberAttribute = JSON.parse(decodeJti(payload.jti));

    if (!hashJti) return res.status(403).json({ error: true, message: 'Jti is not valid!' });

    // * CREATE NEW ACCESS AND REFRESH TOKEN
    const newAccessToken = createToken(
      hashJti,
      ACCESS_TOKEN_PRIVATE_KEY,
      accessTokenTtl,
      hashJti.isDashboard // * Check is Dashboard or HomePage for Login
    );

    const newRefreshToken = createToken(
      hashJti,
      REFRESH_TOKEN_PRIVATE_KEY,
      refreshTokenTtl,
      hashJti.isDashboard // * Check is Dashboard or HomePage for Login
    );

    try {
      await createSession(hashJti.id as number, newRefreshToken);
    } catch (error) {
      if (error instanceof Error)
        return res.status(403).json({ error: true, message: error.message });
    }

    // * SET COOKIES NEW REFRESH TOKEN
    res.cookie('refreshTokenDb', newRefreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'none',
      maxAge: 3.154e10, // 1 year
    });

    res.status(200).json({
      error: false,
      message: 'Refresh Successfully',
      accessToken: newAccessToken,
      isDashboard: hashJti.isDashboard,
    });
  } catch (error) {
    res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: error });
    log.error(error);
  }
}

export async function logout(req: Request, res: Response) {
  try {
    // @ts-ignore
    const member: MemberAttribute = req.member;
    await db.Session.destroy({ where: { memberId: member.id } });
    res.clearCookie('refreshToken');
    res.status(200).json({ error: false, message: 'Log out succeed.' });
  } catch (error) {
    res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: error });
    log.error(error);
  }
}

export async function changePw(req: Request, res: Response) {
  try {
    const { email, username } = req.body;

    if (!email && !username)
      return res.status(404).json({ error: true, message: 'Missing email or username' });

    const response = await findMember({ where: { username: username } });

    const member: Member = response?.get();

    if (!member)
      return res.status(401).json({ error: true, message: 'Not found member by username' });

    const keyChangePw: string = uuidv4();

    const urlVerify: string = `${URL_CLIENT}/verify-email/${keyChangePw}`;

    const dataSend: PayloadEmail = {
      data: member,
      urlVerify,
      sendEmail: email,
    };

    try {
      await emailService.sendEmailVerifyChangePw(dataSend);
      await response?.update({ keyChangePw: keyChangePw });

      res.status(200).json({ error: false, message: 'Send Email successfully.' });
    } catch (error) {
      if (error instanceof Error)
        return res.status(400).json({ error: error.name, message: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: error });
    log.error(error);
  }
}

export async function verifyPwChange(req: Request, res: Response) {
  try {
    const { token } = req.query;
    const { password } = req.body;

    if (!token && !password)
      return res.status(404).json({ error: true, message: 'Missing token or password' });

    try {
      const response = await findMember({ where: { keyChangePw: token } });

      if (!response)
        return res
          .status(401)
          .json({ error: true, message: 'The member not found. Token not valid' });

      const hashPws = await hashPassword(password);

      await response.update({ password: hashPws, keyChangePw: 'succeed' });

      res.status(200).json({ error: false, message: 'The password change succeed.' });
    } catch (error) {
      if (error instanceof Error)
        return res.status(400).json({ error: error.name, message: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'ERROR FROM SERVER !!!', error: error });
    log.error(error);
  }
}
