"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Group =
/*#__PURE__*/
function () {
  function Group(groupName, ownerId) {
    var groupMembers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, Group);

    Group.counter += 1;
    this.Id = Group.counter;
    this.name = groupName;
    this.ownerId = ownerId;
    this.groupMembers = groupMembers;
    this.addMembers(this.groupMembers);
    Group.groups[Group.counter] = this;
  }

  _createClass(Group, [{
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }, {
    key: "getId",
    value: function getId() {
      return this.Id;
    }
  }, {
    key: "getOwnerId",
    value: function getOwnerId() {
      return this.ownerId;
    }
  }, {
    key: "addMembers",
    value: function addMembers(membersId) {
      var _this = this;

      var schema = _joi.default.array().required();

      var _Joi$validate = _joi.default.validate(membersId, schema),
          error = _Joi$validate.error;

      if (error) {
        throw new Error(error.details[0].message);
      }

      membersId.forEach(function (memberId) {
        _this.groupMembers.push(memberId);
      });
    }
  }, {
    key: "getMembers",
    value: function getMembers() {
      return this.groupMembers;
    }
  }]);

  return Group;
}();

Group.counter = 0;
Group.groups = [];
var _default = Group;
exports.default = _default;