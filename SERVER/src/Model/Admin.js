import User from './User';
import Group from './Group';

class Admin extends User {
  constructor(email, firstName, lastName, password) {
    super(email, firstName, lastName, password);
    this.admin = true;
  }

  createGroup(group) {const { groupName, groupMembers } = group;
    return new Group(groupName, this.id, groupMembers);
  }

  getGroups() {
    const adminGroup = Group.groups.filter(group => group.getOwnerId() === this.id);
    return adminGroup;
  }
}
export default Admin;
