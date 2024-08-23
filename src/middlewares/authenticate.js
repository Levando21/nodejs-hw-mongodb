import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

import { UsersCollection, SessionsCollection } from '../db/models/contacts.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const session = await SessionsCollection.findOne({
      accessToken: token,
      userId: decodedToken.id,
    });

    if (!session || session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await UsersCollection.findById(decodedToken.id);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
