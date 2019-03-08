import Joi from 'joi';

class Message {
  constructor(messageObj) {
    Message.counter += 1;
    this.id = Message.counter;
    this.createdOn = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
    this.subject = messageObj.subject; // req
    this.message = messageObj.message; // req
    this.senderId = messageObj.senderId; // req   The owner is also the sender
    this.receiverId = messageObj.receiverId || 0;
    this.parentMessageId = messageObj.parentMessageId || 0;
    this.status = 'draft';
    Message.messages[Message.counter] = this;
  }

  getId() {
    return this.id;
  }

  getSubject() {
    return this.subject;
  }

  getCreationDateTime() {
    return this.createdOn;
  }

  setSubject(subject) {
    const schema = Joi.string().required();
    const { error } = Joi.validate(subject, schema);
    if (error) {
      throw new Error(error.details[0].message);
    }
    this.subject = subject;
  }

  getMessage() {
    return this.message;
  }

  setMessage(message) {
    const schema = Joi.string().required();
    const { error } = Joi.validate(message, schema);
    if (error) {
      throw new Error(error.details[0].message);
    }
    this.message = message;
  }

  getStatus() {
    return this.status;
  }

  setStatus(status) {
    const schema = Joi.string().required();
    const { error } = Joi.validate(status, schema);
    if (error) {
      throw new Error(error.details[0].message);
    }
    this.status = status;
  }

  getParentMessageId() {
    return this.parentMessageId;
  }

  setParentMessageId(parentMessageId) {
    const schema = Joi.number().required();
    const { error } = Joi.validate(parentMessageId, schema);
    if (error) {
      throw new Error(error.details[0].message);
    }
    this.parentMessageId = parentMessageId;
  }

  getSenderId() {
    return this.senderId;
  }

  setSenderId(senderId) {
    const schema = Joi.number().required();
    const { error } = Joi.validate(senderId, schema);
    if (error) {
      throw new Error(error.details[0].message);
    }
    this.senderId = senderId;
  }

  getReceiverId() {
    return this.receiverId;
  }

  setReceiverId(receiverId) {
    const schema = Joi.number().required();
    const { error } = Joi.validate(receiverId, schema);
    if (error) {
      throw new Error(error.details[0].message);
    }
    this.receiverId = receiverId;
  }

  isRead() {
    return this.status === 'read';
  }

  static getMails(mailId) {
    const schema = Joi.number().not(0);
    const { error } = Joi.validate(mailId, schema);
    if (error) {
      throw new Error(error.details[0].message);
    }
    if (mailId) {
      if (!Message.messages[mailId]) {
        throw new Error('Mail does not exist');
      }
      return [Message.messages[mailId]];
    }
    return Message.messages.filter(message => message);
  }
}
Message.counter = 0;
Message.messages = [];
export default Message;
