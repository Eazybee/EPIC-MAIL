import client from '../Database/DbConnection';
import 'babel-polyfill';

class Database {
  static async getUserId(email) {
    const query = {
      text: 'SELECT id FROM users WHERE email = $1',
      values: [email.toLowerCase()],
    };
    const result = await client.query(query);
    return result.rows;
  }

  static async addUser(values) {
    const query = {
      text: 'INSERT INTO users(first_name, last_name, email, password, status) VALUES($1, $2, $3, $4, $5) RETURNING *',
      values,
    };
    const result = await client.query(query);
    return result.rows;
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

  static async addMessage(values, type, receiverId) {
    const query = {
      text: 'INSERT INTO messages(subject, message, owner_id, date_time, status) VALUES($1, $2, $3, $4, $5) RETURNING *',
      values,
    };
    const result = await client.query(query);
    if (type === 'draft') {
      const msgId = result.rows[0].id;
      const query2 = {
        text: 'INSERT INTO drafts(msg_id, receiver_id, date_time, status) VALUES($1, $2, $3, $4) RETURNING *',
        values: [msgId, receiverId, values[3], 'draft'],
      };
      await client.query(query2);
    }

    return result.rows;
  }

  static async updateDraft(values) {
    let query = {
      text: 'UPDATE messages set subject=$1, message=$2 where id =$3 RETURNING *',
      values: [values[0], values[1], values[4]],
    };
    const result = await client.query(query);

    query = {
      text: 'UPDATE drafts set date_time=$1, receiver_id=$2 where msg_id =$3 RETURNING *',
      values: [values[2], values[3], values[4]],
    };
    await client.query(query);
    return result.rows;
  }

  static async sendDraft(values, values2) {
    let query = {
      text: 'UPDATE messages SET subject=$1, message=$2, status=$3 WHERE id=$4',
      values,
    };
    const result = await client.query(query);
    query = {
      text: 'UPDATE drafts SET receiver_id=$1, date_time=$2, status=$3 WHERE msg_id=$4',
      values: values2,
    };
    await client.query(query);
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
      if (userAccess === 'sent') {
        query = {
          text: `
          SELECT a.id, a.subject, a.message, b.date_time, c.receiver_id, d.email, d.first_name 
          FROM messages a  INNER JOIN sents b 
          ON a.id = b.msg_id and a.id =$1 and a.owner_id = $2 and b.status !=$3
          INNER JOIN inboxes c 
          ON a.id = c.msg_id
          INNER JOIN users d
          ON d.id = c.receiver_id`,
          values: [id, userId, 'deleted'],
        };
        const result = await client.query(query);
        return result.rows;
      }
      if (userAccess === 'draft') {
        query = {
          text: `
                 SELECT a.owner_id, b.msg_id FROM messages a 
                 inner join drafts b 
                 on a.id =$1 and a.owner_id =$2 and b.status =$3 and a.id = b.msg_id`,
          values: [id, userId, 'draft'],
        };
        const result = await client.query(query);
        return result.rows;
      }
      if (userAccess === 'deleteInbox') {
        query = {
          text: 'SELECT * FROM inboxes where msg_id =$1 and receiver_id=$2 and status !=$3',
          values: [id, userId, 'deleted'],
        };
        const inboxResult = await client.query(query);
        inboxResult.deleteType = 'inboxes';
        return inboxResult;
      }
      if (userAccess === 'deleteSent') {
        query = {
          text: `SELECT a.*, b.owner_id FROM sents a 
                 inner join messages b 
                 on a.msg_id =$1 and a.sender_id=$2 and a.status !=$3
                 and b.id = a.msg_id`,
          values: [id, userId, 'deleted'],
        };
        const sentResult = await client.query(query);
        sentResult.deleteType = 'sents';
        return sentResult;
      }
      if (userAccess === 'deleteDraft') {
        query = {
          text: `SELECT a.*, b.owner_id FROM drafts a 
                 inner join messages b 
                 on a.msg_id =$1 and a.status =$2 and a.msg_id = b.id and b.owner_id =$3`,
          values: [id, 'draft', userId],
        };
        const sentResult = await client.query(query);
        sentResult.deleteType = 'drafts';
        return sentResult;
      }

      query = {
        text: 'SELECT * FROM drafts where id =$1 and status !=$2',
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
    const text = 'select a.msg_id, a.receiver_id, a.status, a.date_time, b.subject, b.message, b.owner_id, c.email from inboxes a INNER JOIN messages b ON a.msg_id = b.id and a.status !=$1 INNER JOIN users c ON b.owner_id = c.id ORDER BY a.msg_id DESC';
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
        text: `select a.id, a.owner_id, a.subject, a.message, b.date_time, c.receiver_id, d.email 
        from messages a inner join sents b on a.id = b.msg_id and b.sender_id = $1 and b.status =$2
        inner join inboxes c on  a.id = c.msg_id inner join users d on d.id = c.receiver_id ORDER BY b.msg_id DESC`,
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

  static async getDrafts(userId) {
    if (userId) {
      let query = {
        text: `select a.receiver_id, a.date_time, b.id, b.subject, b.message, b.id from drafts a
        inner join messages b on b.owner_id =$1 and a.msg_id  = b.id  and a.status = $2 ORDER BY a.date_time DESC`,
        values: [userId, 'draft'],
      };
      let result = await client.query(query);
      const { rows } = result;

      const tempRows = await Promise.all(rows.map(async (row) => {
        const tempRow = row;
        if (row.receiver_id) {
          query = {
            text: 'select email from users where id = $1',
            values: [tempRow.receiver_id],
          };

          result = await client.query(query);
          tempRow.receiverEmail = result.rows[0].email;
        }
        return tempRow;
      }));
      return tempRows;
    }
    return [];
  }

  static async getDraftId(id, userId) {
    if (id) {
      const query = {
        text: `
        SELECT a.*, b.owner_id from drafts a 
        inner join messages b on a.msg_id = $1 and a.status =$2 and a.msg_id = b.id and b.owner_id = $3 `,
        values: [id, 'draft', userId],
      };
      const result = await client.query(query);
      return result.rows;
    }
    return [];
  }

  static async getMessageThread(id, receiverId) {
    let query = {
      text: 'select owner_id from messages where id =$1',
      values: [id],
    };
    let result = await client.query(query);
    const senderId = result.rows[0].owner_id;

    query = {
      text: `select a.msg_id, a.date_time, a.receiver_id, a.status, b.subject, b.message, b.owner_id, c.email, c.first_name 
        from inboxes a inner join messages b on 
        a.status != 'deleted' and (a.receiver_id =$1 or a.receiver_id =$2) and (b.owner_id =$1 or b.owner_id =$2) and a.msg_id = b.id 
        inner join users c on c.id = b.owner_id ORDER BY a.id`,
      values: [senderId, receiverId],
    };
    result = await client.query(query);
    result.rows.forEach((message) => {
      if (message.status !== 'read') {
        const updateQuery = {
          text: 'UPDATE inboxes SET status=$1 WHERE msg_id=$2',
          values: ['read', message.msg_id],
        };
        client.query(updateQuery);
      }
    });
    return result.rows;
  }

  static async getGroups(userId) {
    if (userId) {
      const query = {
        text: 'select * from groups where owner_id = $1',
        values: [userId],
      };
      const result = await client.query(query);
      return result.rows;
    }
    const query = {
      text: 'select * from groups',
    };
    const result = await client.query(query);
    return result.rows;
  }

  static async getAllGroups(userId) {
    const query = {
      text: 'select * from group_member where user_id = $1',
      values: [userId],
    };
    const result = await client.query(query);
    return result.rows.reverse();
  }

  static async getGroupMembers(groupId) {
    const temp = [];
    let query = {
      text: `select a.*, b.email from groups a 
             inner join users b
             on a.id = $1 and a.owner_id = b.id`,
      values: [groupId],
    };
    let result = await client.query(query);
    const adminId = result.rows[0].owner_id;
    temp.push({
      userId: adminId,
      userEmail: result.rows[0].email,
      userRole: 'Admin',
    });

    query = {
      text: `select a.*, b.email from group_member a
             inner join users b
             on a.group_id = $1 and a.user_id != $2 and a.user_id = b.id`,
      values: [groupId, adminId],
    };
    result = await client.query(query);
    result.rows.forEach((groupMember) => {
      temp.push({
        userId: groupMember.user_id,
        userEmail: groupMember.email,
        userRole: 'Member',
      });
    });
    return temp;
  }

  static async createGroup(values) {
    const query = {
      text: 'INSERT INTO groups(owner_id, name) VALUES($1, $2) RETURNING *',
      values,
    };
    const result = await client.query(query);
    return result.rows;
  }

  static async updateGroupName(values) {
    const query = {
      text: 'UPDATE groups SET name=$1 WHERE id=$2 RETURNING *',
      values,
    };
    const result = await client.query(query);
    return result.rows;
  }

  static async deleteGroup(id) {
    let query = {
      text: 'DELETE FROM group_member WHERE group_id =$1',
      values: [id],
    };
    await client.query(query);
    query = {
      text: 'DELETE FROM groups WHERE id =$1 RETURNING *',
      values: [id],
    };
    const result = await client.query(query);
    return result.rows;
  }

  static async addGroupMember(values) {
    let query = {
      text: 'SELECT * FROM group_member WHERE group_id =$1 and user_id =$2',
      values,
    };
    let result = await client.query(query);
    if (result.rowCount === 0) {
      query = {
        text: 'INSERT INTO group_member(group_id, user_id) VALUES($1, $2)RETURNING *',
        values,
      };
      result = await client.query(query);
      return result.rows;
    }
    return [];
  }

  static async getGroupMember(groupId, userId) {
    let query = {
      text: 'select * from group_member where group_id = $1',
      values: [groupId],
    };
    if (userId) {
      query = {
        text: 'select * from group_member where group_id = $1 and user_id =$2',
        values: [groupId, userId],
      };
    }
    const result = await client.query(query);
    return result.rows;
  }

  static async deleteGroupMember(values) {
    const query = {
      text: 'DELETE FROM group_member WHERE group_id =$1 and user_id =$2',
      values,
    };
    const result = await client.query(query);
    return result.rows;
  }

  static async getGroupOwner(id) {
    if (id) {
      const query = {
        text: 'SELECT * FROM groups WHERE id = $1',
        values: [id],
      };
      const result = await client.query(query);
      return result.rows;
    }
    return [];
  }
}
export default Database;
