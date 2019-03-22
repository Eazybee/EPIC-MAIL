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
    membersId.forEach((memberId) => {
      this.groupMembers.push(memberId);
    });
  }

  getMembers() {
    return this.groupMembers;
  }
}
export default Group;
