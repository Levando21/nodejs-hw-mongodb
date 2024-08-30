import { UsersCollection, SessionsCollection } from '../db/models/contacts.js';
import { FIFTEEN_MINUTES, ONE_DAY, SMTP } from '../constans/index.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { sendMail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import fs from 'node:fs';
import path from 'node:path';
import handlebars from 'handlebars';
import dotenv from 'dotenv';
dotenv.config();
import crypto from 'node:crypto';

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

export const sendResetEmail = async (email) => {
  const user = await UsersCollection.findOne({ email: email });
  console.log(email);
  console.log(!user);

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  const templateSource = fs.readFileSync(
    path.resolve('src/templates/reset-password.hbs'),
    { encoding: 'UTF-8' },
  );
  const template = handlebars.compile(templateSource);
  const html = template({ name: user.name, resetToken });
  console.log(resetToken);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  return await sendMail({
    from: SMTP.FROM_EMAIL,
    to: email,
    subject: 'Reset your pass',
    html,
  });
};

export const resetPassword = async (password, token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  console.log(password);
  console.log(process.env.JWT_SECRET);
  console.log('Token decoded:', decoded);

  const user = await UsersCollection.findOne({
    _id: decoded.sub,
    email: decoded.email,
  });

  console.log(user);

  if (user === null) {
    throw createHttpError(404, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedUser = await UsersCollection.findOneAndUpdate(
    { _id: user._id },
    { password: hashedPassword },
    { new: true },
  );

  if (!updatedUser) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
  console.log(updatedUser);

  return updatedUser;
};
