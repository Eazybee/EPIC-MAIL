"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _Validate = _interopRequireDefault(require("../Middleware/Validate"));

var _GroupController = _interopRequireDefault(require("../Controller/GroupController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router(); //  POST


router.post('/', _Validate.default.isLoggedIn, _Validate.default.createGroup, _GroupController.default.createGroup); // create groups

router.post('/:id/users', _Validate.default.isLoggedIn, _Validate.default.addGroupMember, _GroupController.default.addGroupMember); // add users

router.post('/:id/messages', _Validate.default.isLoggedIn, _Validate.default.messageGroup, _GroupController.default.messageGroup); // send mail to group
// GET

router.get('/', _Validate.default.isLoggedIn, _GroupController.default.getGroups); // get groups

router.get('/:id', _Validate.default.isLoggedIn, _Validate.default.groupId, _GroupController.default.getGroupMembers); // get sepcified group
// PATCH

router.patch('/:id/name', _Validate.default.isLoggedIn, _Validate.default.updateGroupName, _GroupController.default.updateGroupName); // update group name
// PUT

router.put('/:id/messages', _Validate.default.isLoggedIn, _Validate.default.sendDraftToGroup, _GroupController.default.sendDraft); // send draft
// DELETE

router.delete('/:groupId/users/:userId', _Validate.default.isLoggedIn, _Validate.default.deleteGroupMember, _GroupController.default.deleteGroupMember);
router.delete('/:id', _Validate.default.isLoggedIn, _Validate.default.deleteGroup, _GroupController.default.deleteGroup);
var _default = router;
exports.default = _default;