import { Router } from 'express';
import {
  createMember,
  login,
  logout,
  refreshToken,
  changePw,
  verifyPwChange,
  refreshTokenDb,
} from '../controllers';
import { authorization, getUser, requireDataInput, verifyTokenDashboard } from '../middleware';

const authRoute = Router();

authRoute.post('/register', requireDataInput, createMember);
authRoute.post('/login', requireDataInput, login);

authRoute.get('/login/user', [authorization], getUser);
authRoute.get('/login/user-dashboard', [authorization, verifyTokenDashboard], getUser);

authRoute.get('/refresh', refreshToken);
authRoute.get('/refresh-db', refreshTokenDb);

authRoute.post('/logout', [authorization], logout);
authRoute.post('/forgot-password', changePw);
authRoute.post('/verify-change-password', verifyPwChange);

export default authRoute;
