import Joi from 'joi';

class Group {
  constructor(groupName, ownerId, groupMembers = []) {
    Group.counter += 1;
    this.Id = Group.counter;
    this.name = groupName;
    this.ownerId = ownerId;
    this.groupMembers = groupMembers;
    this.addMembers(this.groupMembers);
    Group.groups[Group.counter] = this;
  }

  getName() {
    return this.name;
  }

  getId() {
    return this.Id;
  }

  getOwnerId() {
    return this.ownerId;
  }

  addMembers(membersId) {
    const schema = Joi.array().required();
    const { error } = Joi.validate(membersId, schema);
    if (error) {
      throw new Error(error.details[0].message);
    }
    membersId.forEach((memberId) => {
      this.groupMembers.push(memberId);
    });
  }

  getMembers() {
    return this.groupMembers;
  }
}
Group.counter = 0;
Group.groups = [];
export default Group;
