"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _Validate = _interopRequireDefault(require("../Middleware/Validate"));

var _UserController = _interopRequireDefault(require("../Controller/UserController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

router.post('/signup', _Validate.default.signup, _UserController.default.signUp); // signup

router.post('/login', _Validate.default.login, _UserController.default.login); // login

router.post('/reset', _Validate.default.reset, _UserController.default.reset); // reset request

router.put('/reset', _Validate.default.resetConfirmation, _UserController.default.updatePassword); //  confirmation

var _default = router;
exports.default = _default;