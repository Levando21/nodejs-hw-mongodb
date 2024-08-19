import { registerUser, loginUser } from '../services/auth.js';
import createHttpError from 'http-errors';

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

  if (!user) {
    return createHttpError(404, 'User not found');
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully logined a user!',
    data: user,
  });
};
