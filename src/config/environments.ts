export interface IEnvironments {
  APP_PORT: number;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  JWT_SECRET_KEY: string;
  JWT_EXPIRATION_TIME: number;
  FORGOT_PASSWORD_URL: string;
  JWT_REFRESH_EXPIRATION_TIME: string;
  SENDGRID_KEY: string;
  SENDGRID_SENDER_EMAIL: string;
}

export const environments = () => ({
  APP_PORT: parseInt(process.env.APP_PORT, 10) || 3000,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: parseInt(process.env.DATABASE_PORT, 10),
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
  FORGOT_PASSWORD_URL: process.env.FORGOT_PASSWORD_URL,
  JWT_REFRESH_EXPIRATION_TIME: process.env.JWT_REFRESH_EXPIRATION_TIME,
  SENDGRID_KEY: process.env.SENDGRID_KEY,
  SENDGRID_SENDER_EMAIL: process.env.SENDGRID_SENDER_EMAIL,
});
