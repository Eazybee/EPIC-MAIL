import Message from './Message';


class User {
  constructor(email, firstName, lastName, password) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.admin = false;
    User.counter = (User.counter + 1) || 0;
    this.id = User.counter;
    User.users = User.users || [];
    User.users[User.counter] = this;
  }

  getId() {
    return this.id;
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
  }

  createMail(mail) {
    const obj = mail;
    obj.senderId = this.id;
    return new Message(obj);
  }

  sendMail(mail) {
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

  deleteMail(mailId) {
    const mail = Message.getMails(mailId)[0];
    if (mail.getSenderId() === this.id) {
      mail.setSenderId(NaN);
    } else if (mail.getReceiverId() === this.id) {
      mail.setReceiverId(NaN);
    }
  }

  static saveMail(message) {
    message.setStatus('draft');
  }

  static read(message) {
    message.setStatus('read');
  }

  static getUsers(userId) {
    if (User.users) {
      if (userId) {
        if (!User.users[userId]) {
          throw new Error('User does not exist');
        }
        return User.users[userId];
      }
      return User.users.filter(user => user);
    }
    return [];
  }
}
export default User;
