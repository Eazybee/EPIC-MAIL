import User from '../Model/User';

const ayo = new User('ayomipo@test.com', 'Ayomipo', 'Shittu', 'ayo123');
const john = new User('johndoe@test.com', 'John', 'Doe', 'john123');
const mary = new User('maryj@test.com', 'Mary', 'Jane', 'spiderman123');

const howdyMsg = ayo.createMail({
  subject: 'Howdy!',
  message: 'Hi mary, may I borrow your cell phone to call my mother after we finish lunch?',
});
ayo.sendMail({
  message: howdyMsg,
  toUserId: mary.getId(),
});

User.read(howdyMsg);
const sorryMsg = mary.createMail({
  subject: 'Sorry!',
  message: 'my cell phone has been stolen. i will ask john if he can borrow you his\' own',
});
sorryMsg.setParentMessageId(howdyMsg.getId());
mary.sendMail({
  message: sorryMsg,
  toUserId: ayo.getId(),
});

const helpMsg = mary.createMail({
  subject: 'Help Out',
  message: 'hi john, i was wondering if could  lend ayo you phone, he needs to call his mum',
});
mary.sendMail({
  message: helpMsg,
  toUserId: john.getId(),
});

User.read(helpMsg);
const sureMsg = john.createMail({
  subject: 'Sure',
  message: 'of course yes, he can have my phone',
});
sureMsg.setParentMessageId(helpMsg.getId());
john.sendMail({
  message: sureMsg,
  toUserId: mary.getId(),
});
john.createMail({
  subject: 'Sure',
  message: 'ihoiof course yes, he can have my phone',
});
const users = [
  ayo,
  john,
  mary,
];
export default users;
