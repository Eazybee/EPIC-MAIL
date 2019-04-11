"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _pg = require("pg");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

var connectDb = function connectDb() {
  var connectionString;
  var client;

  if (process.env.NODE_ENV === 'test') {
    connectionString = process.env.DB_TEST;
    client = new _pg.Client({
      connectionString: connectionString
    });
  } else if (process.env.NODE_ENV === 'localTest') {
    connectionString = process.env.DB_LOCAL_TEST;
    client = new _pg.Client({
      connectionString: connectionString
    });
  } else if (process.env.NODE_ENV === 'production') {
    var _process$env = process.env,
        DB_USER = _process$env.DB_USER,
        DB_PASSWORD = _process$env.DB_PASSWORD,
        DB = _process$env.DB,
        DB_PORT = _process$env.DB_PORT,
        DB_HOST = _process$env.DB_HOST;
    connectionString = {
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB,
      port: parseInt(DB_PORT, 10),
      host: DB_HOST,
      ssl: true
    };
    client = new _pg.Client(connectionString);
  } else {
    connectionString = process.env.DB_LOCAL;
    client = new _pg.Client({
      connectionString: connectionString
    });
  }

  client.connect();
  return client;
};

var _default = connectDb();

exports.default = _default;