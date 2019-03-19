import UserController from './UserController';
import db from '../Utility/Db';
import Utility from '../Utility/Uitility';

class MessageController {
  static sendMail(req, res) {
    const dateTime = Date.now();

    // Save the mail
    let values = [req.body.subject, req.body.message, UserController.user.getId(), dateTime, 'sent'];
    db.addMessage(values).then((rows) => {
      const [savedMail] = rows;
      const mailId = savedMail.id;
      const { subject, message, receiverId } = req.body;
      values = [mailId, UserController.user.getId(), 'sent', dateTime];

      // insert into sents table
      db.insertSents(values).then((rows2) => {
        if (rows2.length === 1) {
        // insert into the inboxes table
          values = [mailId, receiverId, 'unread', dateTime];
          db.insertInboxes(values).then(() => res.status(201).json({
            status: 201,
            data: [{
              id: mailId,
              createdOn: dateTime,
              subject,
              message,
              parentMessageId: null,
              status: 'sent',
            }],
          }));
        }
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static saveDraft(req, res) {
    const message = [
      req.body.subject,
      req.body.message,
      UserController.user.getId(),
      Date.now(),
      'draft',
    ];
    db.addMessage(message).then((rows) => {
      const [mail] = rows;
      res.status(201).json({
        status: 201,
        data: [{
          id: mail.id,
          createdOn: mail.date_time,
          subject: mail.subject,
          message: mail.message,
          parentMessageId: null,
          status: mail.status,
        }],
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static sendDraft(req, res) {
    const mailId = parseInt(req.body.id, 10);
    const { subject, message, receiverId } = req.body;
    const dateTime = Date.now();
    let values = [subject, message, 'sent', mailId];

    db.updateMessage(values).then((rowCount) => {
      if (rowCount === 1) {
        // insert into sents table
        values = [mailId, UserController.user.getId(), 'sent', dateTime];
        db.insertSents(values).then((rows) => {
          if (rows.length === 1) {
            // insert into the inboxes table
            values = [mailId, receiverId, 'unread', dateTime];
            db.insertInboxes(values).then(() => res.status(200).json({
              status: 200,
              data: [{
                id: mailId,
                createdOn: dateTime,
                subject,
                message,
                parentMessageId: null,
                status: 'sent',
              }],
            }));
          }
        });
      }
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static getInbox(req, res) {
    db.getInboxes().then((mails) => {
      let inbox = mails.filter(mail => mail.receiver_id === UserController.user.getId());
      inbox = inbox.map(mail => ({
        id: mail.msg_id,
        createdOn: new Date(parseInt(mail.date_time, 10)).toLocaleString('en-US', { timeZone: 'UTC' }),
        subject: mail.subject,
        message: mail.message,
        senderId: mail.owner_id,
        receiverId: mail.receiver_id,
        parentMessageId: null,
        status: mail.status,
      }));
      res.status(200).json({
        status: 200,
        data: inbox,
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static getUnreadInbox(req, res) {
    db.getInboxes().then((mails) => {
      let inbox = mails.filter(mail => mail.receiver_id === UserController.user.getId() && mail.status === 'unread');
      inbox = inbox.map(mail => ({
        id: mail.msg_id,
        createdOn: new Date(parseInt(mail.date_time, 10)).toLocaleString('en-US', { timeZone: 'UTC' }),
        subject: mail.subject,
        message: mail.message,
        senderId: mail.owner_id,
        receiverId: mail.receiver_id,
        parentMessageId: null,
        status: mail.status,
      }));
      res.status(200).json({
        status: 200,
        data: inbox,
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static getReadInbox(req, res) {
    db.getInboxes().then((mails) => {
      let inbox = mails.filter(mail => mail.receiver_id === UserController.user.getId() && mail.status === 'read');
      inbox = inbox.map(mail => ({
        id: mail.msg_id,
        createdOn: new Date(parseInt(mail.date_time, 10)).toLocaleString('en-US', { timeZone: 'UTC' }),
        subject: mail.subject,
        message: mail.message,
        senderId: mail.owner_id,
        receiverId: mail.receiver_id,
        parentMessageId: null,
        status: mail.status,
      }));
      res.status(200).json({
        status: 200,
        data: inbox,
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static getSentMail(req, res) {
    db.getSents(UserController.user.getId()).then((mails) => {
      const sent = mails.map(mail => ({
        id: mail.id,
        createdOn: new Date(parseInt(mail.date_time, 10)).toLocaleString('en-US', { timeZone: 'UTC' }),
        subject: mail.subject,
        message: mail.message,
        senderId: mail.owner_id,
        receiverId: mail.receiver_id,
        parentMessageId: null,
        status: 'sent',
      }));

      res.status(200).json({
        status: 200,
        data: sent,
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static getMailId(req, res) {
    db.getInboxes().then((mails) => {
      const mailId = parseInt(req.params.id, 10);
      let inbox = mails.filter(mail => mail.receiver_id === UserController.user.getId()
      && mail.msg_id === mailId);
      inbox = inbox.map(mail => ({
        id: mail.msg_id,
        createdOn: new Date(parseInt(mail.date_time, 10)).toLocaleString('en-US', { timeZone: 'UTC' }),
        subject: mail.subject,
        message: mail.message,
        senderId: mail.owner_id,
        receiverId: mail.receiver_id,
        parentMessageId: null,
        status: mail.status,
      }));
      res.status(200).json({
        status: 200,
        data: inbox,
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static deleteMail(req, res) {
    const mailId = parseInt(req.params.id, 10);
    db.deleteMessage(mailId, req.deleteType).then(() => {
      db.getMessages(mailId).then((rows2) => {
        res.status(200).json({
          status: 200,
          data: [{
            message: rows2[0].message,
          }],
        });
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }
}
export default MessageController;
