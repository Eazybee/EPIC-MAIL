"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Utility =
/*#__PURE__*/
function () {
  function Utility() {
    _classCallCheck(this, Utility);
  }

  _createClass(Utility, null, [{
    key: "getToken",
    value: function getToken(payload) {
      var expiresIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1h';

      _dotenv.default.config();

      var token = _jsonwebtoken.default.sign({
        payload: payload
      }, process.env.JWT_PRIVATE_SECRET, {
        expiresIn: expiresIn
      });

      return token;
    }
  }, {
    key: "mail",
    value: function mail(to, token) {
      var endpoint = 'http://127.0.0.1:5500/UI/pages/loginPage.html';

      var transporter = _nodemailer.default.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
        }
      });

      var mailOptions = {
        from: 'no-reply@robot.com',
        to: 'ilorieazykiel@gmail.com',
        subject: 'EPICMAIL: Password Reset Confirmation',
        html: "<p>Confirm password reset on your epicmail account: <a href='".concat(endpoint, "?r=").concat(token, "'>Confirm Password Reset</a></p>\n             <p>Ignore if this password request was not made by you. Stay EPIC!</p>")
      };
      return transporter.sendMail(mailOptions);
    }
  }, {
    key: "handleError",
    value: function handleError(res, errorMessage) {
      var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 400;
      var error = errorMessage.replace(/"/g, "'");
      res.status(status).json({
        status: status,
        error: error
      });
    }
  }]);

  return Utility;
}();

var _default = Utility;
exports.default = _default;