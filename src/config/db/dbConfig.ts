import { Dialect } from 'sequelize/types';

require('dotenv').config();

export interface DbConfig {
  DATABASE_NAME: string;
  DIALECT: Dialect;
  USERNAME: string;
  PASSWORD?: string;
  HOST: string;
}

export const dbConfig: DbConfig = {
  DATABASE_NAME: `${process.env.DB_NAME}`,
  DIALECT: `${process.env.DB_DIALECT}` as Dialect,
  USERNAME: `${process.env.DB_USERNAME}`,
  PASSWORD: `${process.env.DB_PASSWORD}`,
  HOST: process.env.DB_HOST as string,
};
