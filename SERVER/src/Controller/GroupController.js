import db from '../Utility/Db';
import Utility from '../Utility/Uitility';
import UserController from './UserController';

class GroupController {
  static createGroup(req, res) {
    const values = [
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
      }
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static getGroups(req, res) {
    db.getGroups(UserController.user.getId()).then((groups) => {
      const data = groups.map(group => ({
        id: group.id,
        name: group.name,
        role: 'admin',
      }));
      res.status(200).json({
        status: 200,
        data,
      });
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
      res.status(200).json({
        status: 200,
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

    db.addGroupMember(values).then(() => {
      res.status(201).json({
        status: 201,
        data: [{
          id: req.params.id,
          userId: req.body.userId,
          role: 'member',
        }],
      });
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
    db.deleteGroupMember(values).then(() => {
      res.status(200).json({
        status: 200,
        data: [{
          message: `Member ${req.params.userId}  deleted`,
        }],
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

        // insert into sents table
        db.insertSents(values);
        // insert into the inboxes table
        values = [mailId, receiverId, 'unread', dateTime];
        db.insertInboxes(values);
      }).catch((err) => {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      });
    });

    res.status(201).json({
      status: 201,
      data: [{
        id: mailId,
        createdOn: new Date(parseInt(dateTime, 10)).toLocaleString('en-US', { timeZone: 'UTC' }),
        subject,
        message,
        parentMessageId: null,
        status: 'sent',
      }],
    });
  }
}
export default GroupController;
