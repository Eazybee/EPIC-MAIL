"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _UserController = _interopRequireDefault(require("./UserController"));

var _Db = _interopRequireDefault(require("../Utility/Db"));

var _Uitility = _interopRequireDefault(require("../Utility/Uitility"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MessageController =
/*#__PURE__*/
function () {
  function MessageController() {
    _classCallCheck(this, MessageController);
  }

  _createClass(MessageController, null, [{
    key: "sendMail",
    value: function sendMail(req, res) {
      var dateTime = Date.now(); // Save the mail

      var values = [req.body.subject, req.body.message, _UserController.default.user.getId(), dateTime, 'sent'];

      _Db.default.addMessage(values).then(function (rows) {
        var _rows = _slicedToArray(rows, 1),
            savedMail = _rows[0];

        var mailId = savedMail.id;
        var _req$body = req.body,
            subject = _req$body.subject,
            message = _req$body.message,
            receiverId = _req$body.receiverId;
        values = [mailId, _UserController.default.user.getId(), 'sent', dateTime]; // insert into sents table

        _Db.default.insertSents(values).then(function (rows2) {
          if (rows2.length === 1) {
            // insert into the inboxes table
            values = [mailId, receiverId, 'unread', dateTime];

            _Db.default.insertInboxes(values).then(function () {
              return res.status(201).json({
                status: 201,
                data: [{
                  id: mailId,
                  createdOn: dateTime,
                  subject: subject,
                  message: message,
                  parentMessageId: null,
                  status: 'sent'
                }]
              });
            });
          }
        });
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "saveDraft",
    value: function saveDraft(req, res) {
      var msgId = req.body.id;

      if (msgId) {
        var message = [req.body.subject, req.body.message, Date.now(), req.body.receiverId, msgId];

        _Db.default.updateDraft(message).then(function (rows) {
          var _rows2 = _slicedToArray(rows, 1),
              mail = _rows2[0];

          res.status(200).json({
            status: 200,
            data: [{
              id: msgId,
              createdOn: mail.date_time,
              subject: mail.subject,
              message: mail.message,
              parentMessageId: null,
              status: 'draft'
            }]
          });
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      } else {
        var _message = [req.body.subject, req.body.message, _UserController.default.user.getId(), Date.now(), 'draft'];

        _Db.default.addMessage(_message, 'draft', req.body.receiverId).then(function (rows) {
          var _rows3 = _slicedToArray(rows, 1),
              mail = _rows3[0];

          res.status(201).json({
            status: 201,
            data: [{
              id: mail.id,
              createdOn: mail.date_time,
              subject: mail.subject,
              message: mail.message,
              parentMessageId: null,
              status: mail.status
            }]
          });
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "sendDraft",
    value: function sendDraft(req, res) {
      var mailId = parseInt(req.body.id, 10);
      var _req$body2 = req.body,
          subject = _req$body2.subject,
          message = _req$body2.message,
          receiverId = _req$body2.receiverId;
      var dateTime = Date.now();
      var values = [subject, message, 'sent', mailId];

      _Db.default.sendDraft(values, [receiverId, dateTime, 'sent', mailId]).then(function (rowCount) {
        if (rowCount === 1) {
          // insert into sents table
          values = [mailId, _UserController.default.user.getId(), 'sent', dateTime];

          _Db.default.insertSents(values).then(function (rows) {
            if (rows.length === 1) {
              // insert into the inboxes table
              values = [mailId, receiverId, 'unread', dateTime];

              _Db.default.insertInboxes(values).then(function () {
                return res.status(200).json({
                  status: 200,
                  data: [{
                    id: mailId,
                    createdOn: dateTime,
                    subject: subject,
                    message: message,
                    parentMessageId: null,
                    status: 'sent'
                  }]
                });
              });
            }
          });
        }
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "getInbox",
    value: function getInbox(req, res) {
      _Db.default.getInboxes().then(function (mails) {
        var inbox = mails.filter(function (mail) {
          return mail.receiver_id === _UserController.default.user.getId();
        });

        if (inbox.length !== 0) {
          inbox = inbox.map(function (mail) {
            return {
              id: mail.msg_id,
              createdOn: mail.date_time,
              subject: mail.subject,
              message: mail.message,
              senderId: mail.owner_id,
              receiverId: mail.receiver_id,
              parentMessageId: null,
              status: mail.status,
              senderEmail: mail.email
            };
          });
          res.status(200).json({
            status: 200,
            data: inbox
          });
        } else {
          res.status(200).json({
            status: 200,
            data: [{
              message: 'Your inbox is empty!'
            }]
          });
        }
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "getUnreadInbox",
    value: function getUnreadInbox(req, res) {
      _Db.default.getInboxes().then(function (mails) {
        var inbox = mails.filter(function (mail) {
          return mail.receiver_id === _UserController.default.user.getId() && mail.status === 'unread';
        });

        if (inbox.length !== 0) {
          inbox = inbox.map(function (mail) {
            return {
              id: mail.msg_id,
              createdOn: mail.date_time,
              subject: mail.subject,
              message: mail.message,
              senderId: mail.owner_id,
              receiverId: mail.receiver_id,
              parentMessageId: null,
              status: mail.status,
              senderEmail: mail.email
            };
          });
          res.status(200).json({
            status: 200,
            data: inbox
          });
        } else {
          res.status(200).json({
            status: 200,
            data: [{
              message: 'Your don\'t have any unread message!'
            }]
          });
        }
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "getReadInbox",
    value: function getReadInbox(req, res) {
      _Db.default.getInboxes().then(function (mails) {
        var inbox = mails.filter(function (mail) {
          return mail.receiver_id === _UserController.default.user.getId() && mail.status === 'read';
        });

        if (inbox.length !== 0) {
          inbox = inbox.map(function (mail) {
            return {
              id: mail.msg_id,
              createdOn: mail.date_time,
              subject: mail.subject,
              message: mail.message,
              senderId: mail.owner_id,
              receiverId: mail.receiver_id,
              parentMessageId: null,
              status: mail.status,
              senderEmail: mail.email
            };
          });
          res.status(200).json({
            status: 200,
            data: inbox
          });
        } else {
          res.status(200).json({
            status: 200,
            data: [{
              message: 'Your don\'t have any read message!'
            }]
          });
        }
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "getSentMail",
    value: function getSentMail(req, res) {
      _Db.default.getSents(_UserController.default.user.getId()).then(function (mails) {
        if (mails.length !== 0) {
          var sent = mails.map(function (mail) {
            return {
              id: mail.id,
              createdOn: mail.date_time,
              subject: mail.subject,
              message: mail.message,
              senderId: mail.owner_id,
              receiverId: mail.receiver_id,
              parentMessageId: null,
              status: 'sent',
              receiverEmail: mail.email
            };
          });
          res.status(200).json({
            status: 200,
            data: sent
          });
        } else {
          res.status(200).json({
            status: 200,
            data: [{
              message: 'Your don\'t have any sent message!'
            }]
          });
        }
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "getDraft",
    value: function getDraft(req, res) {
      _Db.default.getDrafts(_UserController.default.user.getId()).then(function (mails) {
        if (mails.length !== 0) {
          var drafts = mails.map(function (mail) {
            return {
              id: mail.id,
              createdOn: mail.date_time,
              subject: mail.subject,
              message: mail.message,
              senderId: _UserController.default.user.getId(),
              receiverEmail: mail.receiverEmail,
              parentMessageId: null,
              status: 'draft'
            };
          });
          res.status(200).json({
            status: 200,
            data: drafts
          });
        } else {
          res.status(200).json({
            status: 200,
            data: [{
              message: 'Your draft is empty!'
            }]
          });
        }
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "getMailId",
    value: function getMailId(req, res) {
      var mailId = parseInt(req.params.id, 10);

      _Db.default.getMessageThread(mailId, _UserController.default.user.getId()).then(function (mails) {
        var inbox = mails.map(function (mail) {
          return {
            id: mail.msg_id,
            createdOn: mail.date_time,
            subject: mail.subject,
            message: mail.message,
            senderId: mail.owner_id,
            receiverId: mail.receiver_id,
            parentMessageId: null,
            status: mail.status,
            senderEmail: mail.email,
            senderFirstName: mail.first_name
          };
        });
        res.status(200).json({
          status: 200,
          data: inbox
        });
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "getSentMailId",
    value: function getSentMailId(req, res) {
      var sent = req.rows.map(function (mail) {
        return {
          id: mail.id,
          createdOn: mail.date_time,
          subject: mail.subject,
          message: mail.message,
          receiverId: mail.receiver_id,
          parentMessageId: null,
          status: 'sent',
          receiverEmail: mail.email,
          receiverFirstName: mail.first_name
        };
      });
      res.status(200).json({
        status: 200,
        data: sent
      });
    }
  }, {
    key: "deleteMail",
    value: function deleteMail(req, res) {
      var mailId = parseInt(req.params.id, 10);

      _Db.default.deleteMessage(mailId, req.deleteType).then(function () {
        res.status(204).json({
          status: 204,
          data: [{
            message: 'Message deleted successful'
          }]
        });
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "retractMail",
    value: function retractMail(req, res) {
      var mailId = parseInt(req.params.id, 10);

      _Db.default.deleteMessage(mailId, req.deleteType).then(function () {
        req.deleteType = 'inboxes';

        _Db.default.deleteMessage(mailId, req.deleteType).then(function () {
          res.status(204).json({
            status: 204,
            data: [{
              message: 'Message retracted successful'
            }]
          });
        });
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }]);

  return MessageController;
}();

var _default = MessageController;
exports.default = _default;