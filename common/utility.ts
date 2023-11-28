import * as dotenv from "dotenv";

dotenv.config();
export const dbConfig: any = {
  dbname: process.env.DBNAME,
  dbport: process.env.DBPORT,
  dbhost: process.env.DB_HOST,
  dbuser: process.env.DBUSER,
  dbpassword: process.env.DBPASSWORD,
};
