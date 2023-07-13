// // node mailer configs for sending emails with gmail (googleapis/oauth2)

// import { createTransport, TransportOptions } from 'nodemailer';

// import { TResetMailData } from '../../app/modules/auth/email-password/auth.interfaces';

// import { configs } from './env.configs';
// import { googleConfigs } from './google.configs';

// const { oauth2Playground, authScopes, getTokens, userInfoUrl, getAccountInfo } = googleConfigs;

// oauth2Playground.setCredentials({ refresh_token: configs.googlePlaygroundRefresh });

// export const sendMailWithGmail = async (data: TResetMailData): Promise<unknown> => {
//   try {
//     const accessToken = await oauth2Playground.getAccessToken();

//     const transporter = createTransport({
//       service: 'gmail',
//       auth: {
//         type: 'OAuth2',
//         user: 'aminul.islam01101@gmail.com',
//         clientId: configs.googleClientId,
//         clientSecret: configs.googleClientSecret,
//         refreshToken: configs.googlePlaygroundRefresh,
//         accessToken,
//       },
//     } as TransportOptions);

//     const mailData = {
//       to: data.to, // list of receivers
//       subject: data.subject,
//       text: data.text,
//       html: data.html,
//     };

//     const info = await transporter.sendMail(mailData);

//     return info;
//   } catch (error) {
//     console.log(error);
//   }
// };
// // node mailer configs for sending emails with nodemailer itself

// export const sendMailWithNodeMailer = async (data: TResetMailData): Promise<unknown> => {
//   try {
//     const transporter = createTransport({
//       service: 'gmail',
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: false,
//       auth: {
//         user: configs.senderEmail,
//         pass: configs.senderPass,
//       },
//     } as TransportOptions);

//     const mailData = {
//       from: configs.senderEmail, // sender address
//       to: data.to, // list of receivers
//       subject: data.subject,
//       text: data.text,
//       html: data.html,
//     };

//     const info = await transporter.sendMail(mailData);

//     return info;
//   } catch (error) {
//     console.log(error);
//   }
// };
