"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Message =
/*#__PURE__*/
function () {
  function Message(messageObj) {
    _classCallCheck(this, Message);

    Message.counter += 1;
    this.id = Message.counter;
    this.createdOn = new Date().toLocaleString('en-US', {
      timeZone: 'UTC'
    });
    this.subject = messageObj.subject; // req

    this.message = messageObj.message; // req

    this.senderId = messageObj.senderId; // req   The owner is also the sender

    this.receiverId = messageObj.receiverId || 0;
    this.parentMessageId = messageObj.parentMessageId || 0;
    this.status = 'draft';
    Message.messages[Message.counter] = this;
  }

  _createClass(Message, [{
    key: "getId",
    value: function getId() {
      return this.id;
    }
  }, {
    key: "getSubject",
    value: function getSubject() {
      return this.subject;
    }
  }, {
    key: "getCreationDateTime",
    value: function getCreationDateTime() {
      return this.createdOn;
    }
  }, {
    key: "setSubject",
    value: function setSubject(subject) {
      var schema = _joi.default.string().required();

      var _Joi$validate = _joi.default.validate(subject, schema),
          error = _Joi$validate.error;

      if (error) {
        throw new Error(error.details[0].message);
      }

      this.subject = subject;
    }
  }, {
    key: "getMessage",
    value: function getMessage() {
      return this.message;
    }
  }, {
    key: "setMessage",
    value: function setMessage(message) {
      var schema = _joi.default.string().required();

      var _Joi$validate2 = _joi.default.validate(message, schema),
          error = _Joi$validate2.error;

      if (error) {
        throw new Error(error.details[0].message);
      }

      this.message = message;
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      return this.status;
    }
  }, {
    key: "setStatus",
    value: function setStatus(status) {
      var schema = _joi.default.string().required();

      var _Joi$validate3 = _joi.default.validate(status, schema),
          error = _Joi$validate3.error;

      if (error) {
        throw new Error(error.details[0].message);
      }

      this.status = status;
    }
  }, {
    key: "getParentMessageId",
    value: function getParentMessageId() {
      return this.parentMessageId;
    }
  }, {
    key: "setParentMessageId",
    value: function setParentMessageId(parentMessageId) {
      var schema = _joi.default.number().required();

      var _Joi$validate4 = _joi.default.validate(parentMessageId, schema),
          error = _Joi$validate4.error;

      if (error) {
        throw new Error(error.details[0].message);
      }

      this.parentMessageId = parentMessageId;
    }
  }, {
    key: "getSenderId",
    value: function getSenderId() {
      return this.senderId;
    }
  }, {
    key: "setSenderId",
    value: function setSenderId(senderId) {
      var schema = _joi.default.number().required();

      var _Joi$validate5 = _joi.default.validate(senderId, schema),
          error = _Joi$validate5.error;

      if (error) {
        throw new Error(error.details[0].message);
      }

      this.senderId = senderId;
    }
  }, {
    key: "getReceiverId",
    value: function getReceiverId() {
      return this.receiverId;
    }
  }, {
    key: "setReceiverId",
    value: function setReceiverId(receiverId) {
      var schema = _joi.default.number().required();

      var _Joi$validate6 = _joi.default.validate(receiverId, schema),
          error = _Joi$validate6.error;

      if (error) {
        throw new Error(error.details[0].message);
      }

      this.receiverId = receiverId;
    }
  }, {
    key: "isRead",
    value: function isRead() {
      return this.status === 'read';
    }
  }], [{
    key: "getMails",
    value: function getMails(mailId) {
      var schema = _joi.default.number().not(0);

      var _Joi$validate7 = _joi.default.validate(mailId, schema),
          error = _Joi$validate7.error;

      if (error) {
        throw new Error(error.details[0].message);
      }

      if (mailId) {
        if (!Message.messages[mailId]) {
          throw new Error('Mail does not exist');
        }

        return [Message.messages[mailId]];
      }

      return Message.messages.filter(function (message) {
        return message;
      });
    }
  }]);

  return Message;
}();

Message.counter = 0;
Message.messages = [];
var _default = Message;
exports.default = _default;