"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _Uitility = _interopRequireDefault(require("../Utility/Uitility"));

var _Db = _interopRequireDefault(require("../Utility/Db"));

var _User = _interopRequireDefault(require("../Model/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UserController =
/*#__PURE__*/
function () {
  function UserController() {
    _classCallCheck(this, UserController);
  }

  _createClass(UserController, null, [{
    key: "signUp",
    value: function signUp(req, res) {
      var _req$body = req.body,
          firstName = _req$body.firstName,
          lastName = _req$body.lastName,
          email = _req$body.email,
          password = _req$body.password;
      var saltRounds = 10;

      _bcrypt.default.hash(password, saltRounds, function (err, hash) {
        if (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        } else if (hash) {
          var values = [firstName, lastName, email.toLowerCase(), hash];

          _Db.default.addUser(values).then(function (rows) {
            var id = rows[0].id;
            var user = new _User.default(id, email.toLowerCase(), firstName, lastName, password);

            var token = _Uitility.default.getToken(user, '1s');

            res.status(201).json({
              status: 201,
              data: [{
                token: token
              }]
            });
          }).catch(function (error) {
            var errorMessage = "SERVER ERROR: ".concat(error.message);

            _Uitility.default.handleError(res, errorMessage, 500);
          });
        } else {
          var _errorMessage = 'SERVER ERROR';

          _Uitility.default.handleError(res, _errorMessage, 500);
        }
      });
    }
  }, {
    key: "login",
    value: function login(req, res) {
      var user = req.user;
      UserController.user = user;

      var token = _Uitility.default.getToken(user);

      UserController.token = token;
      res.status(200).json({
        status: 200,
        data: [{
          token: token
        }]
      });
    }
  }, {
    key: "reset",
    value: function reset(req, res) {
      var user = req.user;
      var saltRounds = 10;

      _bcrypt.default.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
          var errorMessage = "SERVER ERROR: ".concat(err.message);

          _Uitility.default.handleError(res, errorMessage, 500);
        } else if (hash) {
          var values = [hash, user.getId()];

          _Db.default.reset(values).then(function () {
            var token = _Uitility.default.getToken(user);

            _Uitility.default.mail(user.getEmail(), token).then(function () {
              res.status(200).json({
                status: 200,
                data: [{
                  message: 'Check your mail for Password Reset Confirmation link.'
                }]
              });
            }).catch(function (error) {
              var errorMessage = "SERVER ERROR: ".concat(error.message);

              _Uitility.default.handleError(res, errorMessage, 500);
            });
          }).catch(function (error) {
            var errorMessage = "SERVER ERROR: ".concat(error.message);

            _Uitility.default.handleError(res, errorMessage, 500);
          });
        } else {
          var _errorMessage2 = 'SERVER ERROR';

          _Uitility.default.handleError(res, _errorMessage2, 500);
        }
      });
    }
  }, {
    key: "updatePassword",
    value: function updatePassword(req, res) {
      var userId = req.payload.id;

      _Db.default.updatePassword(userId).then(function () {
        res.status(200).json({
          status: 200,
          data: [{
            message: 'Password Reset Successful!'
          }]
        });
      }).catch(function () {
        var errorMessage = 'Invalid or Expired authorization token';

        _Uitility.default.handleError(res, errorMessage, 400);
      });
    }
  }]);

  return UserController;
}();

var _default = UserController;
exports.default = _default;