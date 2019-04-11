"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _User = _interopRequireDefault(require("../Model/User"));

var _Db = _interopRequireDefault(require("../Utility/Db"));

var _Uitility = _interopRequireDefault(require("../Utility/Uitility"));

var _UserController = _interopRequireDefault(require("../Controller/UserController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Validate =
/*#__PURE__*/
function () {
  function Validate() {
    _classCallCheck(this, Validate);
  }

  _createClass(Validate, null, [{
    key: "isLoggedIn",
    value: function isLoggedIn(req, res, next) {
      var token = req.headers.authorization;

      if (!_UserController.default.user) {
        var errorMessage = 'User is not logged in';

        _Uitility.default.handleError(res, errorMessage, 401);
      } else if (!token) {
        var _errorMessage = 'Authorization token required';

        _Uitility.default.handleError(res, _errorMessage, 401);
      } else {
        _jsonwebtoken.default.verify(token, process.env.JWT_PRIVATE_SECRET, function (err, payload) {
          if (err) {
            var _errorMessage2 = 'Invalid authorization token';

            _Uitility.default.handleError(res, _errorMessage2, 401);
          }

          if (payload) {
            var _payload$payload = payload.payload,
                id = _payload$payload.id,
                email = _payload$payload.email,
                firstName = _payload$payload.firstName,
                lastName = _payload$payload.lastName,
                password = _payload$payload.password;
            _UserController.default.user = new _User.default(id, email, firstName, lastName, password);
            next();
          }
        });
      }
    }
  }, {
    key: "signup",
    value: function signup(req, res, next) {
      var schema = _joi.default.object().keys({
        email: _joi.default.string().email({
          minDomainAtoms: 2
        }).required(),
        firstName: _joi.default.string().required(),
        lastName: _joi.default.string(),
        password: _joi.default.string().required(),
        rePassword: _joi.default.string().required()
      });

      var _Joi$validate = _joi.default.validate(req.body, schema),
          error = _Joi$validate.error;

      if (error) {
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else {
        _Db.default.getUsers().then(function (users) {
          var userExist = users.some(function (user) {
            return user.email === req.body.email.toLowerCase();
          });

          if (req.body.password !== req.body.rePassword) {
            var _errorMessage3 = 'Password does not match';

            _Uitility.default.handleError(res, _errorMessage3, 400);
          } else if (userExist) {
            var _errorMessage4 = 'User with this email exist';

            _Uitility.default.handleError(res, _errorMessage4, 409);
          } else {
            next();
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "login",
    value: function login(req, res, next) {
      var schema = _joi.default.object().keys({
        email: _joi.default.string().email({
          minDomainAtoms: 2
        }).required(),
        password: _joi.default.string().required()
      });

      var _Joi$validate2 = _joi.default.validate(req.body, schema),
          error = _Joi$validate2.error;

      if (error) {
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else {
        _Db.default.getUsers().then(function (users) {
          var user = users.find(function (dbuser) {
            return dbuser.email === req.body.email.toLowerCase();
          });

          if (user) {
            _bcrypt.default.compare(req.body.password, user.password, function (err, result) {
              if (err) {
                var _errorMessage5 = 'Unauthorized: Invalid Credentials';

                _Uitility.default.handleError(res, _errorMessage5, 401);
              } else if (result) {
                var _user = user,
                    id = _user.id,
                    email = _user.email;
                var firstName = user.first_name;
                user = new _User.default(id, email.toLowerCase(), firstName);
                req.user = user;
                next();
              } else {
                var _errorMessage6 = 'Unauthorized: Invalid Credentials';

                _Uitility.default.handleError(res, _errorMessage6, 401);
              }
            });
          } else {
            var _errorMessage7 = 'Unauthorized: Invalid Credentials';

            _Uitility.default.handleError(res, _errorMessage7, 401);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "reset",
    value: function reset(req, res, next) {
      var schema = _joi.default.object().keys({
        email: _joi.default.string().email({
          minDomainAtoms: 2
        }).required(),
        password: _joi.default.string().required()
      });

      var _Joi$validate3 = _joi.default.validate(req.body, schema),
          error = _Joi$validate3.error;

      if (error) {
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else {
        _Db.default.getUsers().then(function (users) {
          var user = users.find(function (dbuser) {
            return dbuser.email === req.body.email.toLowerCase();
          });

          if (user) {
            user = new _User.default(user.id, user.email, user.first_name);
            req.user = user;
            next();
          } else {
            var _errorMessage8 = "User with email ".concat(req.body.email, " does not exist");

            _Uitility.default.handleError(res, _errorMessage8, 400);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "resetConfirmation",
    value: function resetConfirmation(req, res, next) {
      var schema = _joi.default.object().keys({
        token: _joi.default.string().required()
      });

      var _Joi$validate4 = _joi.default.validate(req.body, schema),
          error = _Joi$validate4.error;

      if (error) {
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else {
        var token = req.body.token;

        _jsonwebtoken.default.verify(token, process.env.JWT_PRIVATE_SECRET, function (err, payload) {
          if (err) {
            var _errorMessage9 = 'aInvalid or Expired authorization token';

            _Uitility.default.handleError(res, _errorMessage9, 401);
          }

          if (payload) {
            req.payload = payload.payload;
            next();
          }
        });
      }
    }
  }, {
    key: "sendMail",
    value: function sendMail(req, res, next) {
      var schema = _joi.default.object().keys({
        subject: _joi.default.string().required(),
        message: _joi.default.string().required(),
        receiverEmail: _joi.default.string().email({
          minDomainAtoms: 2
        }).required()
      });

      var _Joi$validate5 = _joi.default.validate(req.body, schema),
          error = _Joi$validate5.error;

      if (error) {
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else {
        var receiverEmail = req.body.receiverEmail;

        _Db.default.getUserId(receiverEmail.toLowerCase()).then(function (rows) {
          if (rows.length === 1) {
            req.body.receiverId = rows[0].id;
            next();
          } else {
            var _errorMessage10 = "User with email ".concat(receiverEmail, " does not exist!");

            _Uitility.default.handleError(res, _errorMessage10, 400);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "saveDraft",
    value: function saveDraft(req, res, next) {
      var schema = _joi.default.object().keys({
        subject: _joi.default.string().required(),
        message: _joi.default.string().required(),
        receiverEmail: _joi.default.string().email({
          minDomainAtoms: 2
        }),
        id: _joi.default.number()
      });

      var _Joi$validate6 = _joi.default.validate(req.body, schema),
          error = _Joi$validate6.error;

      if (error) {
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else if (req.body.receiverEmail || req.body.id) {
        var receiverEmail = req.body.receiverEmail;

        if (receiverEmail) {
          receiverEmail = receiverEmail.toLowerCase();
        }

        var msgId = req.body.id;

        if (msgId) {
          _Db.default.getMessages(msgId, 'draft', _UserController.default.user.getId()).then(function (rows) {
            if (rows.length === 1) {
              if (receiverEmail) {
                _Db.default.getUserId(receiverEmail).then(function (rows2) {
                  if (rows2.length === 1) {
                    req.body.receiverId = rows2[0].id;
                    next();
                  } else {
                    var _errorMessage11 = "User with email ".concat(receiverEmail, " does not exist!");

                    _Uitility.default.handleError(res, _errorMessage11, 400);
                  }
                });
              } else {
                next();
              }
            } else {
              var _errorMessage12 = 'Draft message does not exist!';

              _Uitility.default.handleError(res, _errorMessage12, 400);
            }
          }).catch(function (err) {
            var errorMessage = "SERVER ERROR: ".concat(err.message);

            _Uitility.default.handleError(res, errorMessage, 500);
          });
        } else if (receiverEmail) {
          _Db.default.getUserId(receiverEmail).then(function (rows) {
            if (rows.length === 1) {
              req.body.receiverId = rows[0].id;
              next();
            } else {
              var _errorMessage13 = "User with email ".concat(receiverEmail, " does not exist!");

              _Uitility.default.handleError(res, _errorMessage13, 400);
            }
          }).catch(function (err) {
            var errorMessage = "SERVER ERROR: ".concat(err.message);

            _Uitility.default.handleError(res, errorMessage, 500);
          });
        }
      } else {
        next();
      }
    }
  }, {
    key: "sendDraft",
    value: function sendDraft(req, res, next) {
      var schema = _joi.default.object().keys({
        id: _joi.default.number().required(),
        subject: _joi.default.string().required(),
        message: _joi.default.string().required(),
        parentMessageId: _joi.default.number(),
        receiverEmail: _joi.default.string().email({
          minDomainAtoms: 2
        }).required()
      });

      var _Joi$validate7 = _joi.default.validate(req.body, schema),
          error = _Joi$validate7.error;

      if (error) {
        // if schema exist
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else {
        var receiverEmail = req.body.receiverEmail;

        _Db.default.getUserId(receiverEmail.toLowerCase()).then(function (rows) {
          if (rows.length === 1) {
            req.body.receiverId = rows[0].id;
            var draftMsgId = req.body.id;

            _Db.default.getDraftId(draftMsgId, _UserController.default.user.getId()).then(function (rows2) {
              if (rows2.length === 1) {
                next();
              } else {
                var _errorMessage14 = 'Draft message does not exist!';

                _Uitility.default.handleError(res, _errorMessage14, 400);
              }
            });
          } else {
            var _errorMessage15 = "User with email ".concat(receiverEmail, " does not exist!");

            _Uitility.default.handleError(res, _errorMessage15, 400);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "mailId",
    value: function mailId(req, res, next) {
      var mailId = parseInt(req.params.id, 10) || parseInt(req.body.id, 10);

      var schema = _joi.default.number().required();

      var _Joi$validate8 = _joi.default.validate(mailId, schema),
          error = _Joi$validate8.error;

      if (error) {
        var errorMessage = '\'id\' must be a number';

        _Uitility.default.handleError(res, errorMessage, 400);
      } else {
        _Db.default.getMessages(mailId, 'inbox').then(function (rows) {
          if (rows.length > 0) {
            //  Checking if mail exist
            var mail = rows[0];
            var receiverId = mail.receiver_id;
            var loggedInUser = _UserController.default.user;

            if (loggedInUser.getId() === receiverId) {
              next();
            } else {
              var _errorMessage16 = 'Message does not exist!';

              _Uitility.default.handleError(res, _errorMessage16, 404);
            }
          } else {
            var _errorMessage17 = 'Message does not exist!';

            _Uitility.default.handleError(res, _errorMessage17, 404);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "sentMailId",
    value: function sentMailId(req, res, next) {
      var mailId = parseInt(req.params.id, 10);

      var schema = _joi.default.number().required();

      var _Joi$validate9 = _joi.default.validate(mailId, schema),
          error = _Joi$validate9.error;

      if (error) {
        var errorMessage = '\'id\' must be a number';

        _Uitility.default.handleError(res, errorMessage, 400);
      } else {
        _Db.default.getMessages(mailId, 'sent', _UserController.default.user.getId()).then(function (rows) {
          if (rows.length === 1) {
            //  Checking if mail exist
            req.rows = rows;
            next();
          } else {
            var _errorMessage18 = 'Message does not exist!';

            _Uitility.default.handleError(res, _errorMessage18, 404);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "deleteWithId",
    value: function deleteWithId(req, res, next, table) {
      var schema = _joi.default.object().keys({
        id: _joi.default.number().required()
      });

      var _Joi$validate10 = _joi.default.validate(req.params, schema),
          error = _Joi$validate10.error;

      if (error) {
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else {
        var mailId = parseInt(req.params.id, 10);

        _Db.default.getMessages(mailId, table, _UserController.default.user.getId()).then(function (rows) {
          var mail = rows.rows[0];

          if (mail) {
            req.deleteType = rows.deleteType;
            next();
          } else {
            var _errorMessage19 = 'Message does not exist!';

            _Uitility.default.handleError(res, _errorMessage19, 404);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "deleteInboxWithId",
    value: function deleteInboxWithId(req, res, next) {
      Validate.deleteWithId(req, res, next, 'deleteInbox');
    }
  }, {
    key: "deleteSentWithId",
    value: function deleteSentWithId(req, res, next) {
      Validate.deleteWithId(req, res, next, 'deleteSent');
    }
  }, {
    key: "deleteDrafttWithId",
    value: function deleteDrafttWithId(req, res, next) {
      Validate.deleteWithId(req, res, next, 'deleteDraft');
    }
  }, {
    key: "createGroup",
    value: function createGroup(req, res, next) {
      var schema = _joi.default.object().keys({
        name: _joi.default.string().required()
      });

      var _Joi$validate11 = _joi.default.validate(req.body, schema),
          error = _Joi$validate11.error;

      if (error) {
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else {
        _Db.default.getGroups(_UserController.default.user.getId()).then(function (groups) {
          if (groups.length > 0) {
            var groupExist = groups.some(function (group) {
              return group.name === req.body.name;
            });

            if (groupExist) {
              var _errorMessage20 = 'Group with the same name exist';

              _Uitility.default.handleError(res, _errorMessage20, 400);
            } else {
              next();
            }
          } else {
            next();
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "updateGroupName",
    value: function updateGroupName(req, res, next) {
      var schema = _joi.default.object().keys({
        id: _joi.default.number().required()
      });

      var schema2 = _joi.default.object().keys({
        name: _joi.default.string().required()
      });

      var _Joi$validate12 = _joi.default.validate(req.params, schema),
          error = _Joi$validate12.error;

      var error2 = _joi.default.validate(req.body, schema2);

      if (error) {
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else if (error2.error) {
        var _errorMessage21 = error2.error.details[0].message;

        _Uitility.default.handleError(res, _errorMessage21, 400);
      } else {
        _Db.default.getGroups().then(function (groups) {
          var groupExist = groups.find(function (group) {
            return group.id === parseInt(req.params.id, 10);
          });

          if (groupExist) {
            if (groupExist.owner_id === _UserController.default.user.getId()) {
              var sameName = groups.some(function (group) {
                return group.name === req.body.name && group.id !== groupExist.id && group.owner_id === _UserController.default.user.getId();
              });

              if (sameName) {
                var _errorMessage22 = 'Another group with same name exist';

                _Uitility.default.handleError(res, _errorMessage22, 409);
              } else {
                next();
              }
            } else {
              var _errorMessage23 = 'Only group owner can update group name';

              _Uitility.default.handleError(res, _errorMessage23, 404);
            }
          } else {
            var _errorMessage24 = 'Group with the id does not exist';

            _Uitility.default.handleError(res, _errorMessage24, 404);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "deleteGroup",
    value: function deleteGroup(req, res, next) {
      var schema = _joi.default.object().keys({
        id: _joi.default.number().required()
      });

      var _Joi$validate13 = _joi.default.validate(req.params, schema),
          error = _Joi$validate13.error;

      if (error) {
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else {
        _Db.default.getGroups().then(function (allGroups) {
          var groupExist = allGroups.find(function (group) {
            return group.id === parseInt(req.params.id, 10);
          });

          if (groupExist) {
            _Db.default.getGroups(_UserController.default.user.getId()).then(function (groups) {
              groupExist = groups.find(function (group) {
                return group.id === parseInt(req.params.id, 10);
              });

              if (groupExist) {
                next();
              } else {
                var _errorMessage25 = 'Only group owner can delete a group';

                _Uitility.default.handleError(res, _errorMessage25, 400);
              }
            });
          } else {
            var _errorMessage26 = 'Group with the id does not exist';

            _Uitility.default.handleError(res, _errorMessage26, 400);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "groupId",
    value: function groupId(req, res, next) {
      var groupId = parseInt(req.params.id, 10);

      var schema = _joi.default.number().required();

      var _Joi$validate14 = _joi.default.validate(groupId, schema),
          error = _Joi$validate14.error;

      if (error) {
        var errorMessage = '\'id\' must be a number';

        _Uitility.default.handleError(res, errorMessage, 400);
      } else {
        _Db.default.getAllGroups(_UserController.default.user.getId()).then(function (groups) {
          var groupExist = groups.find(function (group) {
            return group.group_id === groupId;
          });

          if (groupExist) {
            next();
          } else {
            var _errorMessage27 = 'Group does not exist';

            _Uitility.default.handleError(res, _errorMessage27, 400);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "addGroupMember",
    value: function addGroupMember(req, res, next) {
      var schema = _joi.default.object().keys({
        id: _joi.default.number().required()
      });

      var schema2 = _joi.default.object().keys({
        userEmail: _joi.default.string().email({
          minDomainAtoms: 2
        }).required()
      });

      var _Joi$validate15 = _joi.default.validate(req.params, schema),
          error = _Joi$validate15.error;

      var error2 = _joi.default.validate(req.body, schema2);

      if (error) {
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else if (error2.error) {
        var _errorMessage28 = error2.error.details[0].message;

        _Uitility.default.handleError(res, _errorMessage28, 400);
      } else {
        _Db.default.getGroups().then(function (allGroups) {
          var groupExist = allGroups.find(function (group) {
            return group.id === parseInt(req.params.id, 10);
          });

          if (groupExist) {
            _Db.default.getGroups(_UserController.default.user.getId()).then(function (groups) {
              var groupId = parseInt(req.params.id, 10);
              groupExist = groups.find(function (group) {
                return group.id === groupId;
              });

              if (groupExist) {
                var userEmail = req.body.userEmail;

                _Db.default.getUserId(userEmail.toLowerCase()).then(function (rows) {
                  if (rows.length === 1) {
                    req.body.userId = rows[0].id;
                    next();
                  } else {
                    var _errorMessage29 = "User with email ".concat(userEmail, " does not exist!");

                    _Uitility.default.handleError(res, _errorMessage29, 400);
                  }
                }).catch(function (err) {
                  var errorMessage = "SERVER ERROR: ".concat(err.message);

                  _Uitility.default.handleError(res, errorMessage, 500);
                });
              } else {
                var _errorMessage30 = 'Only Group owners are allowed to add members';

                _Uitility.default.handleError(res, _errorMessage30, 400);
              }
            });
          } else {
            var _errorMessage31 = 'Group does not exist';

            _Uitility.default.handleError(res, _errorMessage31, 400);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "deleteGroupMember",
    value: function deleteGroupMember(req, res, next) {
      var schema = _joi.default.object().keys({
        groupId: _joi.default.number().required(),
        userId: _joi.default.number().required()
      });

      var _Joi$validate16 = _joi.default.validate(req.params, schema),
          error = _Joi$validate16.error;

      if (error) {
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else {
        var groupId = parseInt(req.params.groupId, 10);

        _Db.default.getGroups().then(function (allGroups) {
          var groupExist = allGroups.find(function (group) {
            return group.id === groupId;
          });

          if (groupExist) {
            _Db.default.getGroups(_UserController.default.user.getId()).then(function (groups) {
              groupExist = groups.find(function (group) {
                return group.id === groupId;
              });

              if (groupExist) {
                var userId = parseInt(req.params.userId, 10);

                _Db.default.getGroupMember(groupId, userId).then(function (rows) {
                  if (rows.length === 1) {
                    next();
                  } else {
                    var _errorMessage32 = 'User with this id does not exist in this group';

                    _Uitility.default.handleError(res, _errorMessage32, 400);
                  }
                });
              } else {
                var _errorMessage33 = 'Only group owner can delete group member';

                _Uitility.default.handleError(res, _errorMessage33, 400);
              }
            });
          } else {
            var _errorMessage34 = 'Group with this id does not exist';

            _Uitility.default.handleError(res, _errorMessage34, 400);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "messageGroup",
    value: function messageGroup(req, res, next) {
      var schema = _joi.default.object().keys({
        id: _joi.default.number().required()
      });

      var schema2 = _joi.default.object().keys({
        subject: _joi.default.string().required(),
        message: _joi.default.string().required()
      });

      var _Joi$validate17 = _joi.default.validate(req.params, schema),
          error = _Joi$validate17.error;

      var error2 = _joi.default.validate(req.body, schema2);

      if (error) {
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else if (error2.error) {
        var _errorMessage35 = error2.error.details[0].message;

        _Uitility.default.handleError(res, _errorMessage35, 400);
      } else {
        _Db.default.getAllGroups(_UserController.default.user.getId()).then(function (groups) {
          var groupId = parseInt(req.params.id, 10);
          var groupExist = groups.find(function (group) {
            return group.group_id === groupId;
          });

          if (groupExist) {
            _Db.default.getGroupMember(groupId).then(function (rows) {
              if (rows.length > 0) {
                req.members = rows;
                next();
              } else {
                var _errorMessage36 = 'Sending message to an empty group';

                _Uitility.default.handleError(res, _errorMessage36, 400);
              }
            });
          } else {
            var _errorMessage37 = 'Group with the id does not exist';

            _Uitility.default.handleError(res, _errorMessage37, 400);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }, {
    key: "sendDraftToGroup",
    value: function sendDraftToGroup(req, res, next) {
      var schema = _joi.default.object().keys({
        id: _joi.default.number().required()
      });

      var schema2 = _joi.default.object().keys({
        id: _joi.default.number().required(),
        subject: _joi.default.string().required(),
        message: _joi.default.string().required()
      });

      var _Joi$validate18 = _joi.default.validate(req.params, schema),
          error = _Joi$validate18.error;

      var error2 = _joi.default.validate(req.body, schema2);

      if (error) {
        var errorMessage = error.details[0].message;

        _Uitility.default.handleError(res, errorMessage, 400);
      } else if (error2.error) {
        var _errorMessage38 = error2.error.details[0].message;

        _Uitility.default.handleError(res, _errorMessage38, 400);
      } else {
        _Db.default.getAllGroups(_UserController.default.user.getId()).then(function (groups) {
          var groupId = parseInt(req.params.id, 10);
          var groupExist = groups.find(function (group) {
            return group.group_id === groupId;
          });

          if (groupExist) {
            _Db.default.getGroupMember(groupId).then(function (rows) {
              if (rows.length > 0) {
                var draftMsgId = req.body.id;

                _Db.default.getDraftId(draftMsgId, _UserController.default.user.getId()).then(function (rows2) {
                  if (rows2.length === 1) {
                    req.members = rows;
                    next();
                  } else {
                    var _errorMessage39 = 'Draft message does not exist!';

                    _Uitility.default.handleError(res, _errorMessage39, 400);
                  }
                });
              } else {
                var _errorMessage40 = 'Sending message to an empty group';

                _Uitility.default.handleError(res, _errorMessage40, 400);
              }
            });
          } else {
            var _errorMessage41 = 'Group with the id does not exist';

            _Uitility.default.handleError(res, _errorMessage41, 400);
          }
        }).catch(function (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        });
      }
    }
  }]);

  return Validate;
}();

var _default = Validate;
exports.default = _default;