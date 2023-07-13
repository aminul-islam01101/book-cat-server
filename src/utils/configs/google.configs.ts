// import axios from 'axios';
// import { google } from 'googleapis';

// import { AccountInfo } from '../../app/modules/auth/google/google.auth.interfaces';

// import { configs } from './env.configs';

// const { OAuth2 } = google.auth;

// const authScopes = [
//   'https://www.googleapis.com/auth/userinfo.email',
//   'https://www.googleapis.com/auth/userinfo.profile',
// ];
// // google api endpoints
// const userInfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';

// const oauth2Client = new OAuth2(
//   configs.googleClientId,
//   configs.googleClientSecret,
//   configs.googleLoginCallback
// );
// const oauth2Playground = new OAuth2(
//   configs.googleClientId,
//   configs.googleClientSecret,
//   configs.googlePlaygroundRedirect
// );

// // get access token and refresh token from google
// const getTokens = async (
//   code: string
// ): Promise<{ accessToken: string | null | undefined; refreshToken: string | null | undefined }> => {
//   const {
//     tokens: { access_token: accessToken, refresh_token: refreshToken },
//   } = await oauth2Client.getToken(code);
//   return { accessToken, refreshToken };
// };
// const getAccountInfo: (accessToken: string) => Promise<AccountInfo> = async (
//   accessToken: string
// ) => {
//   const response = await axios.get(userInfoUrl, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   return response.data as AccountInfo;
// };

// export const googleConfigs = {
//   oauth2Client,
//   oauth2Playground,
//   authScopes,
//   userInfoUrl,
//   getTokens,
//   getAccountInfo,
// };
