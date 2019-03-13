"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _Message = _interopRequireDefault(require("./Message"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var User =
/*#__PURE__*/
function () {
  function User(email, firstName, lastName, password) {
    _classCallCheck(this, User);

    User.counter += 1;
    this.id = User.counter;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.admin = false;
    User.users[User.counter] = this;
  }

  _createClass(User, [{
    key: "getId",
    value: function getId() {
      return this.id;
    }
  }, {
    key: "getEmail",
    value: function getEmail() {
      return this.email;
    }
  }, {
    key: "getFirstName",
    value: function getFirstName() {
      return this.firstName;
    }
  }, {
    key: "getLastName",
    value: function getLastName() {
      return this.lastName;
    }
  }, {
    key: "getFullName",
    value: function getFullName() {
      return "".concat(this.getFirstName(), " ").concat(this.getLastName());
    }
  }, {
    key: "getPassword",
    value: function getPassword() {
      return this.password;
    }
  }, {
    key: "setPassword",
    value: function setPassword(password) {
      var schema = _joi.default.object().keys({
        password: _joi.default.string().min(6).max(30).required()
      });

      var _Joi$validate = _joi.default.validate(password, schema),
          error = _Joi$validate.error;

      if (error) {
        throw new Error(error.details[0].message);
      }

      this.password = password;
    }
  }, {
    key: "createMail",
    value: function createMail(mail) {
      var schema = _joi.default.object().keys({
        subject: _joi.default.string().required(),
        message: _joi.default.string().required(),
        receiverId: _joi.default.string()
      });

      var _Joi$validate2 = _joi.default.validate(mail, schema),
          error = _Joi$validate2.error;

      if (error) {
        throw new Error(error.details[0].message);
      }

      var obj = mail;
      obj.senderId = this.id;
      return new _Message.default(obj);
    }
  }, {
    key: "sendMail",
    value: function sendMail(mail) {
      var schema = _joi.default.object().keys({
        message: _joi.default.object().keys({
          id: _joi.default.number().required(),
          subject: _joi.default.string().required(),
          message: _joi.default.string().required(),
          senderId: _joi.default.number().required(),
          status: _joi.default.string().equal('draft').required(),
          receiverId: _joi.default.number(),
          parentMessageId: _joi.default.number(),
          createdOn: _joi.default.string().required()
        }).required(),
        toUserId: _joi.default.number().required()
      });

      var _Joi$validate3 = _joi.default.validate(mail, schema),
          error = _Joi$validate3.error;

      if (error) {
        throw new Error(error.details[0].message);
      }

      var message = mail.message,
          toUserId = mail.toUserId;
      message.setSenderId(this.id);
      message.setReceiverId(toUserId);
      message.setStatus('sent');
    }
  }, {
    key: "getSentMail",
    value: function getSentMail() {
      var _this = this;

      var sent = _Message.default.getMails().filter(function (message) {
        return message.getSenderId() === _this.id;
      });

      return sent;
    }
  }, {
    key: "inbox",
    value: function inbox() {
      var _this2 = this;

      var inboxes = _Message.default.getMails().filter(function (message) {
        return message.getReceiverId() === _this2.id;
      });

      return inboxes;
    }
  }, {
    key: "unReadInbox",
    value: function unReadInbox() {
      var _this3 = this;

      var inboxes = this.inbox().filter(function (message) {
        return message.getReceiverId() === _this3.id && message.getStatus() === 'sent';
      });
      return inboxes;
    }
  }, {
    key: "readInbox",
    value: function readInbox() {
      var _this4 = this;

      var inboxes = this.inbox().filter(function (message) {
        return message.getReceiverId() === _this4.id && message.getStatus() === 'read';
      });
      return inboxes;
    }
  }, {
    key: "isAdmin",
    value: function isAdmin() {
      return this.admin;
    }
  }], [{
    key: "saveMail",
    value: function saveMail(message) {
      var schema = _joi.default.object().keys({
        id: _joi.default.number().required(),
        subject: _joi.default.string().required(),
        message: _joi.default.string().required(),
        senderId: _joi.default.number().required(),
        status: _joi.default.string().equal('draft').required(),
        receiverId: _joi.default.number(),
        parentMessageId: _joi.default.number(),
        createdOn: _joi.default.string().required()
      });

      var _Joi$validate4 = _joi.default.validate(message, schema),
          error = _Joi$validate4.error;

      if (error) {
        throw new Error(error.details[0].message);
      }

      message.setStatus('draft');
    }
  }, {
    key: "deleteMail",
    value: function deleteMail(mailId) {
      var schema = _joi.default.number().not(0).less(_Message.default.counter + 1).required();

      var _Joi$validate5 = _joi.default.validate(mailId, schema),
          error = _Joi$validate5.error;

      if (error) {
        throw new Error(error.details[0].message);
      } else if (!_Message.default.getMails(mailId)) {
        throw new Error('mail does not exist');
      }

      delete _Message.default.messages[mailId];
    }
  }, {
    key: "read",
    value: function read(message) {
      var schema = _joi.default.object().keys({
        id: _joi.default.number().required(),
        subject: _joi.default.string().required(),
        message: _joi.default.string().required(),
        senderId: _joi.default.number().required(),
        status: _joi.default.string().equal('sent').required(),
        receiverId: _joi.default.number().required(),
        parentMessageId: _joi.default.number(),
        createdOn: _joi.default.string().required()
      });

      var _Joi$validate6 = _joi.default.validate(message, schema),
          error = _Joi$validate6.error;

      if (error) {
        throw new Error(error.details[0].message);
      }

      message.setStatus('read');
    }
  }, {
    key: "getUsers",
    value: function getUsers(userId) {
      var schema = _joi.default.number().not(0);

      var _Joi$validate7 = _joi.default.validate(userId, schema),
          error = _Joi$validate7.error;

      if (error) {
        throw new Error(error.details[0].message);
      }

      if (userId) {
        if (!User.users[userId]) {
          throw new Error('User does not exist');
        }

        return User.users[userId];
      }

      return User.users.filter(function (user) {
        return user;
      });
    }
  }]);

  return User;
}();

User.counter = 0;
User.users = [];
var _default = User;
exports.default = _default;