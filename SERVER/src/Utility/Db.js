import client from '../Database/DbConnection';
import 'babel-polyfill';

class Database {
  static async addUser(values) {
    const query = {
      text: 'INSERT INTO users(first_name, last_name, email, password, status) VALUES($1, $2, $3, $4, $5)',
      values,
    };
    const result = await client.query(query);
    return result.rowCount;
  }

  static async getUsers(id) {
    if (id) {
      const query = {
        text: 'SELECT * FROM users WHERE id = $1',
        values: [id],
      };
      const result = await client.query(query);
      return result.rows;
    }
    const query = {
      text: 'SELECT * FROM users',
    };
    const result = await client.query(query);
    return result.rows;
  }

  static async addMessage(values) {
    const query = {
      text: 'INSERT INTO messages(subject, message, owner_id, date_time, status) VALUES($1, $2, $3, $4, $5) RETURNING *',
      values,
    };
    const result = await client.query(query);
    return result.rows;
  }

  static async updateMessage(values) {
    const query = {
      text: 'UPDATE messages SET subject=$1, message=$2, status=$3 WHERE id=$4',
      values,
    };
    const result = await client.query(query);
    return result.rowCount;
  }

  static async getMessages(id, userAccess, userId) {
    let query;
    if (id) {
      if (userAccess === 'inbox') {
        query = {
          text: 'SELECT a.*, b.receiver_id FROM messages a  INNER JOIN inboxes b ON a.id = b.msg_id and a.id =$1 and b.status !=$2',
          values: [id, 'deleted'],
        };
        const result = await client.query(query);
        return result.rows;
      }
      if (userAccess === 'delete') {
        query = {
          text: 'SELECT * FROM messages where id =$1 and status !=$2',
          values: [id, 'deleted'],
        };
        const result = await client.query(query);

        if (result.rowCount === 1) {
          query = {
            text: 'SELECT * FROM sents where msg_id =$1 and sender_id=$2 and status !=$3',
            values: [id, userId, 'deleted'],
          };
          const sentResult = await client.query(query);

          if (sentResult.rowCount === 1) {
            sentResult.deleteType = 'sents';
            return sentResult;
          }
          query = {
            text: 'SELECT * FROM inboxes where msg_id =$1 and receiver_id=$2 and status !=$3',
            values: [id, userId, 'deleted'],
          };
          const inboxResult = await client.query(query);
          inboxResult.deleteType = 'inboxes';
          return inboxResult;
        }
        return result.rows;
      }
      query = {
        text: 'SELECT * FROM messages where id =$1 and status !=$2',
        values: [id, 'deleted'],
      };
      const result = await client.query(query);
      return result.rows;
    }
    query = {
      text: 'SELECT * FROM messages where status !=$1',
      values: ['deleted'],
    };
    const result = await client.query(query);
    return result.rows;
  }

  static async deleteMessage(id, table) {
    const query = {
      text: `UPDATE ${table} SET status =$1 where msg_id = $2 RETURNING *`,
      values: ['deleted', id],
    };
    const result = await client.query(query);
    return result.rows;
  }

  static async insertInboxes(values) {
    const query = {
      text: 'INSERT INTO inboxes(msg_id, receiver_id, status, date_time) VALUES($1, $2, $3, $4) RETURNING *',
      values,
    };
    const result = await client.query(query);
    return result.rows;
  }

  static async insertSents(values) {
    const query = {
      text: 'INSERT INTO sents(msg_id, sender_id, status, date_time) VALUES($1, $2, $3, $4) RETURNING *',
      values,
    };
    const result = await client.query(query);
    return result.rows;
  }

  static async getInboxes(id) {
    const text = 'select a.msg_id, a.receiver_id, a.status, a.date_time, b.subject, b.message, b.owner_id from inboxes a INNER JOIN messages b ON a.msg_id = b.id and a.status !=$1';
    if (id) {
      const query = {
        text: `${text} and a.msg_id =$2`,
        values: ['deleted', id],
      };
      const result = await client.query(query);
      return result.rows;
    }
    const query = {
      text,
      values: ['deleted'],
    };
    const result = await client.query(query);
    return result.rows;
  }

  static async getSents(id) {
    if (id) {
      const query = {
        text: `select a.id, a.owner_id, a.subject, a.message, b.date_time, c.receiver_id 
        from messages a inner join sents b on a.id = b.msg_id and b.sender_id = $1 and b.status =$2
        inner join inboxes c on  a.id = c.msg_id`,
        values: [id, 'sent'],
      };
      const result = await client.query(query);
      return result.rows;
    }
    const text = 'select * from sents';
    const query = { text };
    const result = await client.query(query);
    return result.rows;
  }

  static async getGroups(userId) {
    const query = {
      text: 'select * from groups where owner_id = $1',
      values: [userId],
    };
    const result = await client.query(query);
    return result.rows;
  }

  static async createGroup(values) {
    const query = {
      text: 'INSERT INTO groups(owner_id, name) VALUES($1, $2) RETURNING *',
      values,
    };
    const result = await client.query(query);
    return result.rows;
  }
}
export default Database;
