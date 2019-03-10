import Joi from 'joi';
import Message from './Message';

class User {
  constructor(email, firstName, lastName, password) {
    User.counter += 1;
    this.id = User.counter;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.admin = false;
    User.users[User.counter] = this;
  }

  getId() {
    return this.id;
  }

  getEmail() {
    return this.email;
  }

  getFirstName() {
    return this.firstName;
  }

  getLastName() {
    return this.lastName;
  }

  getFullName() {
    return `${this.getFirstName()} ${this.getLastName()}`;
  }

  getPassword() {
    return this.password;
  }

  setPassword(password) {
    const schema = Joi.object().keys({
      password: Joi.string().min(6).max(30)
        .required(),
    });
    const { error } = Joi.validate(password, schema);
    if (error) {
      throw new Error(error.details[0].message);
    }
    this.password = password;
  }

  createMail(mail) {
    const schema = Joi.object().keys({
      subject: Joi.string().required(),
      message: Joi.string().required(),
      receiverId: Joi.string(),
    });
    const { error } = Joi.validate(mail, schema);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const obj = mail;
    obj.senderId = this.id;
    return new Message(obj);
  }

  sendMail(mail) {
    const schema = Joi.object().keys({
      message: Joi.object().keys({
        id: Joi.number().required(),
        subject: Joi.string().required(),
        message: Joi.string().required(),
        senderId: Joi.number().required(),
        status: Joi.string().equal('draft').required(),
        receiverId: Joi.number(),
        parentMessageId: Joi.number(),
        createdOn: Joi.string().required(),
      }).required(),
      toUserId: Joi.number().required(),
    });
    const { error } = Joi.validate(mail, schema);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { message, toUserId } = mail;
    message.setSenderId(this.id);
    message.setReceiverId(toUserId);
    message.setStatus('sent');
  }

  getSentMail() {
    const sent = Message.getMails().filter(message => message.getSenderId() === this.id);
    return sent;
  }

  inbox() {
    const inboxes = Message.getMails().filter(message => message.getReceiverId() === this.id);
    return inboxes;
  }

  unReadInbox() {
    const inboxes = this.inbox().filter(message => message.getReceiverId() === this.id && message.getStatus() === 'sent');
    return inboxes;
  }

  readInbox() {
    const inboxes = this.inbox().filter(message => message.getReceiverId() === this.id && message.getStatus() === 'read');
    return inboxes;
  }

  isAdmin() {
    return this.admin;
  }

  static saveMail(message) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
      subject: Joi.string().required(),
      message: Joi.string().required(),
      senderId: Joi.number().required(),
      status: Joi.string().equal('draft').required(),
      receiverId: Joi.number(),
      parentMessageId: Joi.number(),
      createdOn: Joi.string().required(),
    });
    const { error } = Joi.validate(message, schema);
    if (error) {
      throw new Error(error.details[0].message);
    }

    message.setStatus('draft');
  }

  static deleteMail(mailId) {
    const schema = Joi.number().not(0).less(Message.counter + 1).required();
    const { error } = Joi.validate(mailId, schema);
    if (error) {
      throw new Error(error.details[0].message);
    } else if (!Message.getMails(mailId)) {
      throw new Error('mail does not exist');
    }

    delete Message.messages[mailId];
  }

  static read(message) {
    const schema = Joi.object().keys({
      id: Joi.number().required(),
      subject: Joi.string().required(),
      message: Joi.string().required(),
      senderId: Joi.number().required(),
      status: Joi.string().equal('sent').required(),
      receiverId: Joi.number().required(),
      parentMessageId: Joi.number(),
      createdOn: Joi.string().required(),
    });
    const { error } = Joi.validate(message, schema);
    if (error) {
      throw new Error(error.details[0].message);
    }

    message.setStatus('read');
  }

  static getUsers(userId) {
    const schema = Joi.number().not(0);
    const { error } = Joi.validate(userId, schema);
    if (error) {
      throw new Error(error.details[0].message);
    }
    if (userId) {
      if (!User.users[userId]) {
        throw new Error('User does not exist');
      }
      return User.users[userId];
    }
    return User.users.filter(user => user);
  }
}
User.counter = 0;
User.users = [];

export default User;
