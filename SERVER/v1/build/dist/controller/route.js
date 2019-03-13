"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _cors = _interopRequireDefault(require("cors"));

var _RouteController = _interopRequireDefault(require("./RouteController"));

var _swagger = _interopRequireDefault(require("../swagger.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_express.default.json());
app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_swagger.default)); //  POST

app.post('/api/v1/auth/signup', _RouteController.default.signUp);
app.post('/api/v1/auth/login', _RouteController.default.login);
app.post('/api/v1/messages', _RouteController.default.validateLogin, _RouteController.default.message);
app.post('/api/v1/messages/save', _RouteController.default.validateLogin, _RouteController.default.saveDraft); //  GET

app.get('/api/v1/messages', _RouteController.default.validateLogin, _RouteController.default.getInbox); //  Message

app.get('/api/v1/messages/unread', _RouteController.default.validateLogin, _RouteController.default.getUnreadInbox);
app.get('/api/v1/messages/read', _RouteController.default.validateLogin, _RouteController.default.getReadInbox);
app.get('/api/v1/messages/sent', _RouteController.default.validateLogin, _RouteController.default.getSentMail);
app.get('/api/v1/messages/:id', _RouteController.default.validateLogin, _RouteController.default.getMailId); //  PUT

app.put('/api/v1/messages/', _RouteController.default.validateLogin, _RouteController.default.sendDraft); //  DELETE

app.delete('/api/v1/messages/:id', _RouteController.default.validateLogin, _RouteController.default.deleteMail); // PORT

var port = process.env.PORT || 3000;
app.listen(port);
var _default = app;
exports.default = _default;