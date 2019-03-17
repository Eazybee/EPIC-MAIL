class Message {
  constructor(messageObj) {
    this.createdOn = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
    this.subject = messageObj.subject; // req
    this.message = messageObj.message; // req
    this.senderId = messageObj.senderId; // req   The owner is also the sender
    this.receiverId = messageObj.receiverId || 0;
    this.parentMessageId = messageObj.parentMessageId || 0;
    this.status = 'draft';
    this.deletedFor = 'non';
    Message.counter = (Message.counter + 1) || 0;
    this.id = Message.counter;
    Message.messages = Message.messages || [];
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
    this.subject = subject;
  }

  getMessage() {
    return this.message;
  }

  setMessage(message) {
    this.message = message;
  }

  getStatus() {
    return this.status;
  }

  setStatus(status) {
    this.status = status;
  }

  getParentMessageId() {
    return this.parentMessageId;
  }

  setParentMessageId(parentMessageId) {
    this.parentMessageId = parentMessageId;
  }

  getSenderId() {
    return this.senderId;
  }

  setSenderId(senderId) {
    this.senderId = senderId;
  }

  getReceiverId() {
    return this.receiverId;
  }

  setReceiverId(receiverId) {
    this.receiverId = receiverId;
  }

  static getMails(mailId) {
    if (mailId) {
      if (!Message.messages[mailId]) {
        throw new Error('Mail does not exist');
      }
      return [Message.messages[mailId]];
    }
    return Message.messages.filter(message => message);
  }
}
export default Message;
