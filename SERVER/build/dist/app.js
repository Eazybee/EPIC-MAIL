"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _cors = _interopRequireDefault(require("cors"));

var _swagger = _interopRequireDefault(require("./swagger.json"));

var _auth = _interopRequireDefault(require("./Router/auth"));

var _messages = _interopRequireDefault(require("./Router/messages"));

var _groups = _interopRequireDefault(require("./Router/groups"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
})); // for parsing application/x-www-form-urlencoded

app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_swagger.default));
app.use('/api/v1/auth', _auth.default);
app.use('/api/v1/messages', _messages.default);
app.use('/api/v1/groups', _groups.default);
app.get('/', function (req, res) {
  return res.redirect(301, '/api-docs');
}); // PORT

var port = process.env.PORT || 3000;
app.listen(port);
var _default = app;
exports.default = _default;