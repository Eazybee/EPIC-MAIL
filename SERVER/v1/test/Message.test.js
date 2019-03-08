import { assert } from 'chai';
import User from '../src/model/User';
import Message from '../src/model/Message';

describe('Message', () => {
  let messageA;
  beforeEach(() => {
    User.users = [];
    User.counter = 0;
    const userA = new User('a@a.com', 'Ayo', 'Shittu', 'ayo123');
    const userB = new User('b@b.com', 'Ilori', 'Ezekiel', '123bee');

    Message.messages = [];
    Message.counter = 0;
    messageA = userA.createMail({ subject: 'Howdy', message: 'holla bro' });
    const mail = {
      message: messageA,
      toUserId: userB.getId(),
    };

    userA.sendMail(mail);
  });

  describe('getId method', () => {
    it('should return message id', () => {
      assert.equal(messageA.getId(), 1);
    });

    it('should return number', () => {
      assert.isNumber(messageA.getId());
    });
  });

  describe('getSubject method', () => {
    it('should return message subject', () => {
      assert.equal(messageA.getSubject(), 'Howdy');
    });

    it('should return string', () => {
      assert.isString(messageA.getSubject());
    });
  });

  describe('getCreationDateTime method', () => {
    it('should return string', () => {
      assert.isString(messageA.getCreationDateTime());
    });
  });

  describe('setSubject method', () => {
    it('should not throw an error', () => {
      assert.doesNotThrow(() => {
        messageA.setSubject('Greetings!');
      });
    });
  });

  describe('getMessage method', () => {
    it('should return message', () => {
      assert.equal(messageA.getMessage(), 'holla bro');
    });

    it('should return string', () => {
      assert.isString(messageA.getMessage());
    });
  });

  describe('setMessage method', () => {
    it('should not throw an error', () => {
      assert.doesNotThrow(() => {
        messageA.setMessage('Good night');
      });
    });
  });

  describe('getStatus method', () => {
    it('should return status', () => {
      assert.equal(messageA.getStatus(), 'sent');
    });

    it('should return string', () => {
      assert.isString(messageA.getStatus());
    });
  });

  describe('setStatus method', () => {
    it('should not throw an error', () => {
      assert.doesNotThrow(() => {
        messageA.setStatus('draft');
      });
    });
  });

  describe('getParentMessageId method', () => {
    it('should return parent message id', () => {
      assert.equal(messageA.getParentMessageId(), 0);
    });

    it('should return number', () => {
      assert.isNumber(messageA.getParentMessageId());
    });
  });

  describe('setParentMessageId method', () => {
    it('should not throw an error', () => {
      assert.doesNotThrow(() => {
        messageA.setParentMessageId(8);
      });
    });
  });

  describe('SenderId method', () => {
    it('should return sender id', () => {
      assert.equal(messageA.getSenderId(), 1);
    });

    it('should return number', () => {
      assert.isNumber(messageA.getSenderId());
    });
  });

  describe('setSenderId method', () => {
    it('should not throw an error', () => {
      assert.doesNotThrow(() => {
        messageA.setSenderId(1);
      });
    });
  });

  describe('receiverId method', () => {
    it('should return receiver id', () => {
      assert.equal(messageA.getReceiverId(), 2);
    });

    it('should return number', () => {
      assert.isNumber(messageA.getReceiverId());
    });
  });

  describe('setReceiverId method', () => {
    it('should not throw an error', () => {
      assert.doesNotThrow(() => {
        messageA.setReceiverId(2);
      });
    });
  });

  describe('isRead method', () => {
    it('should return message a boolean', () => {
      assert.isBoolean(messageA.isRead());
    });
  });

  describe('static method getMail', () => {
    it('should return an array', () => {
      assert.isArray(Message.getMails());
    });
    it('should return array of message objects', () => {
      assert.isTrue(Message.getMails().every(message => message instanceof Message));
    });
    it('should return message of id 1', () => {
      assert.equal(Message.getMails(1)[0], messageA);
    });
  });
});
