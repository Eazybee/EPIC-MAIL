"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _Validate = _interopRequireDefault(require("../Middleware/Validate"));

var _MessageController = _interopRequireDefault(require("../Controller/MessageController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router(); //  POST


router.post('/', _Validate.default.isLoggedIn, _Validate.default.sendMail, _MessageController.default.sendMail); // send message

router.post('/draft', _Validate.default.isLoggedIn, _Validate.default.saveDraft, _MessageController.default.saveDraft); // save draft
//  GET

router.get('/', _Validate.default.isLoggedIn, _MessageController.default.getInbox); //  get inbox

router.get('/unread', _Validate.default.isLoggedIn, _MessageController.default.getUnreadInbox); // get unread inbox

router.get('/read', _Validate.default.isLoggedIn, _MessageController.default.getReadInbox); // get read inbox

router.get('/sent', _Validate.default.isLoggedIn, _MessageController.default.getSentMail); // get sent message

router.get('/sent/:id', _Validate.default.isLoggedIn, _Validate.default.sentMailId, _MessageController.default.getSentMailId); // get sent message with id

router.get('/draft', _Validate.default.isLoggedIn, _MessageController.default.getDraft); // get draft

router.get('/:id', _Validate.default.isLoggedIn, _Validate.default.mailId, _MessageController.default.getMailId); // get inbox  with id
//  PUT

router.put('/', _Validate.default.isLoggedIn, _Validate.default.sendDraft, _MessageController.default.sendDraft); // send draft
//  DELETE

router.delete('/draft/:id', _Validate.default.isLoggedIn, _Validate.default.deleteDrafttWithId, _MessageController.default.deleteMail); // delete draft message with id

router.delete('/sent/:id', _Validate.default.isLoggedIn, _Validate.default.deleteSentWithId, _MessageController.default.deleteMail); // delete sent message with id

router.delete('/sent/:id/retract', _Validate.default.isLoggedIn, _Validate.default.deleteSentWithId, _MessageController.default.retractMail); // retract sent message with id

router.delete('/:id', _Validate.default.isLoggedIn, _Validate.default.deleteInboxWithId, _MessageController.default.deleteMail); // delete inbox with id

var _default = router;
exports.default = _default;