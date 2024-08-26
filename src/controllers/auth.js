import {
  registerUser,
  loginUser,
  refreshUsersSession,
  logOutUser,
  sendResetEmail,
} from '../services/auth.js';
import createHttpError from 'http-errors';
import { ONE_DAY } from '../constans/index.js';

export const registerUserController = async (req, res, next) => {
  const user = await registerUser(req.body);

  if (!user) {
    return createHttpError(404, 'User not found');
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res, next) => {
  const user = await loginUser(req.body);
  res.cookie('refreshToken', user.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', user._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });

  if (!user) {
    return createHttpError(404, 'User not found');
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully logined a user!',
    data: user,
  });
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logOutUserController = async (req, res, next) => {
  if (req.cookies.sessionId) {
    await logOutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const sendResetEmailController = async (req, res) => {
  const { email } = req.body;
  await sendResetEmail(email);

  res.send({ status: 200, message: 'Cool', data: {} });
};
