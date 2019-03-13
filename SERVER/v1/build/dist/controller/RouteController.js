"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _Message = _interopRequireDefault(require("../model/Message"));

var _Database = _interopRequireDefault(require("../model/Database"));

var _User = _interopRequireDefault(require("../model/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RouteController =
/*#__PURE__*/
function () {
  function RouteController() {
    _classCallCheck(this, RouteController);
  }

  _createClass(RouteController, null, [{
    key: "handleError",
    value: function handleError(res, err) {
      var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 400;
      res.status(status).send({
        status: status,
        error: err.message
      });
    }
  }, {
    key: "validateLogin",
    value: function validateLogin(req, res, next) {
      if (RouteController.user) {
        //  Get auth header value
        var bearerHeader = req.headers.authorization;

        if (bearerHeader && RouteController.token === bearerHeader) {
          req.token = bearerHeader;
          next();
        } else {
          res.status(401).json({
            status: 401,
            error: 'Unauthorized'
          });
        }
      } else {
        res.status(401).json({
          status: 401,
          error: 'Unauthorized'
        });
      }
    }
  }, {
    key: "signUp",
    value: function signUp(req, res) {
      var schema = _joi.default.object().keys({
        email: _joi.default.string().required(),
        firstName: _joi.default.string().required(),
        lastName: _joi.default.string().required(),
        password: _joi.default.string().required(),
        rePassword: _joi.default.string().required()
      });

      var _Joi$validate = _joi.default.validate(req.body, schema),
          error = _Joi$validate.error;

      if (error) {
        return RouteController.handleError(res, new Error(error.details[0].message), 400);
      }

      if (req.body.password !== req.body.rePassword) {
        return res.status(400).json({
          status: 400,
          error: 'Password does not match'
        });
      }

      var userExist = _User.default.getUsers().some(function (user) {
        return user.getEmail() === req.body.email;
      });

      if (userExist) {
        return res.status(400).json({
          status: 400,
          error: 'User with this email exist'
        });
      }

      var newUser = new _User.default(req.body.email, req.body.firstName, req.body.lastName, req.body.password);

      _Database.default.push(newUser);

      return _jsonwebtoken.default.sign({
        newUser: newUser
      }, 'Andela42', function (err, token) {
        return res.status(201).json({
          status: 201,
          data: [{
            token: token
          }]
        });
      });
    }
  }, {
    key: "login",
    value: function login(req, res) {
      var schema = _joi.default.object().keys({
        email: _joi.default.string().email().required(),
        password: _joi.default.string().required()
      });

      var _Joi$validate2 = _joi.default.validate(req.body, schema),
          error = _Joi$validate2.error;

      if (error) {
        RouteController.handleError(res, new Error(error.details[0].message), 400);
      }

      var user = _Database.default.find(function (dbuser) {
        return dbuser.getEmail() === req.body.email && dbuser.getPassword() === req.body.password;
      });

      if (user) {
        RouteController.user = user;

        _jsonwebtoken.default.sign({
          user: user
        }, 'Andela42', function (err, token) {
          RouteController.token = token;
          res.status(200).json({
            status: 200,
            data: [{
              token: token
            }]
          });
        });
      } else {
        res.status(401).json({
          status: 401,
          error: 'Unauthorized'
        });
      }
    }
  }, {
    key: "saveMail",
    value: function saveMail(req, res) {
      var schema = _joi.default.object().keys({
        subject: _joi.default.string().required(),
        message: _joi.default.string().required(),
        receiverId: _joi.default.string(),
        toUserId: _joi.default.number()
      });

      var _Joi$validate3 = _joi.default.validate(req.body, schema),
          error = _Joi$validate3.error;

      if (error) {
        var errorMessage = new Error(error.details[0].message);
        RouteController.handleError(res, errorMessage, 400);
      }

      try {
        var mail = RouteController.user.createMail({
          subject: req.body.subject,
          message: req.body.message,
          receiverId: req.body.receiverId
        });
        return {
          status: 201,
          data: [{
            id: mail.getId(),
            createdOn: mail.getCreationDateTime(),
            subject: mail.getSubject(),
            message: mail.getMessage(),
            parentMessageId: mail.getParentMessageId(),
            status: mail.getStatus()
          }]
        };
      } catch (err) {
        return RouteController.handleError(res, err, 400);
      }
    }
  }, {
    key: "sendDraftUtility",
    value: function sendDraftUtility(req, res) {
      var schema = _joi.default.object().keys({
        id: _joi.default.number().required(),
        subject: _joi.default.string().required(),
        message: _joi.default.string().required(),
        parentMessageId: _joi.default.number(),
        toUserId: _joi.default.number().required()
      });

      var _Joi$validate4 = _joi.default.validate(req.body, schema),
          error = _Joi$validate4.error;

      if (error) {
        RouteController.handleError(res, new Error(error.details[0].message), 400);
      }

      try {
        var mail = _Message.default.getMails(parseInt(req.body.id, 10))[0];

        mail.setSubject(req.body.subject);
        mail.setMessage(req.body.message);
        RouteController.user.sendMail({
          message: mail,
          toUserId: parseInt(req.body.toUserId, 10)
        });

        var _Message$getMails = _Message.default.getMails(req.body.id),
            _Message$getMails2 = _slicedToArray(_Message$getMails, 1),
            mailObj = _Message$getMails2[0];

        return {
          status: 201,
          data: [{
            id: mailObj.getId(),
            createdOn: mailObj.getCreationDateTime(),
            subject: mailObj.getSubject(),
            message: mailObj.getMessage(),
            parentMessageId: mailObj.getParentMessageId(),
            status: mailObj.getStatus()
          }]
        };
      } catch (err) {
        return RouteController.handleError(res, err, 404);
      }
    }
  }, {
    key: "getSentMail",
    value: function getSentMail(req, res) {
      _jsonwebtoken.default.verify(req.token, 'Andela42', function (err) {
        if (err) {
          res.status(401).json({
            status: 401,
            error: 'Unauthorized'
          });
        } else {
          res.status(200).json({
            status: 200,
            data: RouteController.user.getSentMail()
          });
        }
      });
    }
  }, {
    key: "deleteMail",
    value: function deleteMail(req, res) {
      _jsonwebtoken.default.verify(req.token, 'Andela42', function (err) {
        if (err) {
          res.status(401).json({
            status: 401,
            error: 'Unauthorized'
          });
        } else {
          var schema = _joi.default.number().required();

          var _Joi$validate5 = _joi.default.validate(req.params.id, schema),
              error = _Joi$validate5.error;

          if (error) {
            RouteController.handleError(res, new Error(error.details[0].message), 400);
          }

          var mailId = parseInt(req.params.id, 10);

          try {
            // Checking if mail exist and return message
            var mailMessage = _Message.default.getMails(mailId)[0].getMessage(); // Delete mail


            _User.default.deleteMail(mailId);

            res.status(200).json({
              status: 200,
              data: [{
                message: mailMessage
              }]
            });
          } catch (er) {
            RouteController.handleError(res, new Error(er.message), 404);
          }
        }
      });
    }
  }, {
    key: "saveDraft",
    value: function saveDraft(req, res) {
      _jsonwebtoken.default.verify(req.token, 'Andela42', function (err) {
        if (err) {
          res.status(401).json({
            status: 401,
            error: 'Unauthorized'
          });
        } else {
          res.status(201).send(RouteController.saveMail(req, res));
        }
      });
    }
  }, {
    key: "sendDraft",
    value: function sendDraft(req, res) {
      _jsonwebtoken.default.verify(req.token, 'Andela42', function (err) {
        if (err) {
          res.status(401).json({
            status: 401,
            error: 'Unauthorized'
          });
        } else {
          res.status(201).json(RouteController.sendDraftUtility(req, res));
        }
      });
    }
  }, {
    key: "message",
    value: function message(req, res) {
      _jsonwebtoken.default.verify(req.token, 'Andela42', function (err) {
        if (err) {
          res.status(401).json({
            status: 401,
            error: 'Unauthorized'
          });
        } else {
          var schema = _joi.default.object().keys({
            subject: _joi.default.string().required(),
            message: _joi.default.string().required(),
            parentMessageId: _joi.default.number(),
            toUserId: _joi.default.number().required()
          });

          var _Joi$validate6 = _joi.default.validate(req.body, schema),
              error = _Joi$validate6.error;

          if (error) {
            RouteController.handleError(res, new Error(error.details[0].message), 400);
          } else {
            // Save the mail
            var savedMail = RouteController.saveMail(req, res); // Send the mail

            req.body.id = savedMail.data[0].id;
            var sentMail = RouteController.sendDraftUtility(req, res);
            res.status(201).json(sentMail);
          }
        }
      });
    }
  }, {
    key: "getMailId",
    value: function getMailId(req, res) {
      _jsonwebtoken.default.verify(req.token, 'Andela42', function (err) {
        if (err) {
          res.status(401).json({
            status: 401,
            error: 'Unauthorized'
          });
        } else {
          try {
            res.status(200).json({
              status: 200,
              data: _Message.default.getMails(parseInt(req.params.id, 10))
            });
          } catch (er) {
            res.status(404).json({
              status: 404,
              error: er.message
            });
          }
        }
      });
    }
  }, {
    key: "getInbox",
    value: function getInbox(req, res) {
      _jsonwebtoken.default.verify(req.token, 'Andela42', function (err) {
        if (err) {
          res.status(401).json({
            status: 401,
            error: 'Unauthorized'
          });
        } else {
          res.status(200).json({
            status: 200,
            data: RouteController.user.inbox()
          });
        }
      });
    }
  }, {
    key: "getReadInbox",
    value: function getReadInbox(req, res) {
      _jsonwebtoken.default.verify(req.token, 'Andela42', function (err) {
        if (err) {
          res.status(401).json({
            status: 401,
            error: 'Unauthorized'
          });
        } else {
          res.status(200).json({
            status: 200,
            data: RouteController.user.readInbox()
          });
        }
      });
    }
  }, {
    key: "getUnreadInbox",
    value: function getUnreadInbox(req, res) {
      _jsonwebtoken.default.verify(req.token, 'Andela42', function (err) {
        if (err) {
          res.status(401).json({
            status: 401,
            error: 'Unauthorized'
          });
        } else {
          res.status(200).json({
            status: 200,
            data: RouteController.user.unReadInbox()
          });
        }
      });
    }
  }]);

  return RouteController;
}();

RouteController.user = null;
RouteController.token = null;
var _default = RouteController;
exports.default = _default;