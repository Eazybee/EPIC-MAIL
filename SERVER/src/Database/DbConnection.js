import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
const connectDb = () => {
  let connectionString;
  let client;
  if (process.env.NODE_ENV === 'test') {
    connectionString = process.env.DB_TEST;
    client = new Client({ connectionString });
  } else if (process.env.NODE_ENV === 'localTest') {
    connectionString = process.env.DB_LOCAL_TEST;
    client = new Client({ connectionString });
  } else if (process.env.NODE_ENV === 'production') {
    const {
      DB_USER, DB_PASSWORD, DB, DB_PORT, DB_HOST,
    } = process.env;
    connectionString = {
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB,
      port: parseInt(DB_PORT, 10),
      host: DB_HOST,
      ssl: true,
    };
    client = new Client(connectionString);
  } else {
    connectionString = process.env.DB_LOCAL;
    client = new Client({ connectionString });
  }

  client.connect();
  return client;
};
export default connectDb();
