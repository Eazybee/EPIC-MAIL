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
    const msgId = req.body.id;
    if (msgId) {
      const message = [
        req.body.subject,
        req.body.message,
        Date.now(),
        req.body.receiverId,
        msgId,
      ];

      db.updateDraft(message).then((rows) => {
        const [mail] = rows;
        res.status(200).json({
          status: 200,
          data: [{
            id: msgId,
            createdOn: mail.date_time,
            subject: mail.subject,
            message: mail.message,
            parentMessageId: null,
            status: 'draft',
          }],
        });
      }).catch((err) => {
        const errorMessage = `SERVER ERROR: ${err.message}`;
        Utility.handleError(res, errorMessage, 500);
      });
    } else {
      const message = [
        req.body.subject,
        req.body.message,
        UserController.user.getId(),
        Date.now(),
        'draft',
      ];
      db.addMessage(message, 'draft', req.body.receiverId).then((rows) => {
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
  }

  static sendDraft(req, res) {
    const mailId = parseInt(req.body.id, 10);
    const { subject, message, receiverId } = req.body;
    const dateTime = Date.now();
    let values = [subject, message, 'sent', mailId];

    db.sendDraft(values, [receiverId, dateTime, 'sent', mailId]).then((rowCount) => {
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
      if (inbox.length !== 0) {
        inbox = inbox.map(mail => ({
          id: mail.msg_id,
          createdOn: mail.date_time,
          subject: mail.subject,
          message: mail.message,
          senderId: mail.owner_id,
          receiverId: mail.receiver_id,
          parentMessageId: null,
          status: mail.status,
          senderEmail: mail.email,
        }));
        res.status(200).json({
          status: 200,
          data: inbox,
        });
      } else {
        res.status(200).json({
          status: 200,
          data: [
            {
              message: 'Your inbox is empty!',
            },
          ],
        });
      }
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static getUnreadInbox(req, res) {
    db.getInboxes().then((mails) => {
      let inbox = mails.filter(mail => mail.receiver_id === UserController.user.getId() && mail.status === 'unread');
      if (inbox.length !== 0) {
        inbox = inbox.map(mail => ({
          id: mail.msg_id,
          createdOn: mail.date_time,
          subject: mail.subject,
          message: mail.message,
          senderId: mail.owner_id,
          receiverId: mail.receiver_id,
          parentMessageId: null,
          status: mail.status,
          senderEmail: mail.email,
        }));
        res.status(200).json({
          status: 200,
          data: inbox,
        });
      } else {
        res.status(200).json({
          status: 200,
          data: [
            {
              message: 'Your don\'t have any unread message!',
            },
          ],
        });
      }
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static getReadInbox(req, res) {
    db.getInboxes().then((mails) => {
      let inbox = mails.filter(mail => mail.receiver_id === UserController.user.getId() && mail.status === 'read');
      if (inbox.length !== 0) {
        inbox = inbox.map(mail => ({
          id: mail.msg_id,
          createdOn: mail.date_time,
          subject: mail.subject,
          message: mail.message,
          senderId: mail.owner_id,
          receiverId: mail.receiver_id,
          parentMessageId: null,
          status: mail.status,
          senderEmail: mail.email,
        }));
        res.status(200).json({
          status: 200,
          data: inbox,
        });
      } else {
        res.status(200).json({
          status: 200,
          data: [
            {
              message: 'Your don\'t have any read message!',
            },
          ],
        });
      }
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static getSentMail(req, res) {
    db.getSents(UserController.user.getId()).then((mails) => {
      if (mails.length !== 0) {
        const sent = mails.map(mail => ({
          id: mail.id,
          createdOn: mail.date_time,
          subject: mail.subject,
          message: mail.message,
          senderId: mail.owner_id,
          receiverId: mail.receiver_id,
          parentMessageId: null,
          status: 'sent',
          receiverEmail: mail.email,
        }));

        res.status(200).json({
          status: 200,
          data: sent,
        });
      } else {
        res.status(200).json({
          status: 200,
          data: [
            {
              message: 'Your don\'t have any sent message!',
            },
          ],
        });
      }
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static getDraft(req, res) {
    db.getDrafts(UserController.user.getId()).then((mails) => {
      if (mails.length !== 0) {
        const drafts = mails.map(mail => ({
          id: mail.id,
          createdOn: mail.date_time,
          subject: mail.subject,
          message: mail.message,
          senderId: UserController.user.getId(),
          parentMessageId: null,
          status: 'draft',
          receiverEmail: mail.receiverEmail,
        }));
        res.status(200).json({
          status: 200,
          data: drafts,
        });
      } else {
        res.status(200).json({
          status: 200,
          data: [
            {
              message: 'Your draft is empty!',
            },
          ],
        });
      }
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static getMailId(req, res) {
    const mailId = parseInt(req.params.id, 10);
    db.getMessageThread(mailId, UserController.user.getId()).then((mails) => {
      const inbox = mails.map(mail => ({
        id: mail.msg_id,
        createdOn: mail.date_time,
        subject: mail.subject,
        message: mail.message,
        senderId: mail.owner_id,
        receiverId: mail.receiver_id,
        parentMessageId: null,
        status: mail.status,
        senderEmail: mail.email,
        senderFirstName: mail.first_name,
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

  static getSentMailId(req, res) {
    const sent = req.rows.map(mail => ({
      id: mail.id,
      createdOn: mail.date_time,
      subject: mail.subject,
      message: mail.message,
      receiverId: mail.receiver_id,
      parentMessageId: null,
      status: 'sent',
      receiverEmail: mail.email,
      receiverFirstName: mail.first_name,
    }));
    res.status(200).json({
      status: 200,
      data: sent,
    });
  }

  static deleteMail(req, res) {
    const mailId = parseInt(req.params.id, 10);
    db.deleteMessage(mailId, req.deleteType).then(() => {
      res.status(204).json({
        status: 204,
        data: [{
          message: 'Message deleted successful',
        }],
      });
    }).catch((err) => {
      const errorMessage = `SERVER ERROR: ${err.message}`;
      Utility.handleError(res, errorMessage, 500);
    });
  }

  static retractMail(req, res) {
    const mailId = parseInt(req.params.id, 10);
    db.deleteMessage(mailId, req.deleteType).then(() => {
      req.deleteType = 'inboxes';
      db.deleteMessage(mailId, req.deleteType).then(() => {
        res.status(204).json({
          status: 204,
          data: [{
            message: 'Message retracted successful',
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
