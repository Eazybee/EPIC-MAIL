import { assert } from 'chai';
import Admin from '../src/model/Admin';
import Group from '../src/model/Group';
import User from '../src/model/User';

describe('Group', () => {
  let groupA;
  beforeEach(() => {
    Group.groups = [];
    Group.counter = 0;

    User.users = [];
    User.counter = 0;

    const adminA = new Admin('a@a.com', 'Ayo', 'Shittu', 'ayo123');
    adminA.createGroup({ groupName: 'Family', groupMembers: [1] });
    [groupA] = adminA.getGroups();
  });

  describe('getName method', () => {
    it('should return group name', () => {
      assert.equal(groupA.getName(), 'Family');
    });

    it('should return string', () => {
      assert.isString(groupA.getName());
    });
  });

  describe('getId method', () => {
    it('should return group id', () => {
      assert.equal(groupA.getId(), 1);
    });

    it('should return number', () => {
      assert.isNumber(groupA.getId());
    });
  });

  describe('getOwnerId method', () => {
    it('should return owner id', () => {
      assert.equal(groupA.getOwnerId(), 1);
    });

    it('should return number', () => {
      assert.isNumber(groupA.getOwnerId());
    });

    it('should return owner as an admin', () => {
      assert.isTrue(User.users[groupA.getOwnerId()].isAdmin());
    });
  });

  describe('addMembers method', () => {
    it('should not throw an error', () => {
      assert.doesNotThrow(() => {
        const userA = new User('a@a.com', 'Ayo', 'Shittu', 'ayo123');
        groupA.addMembers([userA.getId()]);
      });
    });
  });

  describe('getMembers method', () => {
    it('should return an array', () => {
      assert.isArray(groupA.getMembers());
    });

    it('should return array of numbers', () => {
      assert.isTrue(groupA.getMembers().every(memberId => (typeof memberId === 'number')));
    });
  });
});
