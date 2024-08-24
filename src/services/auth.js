import { UsersCollection, SessionsCollection } from '../db/models/contacts.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constans/index.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const registerUser = async (payload) => {
  const existingUser = await UsersCollection.findOne({ email: payload.email });

  if (existingUser) {
    throw createHttpError(409, 'User already exists');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const user = await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  if (!user) {
    throw createHttpError(500, 'Failed to create user');
  }

  return user;
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({
    email: payload.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const cryptoHashCompare = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!cryptoHashCompare) {
    throw createHttpError(401, 'Incorrect password');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  const session = await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });

  if (!session) {
    throw createHttpError(500, 'Failed to create session');
  }

  return { accessToken: session.accessToken };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Refresh token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  const updatedSession = await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });

  if (!updatedSession) {
    throw createHttpError(500, 'Failed to refresh session');
  }

  return updatedSession;
};

export const logOutUser = async (sessionId) => {
  const deleteSession = await SessionsCollection.deleteOne({ _id: sessionId });

  if (deleteSession.deletedCount === 0) {
    throw createHttpError(500, 'failed');
  }
  return deleteSession;
};
