import { assert } from 'chai';
import User from '../src/model/User';
import Message from '../src/model/Message';


describe('User', () => {
  let userA;
  beforeEach(() => {
    User.users = [];
    User.counter = 0;
    userA = new User('a@a.com', 'Ayo', 'Shittu', 'ayo123');
  });


  describe('getId method', () => {
    it('should return 1', () => {
      assert.equal(userA.getId(), 1);
    });

    it('should return a  number', () => {
      assert.isNumber(userA.getId());
    });
  });

  describe('getEmail method', () => {
    it('should return a@a.com', () => {
      assert.equal(userA.getEmail(), 'a@a.com');
    });

    it('should return a string', () => {
      assert.isString(userA.getEmail());
    });
  });

  describe('getFirstName method', () => {
    it('should return Ayo', () => {
      assert.equal(userA.getFirstName(), 'Ayo');
    });

    it('should return a string', () => {
      assert.isString(userA.getFirstName());
    });
  });

  describe('getLastName method', () => {
    it('should return Shittu', () => {
      assert.equal(userA.getLastName(), 'Shittu');
    });

    it('should return string', () => {
      assert.isString(userA.getLastName());
    });
  });

  describe('getFullName method', () => {
    it('should return Ayo Shittu', () => {
      assert.equal(userA.getFullName(), 'Ayo Shittu');
    });

    it('should return a string', () => {
      assert.isString(userA.getFullName());
    });
  });

  describe('getPassword method', () => {
    it('should return ayo123', () => {
      assert.equal(userA.getPassword(), 'ayo123');
    });

    it('should return a string', () => {
      assert.isString(userA.getPassword());
    });
  });

  describe('setPassword method', () => {
    it('should not throw an error', () => {
      assert.doesNotThrow(() => {
        userA.setPassword({ password: '123aug' });
      }, Error);
    });
  });

  describe('createMail method', () => {
    let mail;
    beforeEach(() => {
      Message.messages = [];
      Message.counter = 0;
      mail = { subject: 'Bee', message: 'holla bro' };
    });

    it('should return a message object', () => {
      assert.instanceOf(userA.createMail(mail), Message);
    });
    it('should return a message of id 1', () => {
      assert.equal(userA.createMail({ subject: 'Bee', message: 'holla bro' }).getId(), 1);
    });
    it('should not throw an error', () => {
      assert.doesNotThrow(() => {
        userA.createMail(mail);
      }, Error);
    });
  });

  describe('sendMail method', () => {
    it('should not throw an error', () => {
      const userB = new User('a@a.com', 'Ayo', 'Shittu', 'ayo123');
      const mail = {
        message: userA.createMail({ subject: 'Bee', message: 'holla bro' }),
        toUserId: userB.getId(),
      };

      assert.doesNotThrow(() => {
        userA.sendMail(mail);
      }, Error);
    });
  });

  describe('inbox method', () => {
    it('should return array object', () => {
      assert.isArray(userA.inbox());
    });

    it('should return array of message objects', () => {
      const userB = new User('a@a.com', 'Ayo', 'Shittu', 'ayo123');
      userB.sendMail({
        message: userB.createMail({ subject: 'Bee', message: 'holla bro' }),
        toUserId: userA.getId(),
      });

      assert.instanceOf(userA.inbox()[0], Message);
    });
  });

  describe('unReadInbox method', () => {
    it('should return array object', () => {
      assert.isArray(userA.unReadInbox());
    });

    it('should return unread messages', () => {
      assert.isTrue(userA.unReadInbox().every(mail => mail.getStatus() === 'sent'));
    });
  });

  describe('readInbox method', () => {
    it('should return array object', () => {
      assert.isArray(userA.readInbox());
    });

    it('should return read messages', () => {
      assert.isTrue(userA.readInbox().every(mail => mail.getStatus() === 'read'));
    });
  });

  describe('isAdmin method', () => {
    it('should return boolean', () => {
      assert.isBoolean(userA.isAdmin());
    });
  });

  describe('static method saveMail', () => {
    it('should not throw an error', () => {
      const mail = userA.createMail({ subject: 'Bee', message: 'holla bro' });
      assert.doesNotThrow(() => {
        User.saveMail(mail);
      });
    });
  });

  describe('static method deleteMail', () => {
    it('should not throw an error', () => {
      const mail = userA.createMail({ subject: 'Bee', message: 'holla bro' });
      assert.doesNotThrow(() => {
        User.deleteMail(mail.getId());
      });
    });
  });

  describe('static method read', () => {
    it('should run without throwing an error', () => {
      const userB = new User('a@a.com', 'Ayo', 'Shittu', 'ayo123');
      const msg = userB.createMail({ subject: 'Bee', message: 'holla bro' });

      userB.sendMail({
        message: msg,
        toUserId: userA.getId(),
      });
      assert.doesNotThrow(() => {
        User.read(msg);
      });
    });
  });

  describe('static method getUsers', () => {
    it('should return an array', () => {
      assert.isArray(User.getUsers());
    });
    it('should return array of user objects', () => {
      assert.isTrue(User.users.every(user => user instanceof User));
    });
    it('should return user of id 1', () => {
      assert.equal(User.getUsers(1), userA);
    });
  });
});
