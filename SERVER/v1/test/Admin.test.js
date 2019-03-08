import { assert } from 'chai';
import User from '../src/model/User';
import Admin from '../src/model/Admin';
import Group from '../src/model/Group';

describe('Admin', () => {
  let adminA;
  beforeEach(() => {
    User.users = [];
    User.counter = 0;
    adminA = new Admin('a@a.com', 'Ayo', 'Shittu', 'ayo123');
  });

  it('should be instance of User', () => {
    assert.instanceOf(adminA, User);
  });

  it('should be an admin user', () => {
    assert.isTrue(adminA.isAdmin());
  });

  describe('createGroup method', () => {
    it('should run without throwing an error', () => {
      assert.doesNotThrow(() => {
        adminA.createGroup({ groupName: 'Family', groupMembers: [] });
      });
    });
  });

  describe('getGroups method', () => {
    it('should return array', () => {
      assert.isArray(adminA.getGroups());
    });

    it('should return array of Group objects', () => {
      adminA.createGroup({ groupName: 'Family', groupMembers: [1] });
      assert.isTrue(adminA.getGroups().every(group => (group instanceof Group)));
    });
  });
});
