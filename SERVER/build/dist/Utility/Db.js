"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _DbConnection = _interopRequireDefault(require("../Database/DbConnection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Database =
/*#__PURE__*/
function () {
  function Database() {
    _classCallCheck(this, Database);
  }

  _createClass(Database, null, [{
    key: "getUserId",
    value: function () {
      var _getUserId = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(email) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                query = {
                  text: 'SELECT id FROM users WHERE email = $1',
                  values: [email.toLowerCase()]
                };
                _context.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context.sent;
                return _context.abrupt("return", result.rows);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getUserId(_x) {
        return _getUserId.apply(this, arguments);
      }

      return getUserId;
    }()
  }, {
    key: "addUser",
    value: function () {
      var _addUser = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(values) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                query = {
                  text: 'INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4) RETURNING *',
                  values: values
                };
                _context2.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context2.sent;
                return _context2.abrupt("return", result.rows);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function addUser(_x2) {
        return _addUser.apply(this, arguments);
      }

      return addUser;
    }()
  }, {
    key: "getUsers",
    value: function () {
      var _getUsers = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(id) {
        var _query, _result, query, result;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!id) {
                  _context3.next = 6;
                  break;
                }

                _query = {
                  text: 'SELECT * FROM users WHERE id = $1',
                  values: [id]
                };
                _context3.next = 4;
                return _DbConnection.default.query(_query);

              case 4:
                _result = _context3.sent;
                return _context3.abrupt("return", _result.rows);

              case 6:
                query = {
                  text: 'SELECT * FROM users'
                };
                _context3.next = 9;
                return _DbConnection.default.query(query);

              case 9:
                result = _context3.sent;
                return _context3.abrupt("return", result.rows);

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function getUsers(_x3) {
        return _getUsers.apply(this, arguments);
      }

      return getUsers;
    }()
  }, {
    key: "reset",
    value: function () {
      var _reset = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(values) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                query = {
                  text: 'UPDATE resets set password=$1 WHERE user_id=$2 RETURNING *',
                  values: values
                };
                _context4.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context4.sent;

                if (!(result.rowCount === 0)) {
                  _context4.next = 9;
                  break;
                }

                query = {
                  text: 'INSERT INTO resets(password, user_id) VALUES($1, $2) RETURNING *',
                  values: values
                };
                _context4.next = 8;
                return _DbConnection.default.query(query);

              case 8:
                result = _context4.sent;

              case 9:
                return _context4.abrupt("return", result.rows);

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function reset(_x4) {
        return _reset.apply(this, arguments);
      }

      return reset;
    }()
  }, {
    key: "updatePassword",
    value: function () {
      var _updatePassword = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(id) {
        var query, result, password;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                query = {
                  text: 'DELETE FROM resets where user_id = $1 RETURNING *',
                  values: [id]
                };
                _context5.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context5.sent;
                password = result.rows[0].password;
                query = {
                  text: 'UPDATE users set password=$1 WHERE id=$2',
                  values: [password, id]
                };
                _context5.next = 8;
                return _DbConnection.default.query(query);

              case 8:
                result = _context5.sent;
                return _context5.abrupt("return", result.rows);

              case 10:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function updatePassword(_x5) {
        return _updatePassword.apply(this, arguments);
      }

      return updatePassword;
    }()
  }, {
    key: "addMessage",
    value: function () {
      var _addMessage = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(values, type, receiverId) {
        var query, result, msgId, query2;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                query = {
                  text: 'INSERT INTO messages(subject, message, owner_id, date_time, status) VALUES($1, $2, $3, $4, $5) RETURNING *',
                  values: values
                };
                _context6.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context6.sent;

                if (!(type === 'draft')) {
                  _context6.next = 9;
                  break;
                }

                msgId = result.rows[0].id;
                query2 = {
                  text: 'INSERT INTO drafts(msg_id, receiver_id, date_time, status) VALUES($1, $2, $3, $4) RETURNING *',
                  values: [msgId, receiverId, values[3], 'draft']
                };
                _context6.next = 9;
                return _DbConnection.default.query(query2);

              case 9:
                return _context6.abrupt("return", result.rows);

              case 10:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function addMessage(_x6, _x7, _x8) {
        return _addMessage.apply(this, arguments);
      }

      return addMessage;
    }()
  }, {
    key: "updateDraft",
    value: function () {
      var _updateDraft = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(values) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                query = {
                  text: 'UPDATE messages set subject=$1, message=$2 where id =$3 RETURNING *',
                  values: [values[0], values[1], values[4]]
                };
                _context7.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context7.sent;
                query = {
                  text: 'UPDATE drafts set date_time=$1, receiver_id=$2 where msg_id =$3 RETURNING *',
                  values: [values[2], values[3], values[4]]
                };
                _context7.next = 7;
                return _DbConnection.default.query(query);

              case 7:
                return _context7.abrupt("return", result.rows);

              case 8:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function updateDraft(_x9) {
        return _updateDraft.apply(this, arguments);
      }

      return updateDraft;
    }()
  }, {
    key: "sendDraft",
    value: function () {
      var _sendDraft = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8(values, values2) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                query = {
                  text: 'UPDATE messages SET subject=$1, message=$2, status=$3 WHERE id=$4',
                  values: values
                };
                _context8.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context8.sent;
                query = {
                  text: 'UPDATE drafts SET receiver_id=$1, date_time=$2, status=$3 WHERE msg_id=$4',
                  values: values2
                };
                _context8.next = 7;
                return _DbConnection.default.query(query);

              case 7:
                return _context8.abrupt("return", result.rowCount);

              case 8:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function sendDraft(_x10, _x11) {
        return _sendDraft.apply(this, arguments);
      }

      return sendDraft;
    }()
  }, {
    key: "getMessages",
    value: function () {
      var _getMessages = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9(id, userAccess, userId) {
        var query, result, _result2, _result3, inboxResult, sentResult, _sentResult;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!id) {
                  _context9.next = 40;
                  break;
                }

                if (!(userAccess === 'inbox')) {
                  _context9.next = 7;
                  break;
                }

                query = {
                  text: 'SELECT a.*, b.receiver_id FROM messages a  INNER JOIN inboxes b ON a.id = b.msg_id and a.id =$1 and b.status !=$2',
                  values: [id, 'deleted']
                };
                _context9.next = 5;
                return _DbConnection.default.query(query);

              case 5:
                result = _context9.sent;
                return _context9.abrupt("return", result.rows);

              case 7:
                if (!(userAccess === 'sent')) {
                  _context9.next = 13;
                  break;
                }

                query = {
                  text: "\n          SELECT a.id, a.subject, a.message, b.date_time, c.receiver_id, d.email, d.first_name \n          FROM messages a  INNER JOIN sents b \n          ON a.id = b.msg_id and a.id =$1 and a.owner_id = $2 and b.status !=$3\n          INNER JOIN inboxes c \n          ON a.id = c.msg_id\n          INNER JOIN users d\n          ON d.id = c.receiver_id",
                  values: [id, userId, 'deleted']
                };
                _context9.next = 11;
                return _DbConnection.default.query(query);

              case 11:
                _result2 = _context9.sent;
                return _context9.abrupt("return", _result2.rows);

              case 13:
                if (!(userAccess === 'draft')) {
                  _context9.next = 19;
                  break;
                }

                query = {
                  text: "\n                 SELECT a.owner_id, b.msg_id FROM messages a \n                 inner join drafts b \n                 on a.id =$1 and a.owner_id =$2 and b.status =$3 and a.id = b.msg_id",
                  values: [id, userId, 'draft']
                };
                _context9.next = 17;
                return _DbConnection.default.query(query);

              case 17:
                _result3 = _context9.sent;
                return _context9.abrupt("return", _result3.rows);

              case 19:
                if (!(userAccess === 'deleteInbox')) {
                  _context9.next = 26;
                  break;
                }

                query = {
                  text: 'SELECT * FROM inboxes where msg_id =$1 and receiver_id=$2 and status !=$3',
                  values: [id, userId, 'deleted']
                };
                _context9.next = 23;
                return _DbConnection.default.query(query);

              case 23:
                inboxResult = _context9.sent;
                inboxResult.deleteType = 'inboxes';
                return _context9.abrupt("return", inboxResult);

              case 26:
                if (!(userAccess === 'deleteSent')) {
                  _context9.next = 33;
                  break;
                }

                query = {
                  text: "SELECT a.*, b.owner_id FROM sents a \n                 inner join messages b \n                 on a.msg_id =$1 and a.sender_id=$2 and a.status !=$3\n                 and b.id = a.msg_id",
                  values: [id, userId, 'deleted']
                };
                _context9.next = 30;
                return _DbConnection.default.query(query);

              case 30:
                sentResult = _context9.sent;
                sentResult.deleteType = 'sents';
                return _context9.abrupt("return", sentResult);

              case 33:
                if (!(userAccess === 'deleteDraft')) {
                  _context9.next = 40;
                  break;
                }

                query = {
                  text: "SELECT a.*, b.owner_id FROM drafts a \n                 inner join messages b \n                 on a.msg_id =$1 and a.status =$2 and a.msg_id = b.id and b.owner_id =$3",
                  values: [id, 'draft', userId]
                };
                _context9.next = 37;
                return _DbConnection.default.query(query);

              case 37:
                _sentResult = _context9.sent;
                _sentResult.deleteType = 'drafts';
                return _context9.abrupt("return", _sentResult);

              case 40:
                return _context9.abrupt("return", []);

              case 41:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function getMessages(_x12, _x13, _x14) {
        return _getMessages.apply(this, arguments);
      }

      return getMessages;
    }()
  }, {
    key: "deleteMessage",
    value: function () {
      var _deleteMessage = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10(id, table) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                query = {
                  text: "UPDATE ".concat(table, " SET status =$1 where msg_id = $2 RETURNING *"),
                  values: ['deleted', id]
                };
                _context10.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context10.sent;
                return _context10.abrupt("return", result.rows);

              case 5:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function deleteMessage(_x15, _x16) {
        return _deleteMessage.apply(this, arguments);
      }

      return deleteMessage;
    }()
  }, {
    key: "insertInboxes",
    value: function () {
      var _insertInboxes = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee11(values) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                query = {
                  text: 'INSERT INTO inboxes(msg_id, receiver_id, status, date_time) VALUES($1, $2, $3, $4) RETURNING *',
                  values: values
                };
                _context11.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context11.sent;
                return _context11.abrupt("return", result.rows);

              case 5:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      function insertInboxes(_x17) {
        return _insertInboxes.apply(this, arguments);
      }

      return insertInboxes;
    }()
  }, {
    key: "insertSents",
    value: function () {
      var _insertSents = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee12(values) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                query = {
                  text: 'INSERT INTO sents(msg_id, sender_id, status, date_time) VALUES($1, $2, $3, $4) RETURNING *',
                  values: values
                };
                _context12.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context12.sent;
                return _context12.abrupt("return", result.rows);

              case 5:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }));

      function insertSents(_x18) {
        return _insertSents.apply(this, arguments);
      }

      return insertSents;
    }()
  }, {
    key: "getInboxes",
    value: function () {
      var _getInboxes = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee13(id) {
        var text, _query2, _result4, query, result;

        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                text = "select a.msg_id, a.receiver_id, a.status, a.date_time, b.subject, b.message, b.owner_id, c.email \n                  from inboxes a \n                  INNER JOIN messages b ON a.msg_id = b.id and a.status !=$1 \n                  INNER JOIN users c ON b.owner_id = c.id ORDER BY a.date_time DESC";

                if (!id) {
                  _context13.next = 7;
                  break;
                }

                _query2 = {
                  text: "".concat(text, " and a.msg_id =$2"),
                  values: ['deleted', id]
                };
                _context13.next = 5;
                return _DbConnection.default.query(_query2);

              case 5:
                _result4 = _context13.sent;
                return _context13.abrupt("return", _result4.rows);

              case 7:
                query = {
                  text: text,
                  values: ['deleted']
                };
                _context13.next = 10;
                return _DbConnection.default.query(query);

              case 10:
                result = _context13.sent;
                return _context13.abrupt("return", result.rows);

              case 12:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      }));

      function getInboxes(_x19) {
        return _getInboxes.apply(this, arguments);
      }

      return getInboxes;
    }()
  }, {
    key: "getSents",
    value: function () {
      var _getSents = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee14(id) {
        var _query3, _result5, text, query, result;

        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                if (!id) {
                  _context14.next = 6;
                  break;
                }

                _query3 = {
                  text: "select a.id, a.owner_id, a.subject, a.message, b.date_time, c.receiver_id, d.email \n        from messages a inner join sents b on a.id = b.msg_id and b.sender_id = $1 and b.status =$2\n        inner join inboxes c on  a.id = c.msg_id inner join users d on d.id = c.receiver_id ORDER BY b.date_time DESC",
                  values: [id, 'sent']
                };
                _context14.next = 4;
                return _DbConnection.default.query(_query3);

              case 4:
                _result5 = _context14.sent;
                return _context14.abrupt("return", _result5.rows);

              case 6:
                text = 'select * from sents';
                query = {
                  text: text
                };
                _context14.next = 10;
                return _DbConnection.default.query(query);

              case 10:
                result = _context14.sent;
                return _context14.abrupt("return", result.rows);

              case 12:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14);
      }));

      function getSents(_x20) {
        return _getSents.apply(this, arguments);
      }

      return getSents;
    }()
  }, {
    key: "getDrafts",
    value: function () {
      var _getDrafts = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee16(userId) {
        var query, result, _result6, rows, tempRows;

        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                if (!userId) {
                  _context16.next = 10;
                  break;
                }

                query = {
                  text: "select a.receiver_id, a.date_time, b.id, b.subject, b.message, b.id from drafts a\n        inner join messages b on b.owner_id =$1 and a.msg_id  = b.id  and a.status = $2 ORDER BY a.date_time DESC",
                  values: [userId, 'draft']
                };
                _context16.next = 4;
                return _DbConnection.default.query(query);

              case 4:
                result = _context16.sent;
                _result6 = result, rows = _result6.rows;
                _context16.next = 8;
                return Promise.all(rows.map(
                /*#__PURE__*/
                function () {
                  var _ref = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee15(row) {
                    var tempRow;
                    return regeneratorRuntime.wrap(function _callee15$(_context15) {
                      while (1) {
                        switch (_context15.prev = _context15.next) {
                          case 0:
                            tempRow = row;

                            if (!row.receiver_id) {
                              _context15.next = 7;
                              break;
                            }

                            query = {
                              text: 'select email from users where id = $1',
                              values: [tempRow.receiver_id]
                            };
                            _context15.next = 5;
                            return _DbConnection.default.query(query);

                          case 5:
                            result = _context15.sent;
                            tempRow.receiverEmail = result.rows[0].email;

                          case 7:
                            return _context15.abrupt("return", tempRow);

                          case 8:
                          case "end":
                            return _context15.stop();
                        }
                      }
                    }, _callee15);
                  }));

                  return function (_x22) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 8:
                tempRows = _context16.sent;
                return _context16.abrupt("return", tempRows);

              case 10:
                return _context16.abrupt("return", []);

              case 11:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16);
      }));

      function getDrafts(_x21) {
        return _getDrafts.apply(this, arguments);
      }

      return getDrafts;
    }()
  }, {
    key: "getDraftId",
    value: function () {
      var _getDraftId = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee17(id, userId) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                if (!id) {
                  _context17.next = 6;
                  break;
                }

                query = {
                  text: "\n        SELECT a.*, b.owner_id from drafts a \n        inner join messages b on a.msg_id = $1 and a.status =$2 and a.msg_id = b.id and b.owner_id = $3 ",
                  values: [id, 'draft', userId]
                };
                _context17.next = 4;
                return _DbConnection.default.query(query);

              case 4:
                result = _context17.sent;
                return _context17.abrupt("return", result.rows);

              case 6:
                return _context17.abrupt("return", []);

              case 7:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17);
      }));

      function getDraftId(_x23, _x24) {
        return _getDraftId.apply(this, arguments);
      }

      return getDraftId;
    }()
  }, {
    key: "getMessageThread",
    value: function () {
      var _getMessageThread = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee18(id, receiverId) {
        var query, result, senderId;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                query = {
                  text: 'select owner_id from messages where id =$1',
                  values: [id]
                };
                _context18.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context18.sent;
                senderId = result.rows[0].owner_id;
                query = {
                  text: "select a.msg_id, a.date_time, a.receiver_id, a.status, b.subject, b.message, b.owner_id, c.email, c.first_name \n        from inboxes a inner join messages b on \n        a.status != 'deleted' and (a.receiver_id =$1 or a.receiver_id =$2) and (b.owner_id =$1 or b.owner_id =$2) and a.msg_id = b.id \n        inner join users c on c.id = b.owner_id ORDER BY a.date_time",
                  values: [senderId, receiverId]
                };
                _context18.next = 8;
                return _DbConnection.default.query(query);

              case 8:
                result = _context18.sent;
                result.rows.forEach(function (message) {
                  if (message.status !== 'read') {
                    var updateQuery = {
                      text: 'UPDATE inboxes SET status=$1 WHERE msg_id=$2',
                      values: ['read', message.msg_id]
                    };

                    _DbConnection.default.query(updateQuery);
                  }
                });
                return _context18.abrupt("return", result.rows);

              case 11:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18);
      }));

      function getMessageThread(_x25, _x26) {
        return _getMessageThread.apply(this, arguments);
      }

      return getMessageThread;
    }()
  }, {
    key: "getGroups",
    value: function () {
      var _getGroups = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee19(userId) {
        var _query4, _result7, query, result;

        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                if (!userId) {
                  _context19.next = 6;
                  break;
                }

                _query4 = {
                  text: 'select * from groups where owner_id = $1',
                  values: [userId]
                };
                _context19.next = 4;
                return _DbConnection.default.query(_query4);

              case 4:
                _result7 = _context19.sent;
                return _context19.abrupt("return", _result7.rows);

              case 6:
                query = {
                  text: 'select * from groups'
                };
                _context19.next = 9;
                return _DbConnection.default.query(query);

              case 9:
                result = _context19.sent;
                return _context19.abrupt("return", result.rows);

              case 11:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19);
      }));

      function getGroups(_x27) {
        return _getGroups.apply(this, arguments);
      }

      return getGroups;
    }()
  }, {
    key: "getAllGroups",
    value: function () {
      var _getAllGroups = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee20(userId) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                query = {
                  text: 'select * from group_member where user_id = $1',
                  values: [userId]
                };
                _context20.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context20.sent;
                return _context20.abrupt("return", result.rows.reverse());

              case 5:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20);
      }));

      function getAllGroups(_x28) {
        return _getAllGroups.apply(this, arguments);
      }

      return getAllGroups;
    }()
  }, {
    key: "getGroupMembers",
    value: function () {
      var _getGroupMembers = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee21(groupId) {
        var temp, query, result, adminId;
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                temp = [];
                query = {
                  text: "select a.*, b.email from groups a \n             inner join users b\n             on a.id = $1 and a.owner_id = b.id",
                  values: [groupId]
                };
                _context21.next = 4;
                return _DbConnection.default.query(query);

              case 4:
                result = _context21.sent;
                adminId = result.rows[0].owner_id;
                temp.push({
                  userId: adminId,
                  userEmail: result.rows[0].email,
                  userRole: 'Admin'
                });
                query = {
                  text: "select a.*, b.email from group_member a\n             inner join users b\n             on a.group_id = $1 and a.user_id != $2 and a.user_id = b.id",
                  values: [groupId, adminId]
                };
                _context21.next = 10;
                return _DbConnection.default.query(query);

              case 10:
                result = _context21.sent;
                result.rows = result.rows.map(function (groupMember) {
                  return {
                    userId: groupMember.user_id,
                    userEmail: groupMember.email,
                    userRole: 'Member'
                  };
                });
                return _context21.abrupt("return", temp.concat(result.rows));

              case 13:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21);
      }));

      function getGroupMembers(_x29) {
        return _getGroupMembers.apply(this, arguments);
      }

      return getGroupMembers;
    }()
  }, {
    key: "createGroup",
    value: function () {
      var _createGroup = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee22(values) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                query = {
                  text: 'INSERT INTO groups(owner_id, name) VALUES($1, $2) RETURNING *',
                  values: values
                };
                _context22.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context22.sent;
                return _context22.abrupt("return", result.rows);

              case 5:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22);
      }));

      function createGroup(_x30) {
        return _createGroup.apply(this, arguments);
      }

      return createGroup;
    }()
  }, {
    key: "updateGroupName",
    value: function () {
      var _updateGroupName = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee23(values) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                query = {
                  text: 'UPDATE groups SET name=$1 WHERE id=$2 RETURNING *',
                  values: values
                };
                _context23.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context23.sent;
                return _context23.abrupt("return", result.rows);

              case 5:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23);
      }));

      function updateGroupName(_x31) {
        return _updateGroupName.apply(this, arguments);
      }

      return updateGroupName;
    }()
  }, {
    key: "deleteGroup",
    value: function () {
      var _deleteGroup = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee24(id) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                query = {
                  text: 'DELETE FROM group_member WHERE group_id =$1',
                  values: [id]
                };
                _context24.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                query = {
                  text: 'DELETE FROM groups WHERE id =$1 RETURNING *',
                  values: [id]
                };
                _context24.next = 6;
                return _DbConnection.default.query(query);

              case 6:
                result = _context24.sent;
                return _context24.abrupt("return", result.rows);

              case 8:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24);
      }));

      function deleteGroup(_x32) {
        return _deleteGroup.apply(this, arguments);
      }

      return deleteGroup;
    }()
  }, {
    key: "addGroupMember",
    value: function () {
      var _addGroupMember = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee25(values) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                query = {
                  text: 'SELECT * FROM group_member WHERE group_id =$1 and user_id =$2',
                  values: values
                };
                _context25.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context25.sent;

                if (!(result.rowCount === 0)) {
                  _context25.next = 10;
                  break;
                }

                query = {
                  text: 'INSERT INTO group_member(group_id, user_id) VALUES($1, $2)RETURNING *',
                  values: values
                };
                _context25.next = 8;
                return _DbConnection.default.query(query);

              case 8:
                result = _context25.sent;
                return _context25.abrupt("return", result.rows);

              case 10:
                return _context25.abrupt("return", []);

              case 11:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25);
      }));

      function addGroupMember(_x33) {
        return _addGroupMember.apply(this, arguments);
      }

      return addGroupMember;
    }()
  }, {
    key: "getGroupMember",
    value: function () {
      var _getGroupMember = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee26(groupId, userId) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                query = {
                  text: 'select * from group_member where group_id = $1',
                  values: [groupId]
                };

                if (userId) {
                  query = {
                    text: 'select * from group_member where group_id = $1 and user_id =$2',
                    values: [groupId, userId]
                  };
                }

                _context26.next = 4;
                return _DbConnection.default.query(query);

              case 4:
                result = _context26.sent;
                return _context26.abrupt("return", result.rows);

              case 6:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26);
      }));

      function getGroupMember(_x34, _x35) {
        return _getGroupMember.apply(this, arguments);
      }

      return getGroupMember;
    }()
  }, {
    key: "deleteGroupMember",
    value: function () {
      var _deleteGroupMember = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee27(values) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                query = {
                  text: 'DELETE FROM group_member WHERE group_id =$1 and user_id =$2',
                  values: values
                };
                _context27.next = 3;
                return _DbConnection.default.query(query);

              case 3:
                result = _context27.sent;
                return _context27.abrupt("return", result.rows);

              case 5:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27);
      }));

      function deleteGroupMember(_x36) {
        return _deleteGroupMember.apply(this, arguments);
      }

      return deleteGroupMember;
    }()
  }, {
    key: "getGroupOwner",
    value: function () {
      var _getGroupOwner = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee28(id) {
        var query, result;
        return regeneratorRuntime.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                if (!id) {
                  _context28.next = 6;
                  break;
                }

                query = {
                  text: "SELECT a.*, b.email FROM groups a\n               INNER JOIN users b\n               ON a.id = $1 AND a.owner_id = b.id",
                  values: [id]
                };
                _context28.next = 4;
                return _DbConnection.default.query(query);

              case 4:
                result = _context28.sent;
                return _context28.abrupt("return", result.rows);

              case 6:
                return _context28.abrupt("return", []);

              case 7:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28);
      }));

      function getGroupOwner(_x37) {
        return _getGroupOwner.apply(this, arguments);
      }

      return getGroupOwner;
    }()
  }]);

  return Database;
}();

var _default = Database;
exports.default = _default;