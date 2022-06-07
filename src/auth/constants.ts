import * as dotenv from 'dotenv'
dotenv.config({path: `.env.${process.env.NODE_ENV}`})
export const jwtConstants = {
    secret:process.env.JWT_SECERT,
    signOptions: { expiresIn: process.env.JWT_EXPIRESIN },
  };