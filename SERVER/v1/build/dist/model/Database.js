"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _User = _interopRequireDefault(require("./User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ayo = new _User.default('ayomipo@test.com', 'Ayomipo', 'Shittu', 'ayo123');
var john = new _User.default('johndoe@test.com', 'John', 'Doe', 'john123');
var mary = new _User.default('maryj@test.com', 'Mary', 'Jane', 'spiderman123');
var howdyMsg = ayo.createMail({
  subject: 'Howdy!',
  message: 'Hi mary, may I borrow your cell phone to call my mother after we finish lunch?'
});
ayo.sendMail({
  message: howdyMsg,
  toUserId: mary.getId()
});

_User.default.read(howdyMsg);

var sorryMsg = mary.createMail({
  subject: 'Sorry!',
  message: 'my cell phone has been stolen. i will ask john if he can borrow you his\' own'
});
sorryMsg.setParentMessageId(howdyMsg.getId());
mary.sendMail({
  message: sorryMsg,
  toUserId: ayo.getId()
});
var helpMsg = mary.createMail({
  subject: 'Help Out',
  message: 'hi john, i was wondering if could  lend ayo you phone, he needs to call his mum'
});
mary.sendMail({
  message: helpMsg,
  toUserId: john.getId()
});

_User.default.read(helpMsg);

var sureMsg = john.createMail({
  subject: 'Sure',
  message: 'of course yes, he can have my phone'
});
sureMsg.setParentMessageId(helpMsg.getId());
john.sendMail({
  message: sureMsg,
  toUserId: mary.getId()
});
var users = [ayo, john, mary];
var _default = users;
exports.default = _default;