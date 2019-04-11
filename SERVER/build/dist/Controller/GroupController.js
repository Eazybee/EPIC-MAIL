"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Db = _interopRequireDefault(require("../Utility/Db"));

var _Uitility = _interopRequireDefault(require("../Utility/Uitility"));

var _UserController = _interopRequireDefault(require("./UserController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GroupController =
/*#__PURE__*/
function () {
  function GroupController() {
    _classCallCheck(this, GroupController);
  }

  _createClass(GroupController, null, [{
    key: "createGroup",
    value: function createGroup(req, res) {
      var values = [_UserController.default.user.getId(), req.body.name];

      _Db.default.createGroup(values).then(function (rows) {
        if (rows.length === 1) {
          var group = rows[0];
          res.status(201).json({
            status: 201,
            data: [{
              id: group.id,
              name: group.name,
              role: 'admin'
            }]
          });
          values = [group.id, _UserController.default.user.getId()];

          _Db.default.addGroupMember(values);
        }
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "getGroups",
    value: function getGroups(req, res) {
      _Db.default.getAllGroups(_UserController.default.user.getId()).then(function (groups) {
        var count = 0;
        var data = [];

        if (groups.length > 0) {
          groups.forEach(function (group) {
            _Db.default.getGroupOwner(group.group_id).then(function (rows) {
              count += 1;
              data.push({
                id: group.group_id,
                name: rows[0].name,
                userId: rows[0].owner_id,
                userEmail: rows[0].email
              });

              if (count === groups.length) {
                res.status(200).json({
                  status: 200,
                  data: data
                });
              }
            });
          });
        } else {
          res.status(200).json({
            status: 200,
            data: [{
              message: 'You don\'t belong to any group'
            }]
          });
        }
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "getGroupMembers",
    value: function getGroupMembers(req, res) {
      var groupId = parseInt(req.params.id, 10);

      _Db.default.getGroupMembers(groupId).then(function (groupMembers) {
        res.status(200).json({
          status: 200,
          data: groupMembers
        });
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "updateGroupName",
    value: function updateGroupName(req, res) {
      var values = [req.body.name, req.params.id];

      _Db.default.updateGroupName(values).then(function () {
        res.status(200).json({
          status: 200,
          data: [{
            id: req.params.id,
            name: req.body.name,
            role: 'admin'
          }]
        });
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "deleteGroup",
    value: function deleteGroup(req, res) {
      var groudId = req.params.id;

      _Db.default.deleteGroup(groudId).then(function (rows) {
        var message = "Group ".concat(rows[0].name, " deleted ");
        res.status(204).json({
          status: 204,
          data: [{
            message: message
          }]
        });
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "addGroupMember",
    value: function addGroupMember(req, res) {
      var values = [req.params.id, req.body.userId];

      _Db.default.addGroupMember(values).then(function (rows) {
        if (rows[0]) {
          res.status(201).json({
            status: 201,
            data: [{
              id: req.params.id,
              userId: req.body.userId,
              role: 'member',
              userEmail: req.body.userEmail.toLowerCase()
            }]
          });
        } else {
          var userEmail = req.body.userEmail;
          var errorMessage = "User with email ".concat(userEmail, "  already exist in this group");

          _Uitility.default.handleError(res, errorMessage, 400);
        }
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "deleteGroupMember",
    value: function deleteGroupMember(req, res) {
      var values = [req.params.groupId, req.params.userId];
      var userId = parseInt(req.params.userId, 10);

      _Db.default.getUsers(userId).then(function (users) {
        var user = users[0];

        _Db.default.deleteGroupMember(values).then(function () {
          res.status(204).json({
            status: 204,
            data: [{
              message: "Member with email ".concat(user.email, "  deleted")
            }]
          });
        });
      }).catch(function (err) {
        var errorMessage = "SERVER ERROR: ".concat(err.message);

        _Uitility.default.handleError(res, errorMessage, 500);
      });
    }
  }, {
    key: "messageGroup",
    value: function messageGroup(req, res) {
      var members = req.members;
      var mailId;
      var dateTime = Date.now();
      var _req$body = req.body,
          subject = _req$body.subject,
          message = _req$body.message;
      members.forEach(function (member) {
        // Save the mail
        var values = [subject, message, _UserController.default.user.getId(), dateTime, 'sent'];

        _Db.default.addMessage(values).then(function (rows) {
          var _rows = _slicedToArray(rows, 1),
              savedMail = _rows[0];

          mailId = savedMail.id;
          var receiverId = member.user_id;
          values = [mailId, _UserController.default.user.getId(), 'sent', dateTime];
          _UserController.default.mailId = mailId; // insert into sents table

          _Db.default.insertSents(values); // insert into the inboxes table


          values = [mailId, receiverId, 'unread', dateTime];

          _Db.default.insertInboxes(values);

          try {
            res.status(201).json({
              status: 201,
              data: [{
                id: _UserController.default.mailId,
                createdOn: new Date(parseInt(dateTime, 10)).toLocaleString('en-US', {
                  timeZone: 'UTC'
                }),
                subject: subject,
                message: message,
                parentMessageId: null,
                status: 'sent'
              }]
            });
          } catch (e) {
            parseInt(e, 10);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      });
    }
  }, {
    key: "sendDraft",
    value: function sendDraft(req, res) {
      var members = req.members;
      var dateTime = Date.now();
      var _req$body2 = req.body,
          subject = _req$body2.subject,
          message = _req$body2.message,
          id = _req$body2.id;
      members.forEach(function (member, index) {
        if (index === 0) {
          var mailId = id;
          var receiverId = member.user_id;
          var values = [subject, message, 'sent', mailId];

          _Db.default.sendDraft(values, [receiverId, dateTime, 'sent', mailId]).then(function (rowCount) {
            if (rowCount === 1) {
              // insert into sents table
              values = [mailId, _UserController.default.user.getId(), 'sent', dateTime];

              _Db.default.insertSents(values); // insert into the inboxes table


              values = [mailId, receiverId, 'unread', dateTime];

              _Db.default.insertInboxes(values);

              try {
                res.status(200).json({
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
              } catch (e) {
                parseInt(e, 10);
              }
            }
          }).catch(function (err) {
            var errorMessage = "SERVER ERROR: ".concat(err.message);

            _Uitility.default.handleError(res, errorMessage, 500);
          });
        } else if (index > 0) {
          var _receiverId = member.user_id; // create mail

          var _values = [subject, message, _UserController.default.user.getId(), dateTime, 'sent'];

          _Db.default.addMessage(_values).then(function (rows) {
            var _rows2 = _slicedToArray(rows, 1),
                savedMail = _rows2[0];

            var mailId = savedMail.id;
            _values = [mailId, _UserController.default.user.getId(), 'sent', dateTime]; // insert into sents table

            _Db.default.insertSents(_values); // insert into the inboxes table


            _values = [mailId, _receiverId, 'unread', dateTime];

            _Db.default.insertInboxes(_values);
          }).catch(function (err) {
            var errorMessage = "SERVER ERROR: ".concat(err.message);

            _Uitility.default.handleError(res, errorMessage, 500);
          });
        }
      });
    }
  }]);

  return GroupController;
}();

var _default = GroupController;
exports.default = _default;