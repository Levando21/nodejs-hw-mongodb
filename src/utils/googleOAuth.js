import * as fs from 'node:fs';
import path from 'node:path';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import createHttpError from 'http-errors';
dotenv.config();

const CONFIG = JSON.parse(
  fs.readFileSync(path.resolve('src', 'google-oauth-credentials.json'), {
    encoding: 'utf-8',
  }), //перетворення JSON на об'єкт
);

console.log(CONFIG);
const googleOAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  redirectUri: CONFIG['web']['redirect_uris'][0],
});

export function genereateAuthUrl() {
  return googleOAuth2Client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
}

export async function validateCode(code) {
  try {
    const response = await googleOAuth2Client.getToken(code);

    const idToken = response.tokens.id_token;

    if (!idToken) {
      throw new Error('ID Token not found in the response from Google');
    }

    // Verify the ID token
    return googleOAuth2Client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });
  } catch (error) {
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status <= 499
    ) {
      throw createHttpError(401, 'Unauthorized');
    } else {
      throw error;
    }
  }
}
