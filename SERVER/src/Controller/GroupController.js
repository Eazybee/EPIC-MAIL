import db from '../Utility/Db';
import Utility from '../Utility/Uitility';
import UserController from './UserController';

class GroupController {
  static createGroup(req, res) {
    let values = [
      UserController.user.getId(),
      req.body.name,
    ];
    db.createGroup(values).then((rows) => {
      if (rows.length === 1) {
        const group = rows[0];
        res.status(201).json({
          status: 201,
          data: [{
            id: group.id,
            name: group.name,
            role: 'admin',
          }],
        });

        values = [group.id, UserController.user.getId()];
        db.addGroupMember(values);
      }
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static getGroups(req, res) {
    db.getAllGroups(UserController.user.getId()).then((groups) => {
      let count = 0;
      const data = [];
      if (groups.length > 0) {
        groups.forEach((group) => {
          db.getGroupOwner(group.group_id).then((rows) => {
            count += 1;
            data.push({
              id: group.group_id,
              name: rows[0].name,
              userId: rows[0].owner_id,
            });
            if (count === groups.length) {
              res.status(200).json({
                status: 200,
                data,
              });
            }
          });
        });
      } else {
        res.status(200).json({
          status: 200,
          data: [
            {
              message: 'You don\'t belong to any group',
            },
          ],
        });
      }
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static updateGroupName(req, res) {
    const values = [
      req.body.name,
      req.params.id,
    ];

    db.updateGroupName(values).then(() => {
      res.status(200).json({
        status: 200,
        data: [{
          id: req.params.id,
          name: req.body.name,
          role: 'admin',
        }],
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static deleteGroup(req, res) {
    const groudId = req.params.id;

    db.deleteGroup(groudId).then((rows) => {
      const message = `Group ${rows[0].name} deleted `;
      res.status(204).json({
        status: 204,
        data: [{
          message,
        }],
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static addGroupMember(req, res) {
    const values = [
      req.params.id,
      req.body.userId,
    ];

    db.addGroupMember(values).then((rows) => {
      if (rows[0]) {
        res.status(201).json({
          status: 201,
          data: [{
            id: req.params.id,
            userId: req.body.userId,
            role: 'member',
          }],
        });
      } else {
        const { userEmail } = req.body;
        const errorMessage = `User with email ${userEmail}  already exist in this group`;
        Utility.handleError(res, errorMessage, 400);
      }
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static deleteGroupMember(req, res) {
    const values = [
      req.params.groupId,
      req.params.userId,
    ];
    const userId = parseInt(req.params.userId, 10);
    db.getUsers(userId).then((users) => {
      const user = users[0];
      db.deleteGroupMember(values).then(() => {
        res.status(204).json({
          status: 204,
          data: [{
            message: `Member with email ${user.email}  deleted`,
          }],
        });
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static messageGroup(req, res) {
    const { members } = req;
    let mailId;
    const dateTime = Date.now();
    const { subject, message } = req.body;
    members.forEach((member) => {
      // Save the mail
      let values = [subject, message, UserController.user.getId(), dateTime, 'sent'];
      db.addMessage(values).then((rows) => {
        const [savedMail] = rows;
        mailId = savedMail.id;
        const receiverId = member.user_id;
        values = [mailId, UserController.user.getId(), 'sent', dateTime];
        UserController.mailId = mailId;

        // insert into sents table
        db.insertSents(values);
        // insert into the inboxes table
        values = [mailId, receiverId, 'unread', dateTime];
        db.insertInboxes(values);
        try {
          res.status(201).json({
            status: 201,
            data: [{
              id: UserController.mailId,
              createdOn: new Date(parseInt(dateTime, 10)).toLocaleString('en-US', { timeZone: 'UTC' }),
              subject,
              message,
              parentMessageId: null,
              status: 'sent',
            }],
          });
        } catch (e) {
          parseInt(e, 10);
        }
      }).catch((err) => {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      });
    });
  }
}
export default GroupController;
