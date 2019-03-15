import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
const connectDb = () => {
  const client = new Client({
    connectionString: process.env.DbConnection,
  });
  client.connect();
  return client;
};
export default connectDb();
