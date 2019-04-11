"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Message =
/*#__PURE__*/
function () {
  function Message(messageObj) {
    _classCallCheck(this, Message);

    this.createdOn = new Date();
    this.subject = messageObj.subject; // req

    this.message = messageObj.message; // req

    this.senderId = messageObj.senderId; // req   The owner is also the sender

    this.receiverId = messageObj.receiverId || 0;
    this.parentMessageId = messageObj.parentMessageId || 0;
    this.status = 'draft';
    this.deletedFor = 'non';
    Message.counter = Message.counter + 1 || 0;
    this.id = Message.counter;
    Message.messages = Message.messages || [];
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
      this.receiverId = receiverId;
    }
  }], [{
    key: "getMails",
    value: function getMails(mailId) {
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

var _default = Message;
exports.default = _default;