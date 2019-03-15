import client from './DbConnection';

require('babel-polyfill');

class Database {
  static async insert(query) {
    const result = await client.query(query);
    return result;
  }
}
export default Database;
