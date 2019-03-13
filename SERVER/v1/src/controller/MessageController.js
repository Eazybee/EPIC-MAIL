import UserController from './UserController';
import Message from '../model/Message';
import User from '../model/User';

class MessageController {
  static sendMail(req, res) {
    // Save the mail
    const savedMail = MessageController.savedMail(req, res);

    // Send the mail
    req.body.id = savedMail.data[0].id;
    const sentMail = MessageController.sendDraftUtility(req, res);
    res.status(201).json(sentMail);
  }

  static saveDraft(req, res) {
    const savedMail = MessageController.savedMail(req);
    res.status(201).send(savedMail);
  }

  static savedMail(req) {
    const mail = UserController.user.createMail({
      subject: req.body.subject,
      message: req.body.message,
      receiverId: req.body.receiverId,
    });

    return {
      status: 201,
      data: [{
        id: mail.getId(),
        createdOn: mail.getCreationDateTime(),
        subject: mail.getSubject(),
        message: mail.getMessage(),
        parentMessageId: mail.getParentMessageId(),
        status: mail.getStatus(),
      }],
    };
  }

  static sendDraft(req, res) {
    const sentMail = MessageController.sendDraftUtility(req);
    res.status(201).json(sentMail);
  }

  static sendDraftUtility(req) {
    const mailId = parseInt(req.body.id, 10);
    const mail = Message.getMails(mailId)[0];
    mail.setSubject(req.body.subject);
    mail.setMessage(req.body.message);

    UserController.user.sendMail({
      message: mail,
      toUserId: parseInt(req.body.toUserId, 10),
    });
    const [mailObj] = Message.getMails(req.body.id);
    return {
      status: 201,
      data: [{
        id: mailObj.getId(),
        createdOn: mailObj.getCreationDateTime(),
        subject: mailObj.getSubject(),
        message: mailObj.getMessage(),
        parentMessageId: mailObj.getParentMessageId(),
        status: mailObj.getStatus(),
      }],
    };
  }

  static getInbox(req, res) {
    res.status(200).json({
      status: 200,
      data: UserController.user.inbox(),
    });
  }

  static getUnreadInbox(req, res) {
    res.status(200).json({
      status: 200,
      data: UserController.user.unReadInbox(),
    });
  }

  static getReadInbox(req, res) {
    res.status(200).json({
      status: 200,
      data: UserController.user.readInbox(),
    });
  }

  static getSentMail(req, res) {
    res.status(200).json({
      status: 200,
      data: UserController.user.getSentMail(),
    });
  }

  static getMailId(req, res) {
    res.status(200).json({
      status: 200,
      data: Message.getMails(parseInt(req.params.id, 10)),
    });
  }

  static deleteMail(req, res) {
    const mailId = parseInt(req.params.id, 10);
    const mailMessage = Message.getMails(mailId)[0].getMessage();
    // Delete mail
    User.deleteMail(mailId);
    res.status(200).json({
      status: 200,
      data: [{
        message: mailMessage,
      }],
    });
  }
}
export default MessageController;
