import { UsersCollection, SessionsCollection } from '../db/models/contacts.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constans/index.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export const registerUser = async (payload) => {
  const encryptedPassword = bcrypt.hash({ password: payload.password }, 10);
  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const userLoginByEmail = await UsersCollection.findOne({
    email: payload.email,
  });

  if (!userLoginByEmail) {
    throw createHttpError(404, 'Not found');
  }

  const cryptoHashCompare = await bcrypt.compare(
    payload.password,
    userLoginByEmail.password,
  );

  if (!cryptoHashCompare) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: userLoginByEmail._id });

  const acsessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return SessionsCollection.create({
    userId: userLoginByEmail._id,
    acsessToken,
    refreshToken,
    acsessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};
