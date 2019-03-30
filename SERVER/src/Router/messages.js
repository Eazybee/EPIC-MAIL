import express from 'express';
import Validate from '../Middleware/Validate';
import MessageController from '../Controller/MessageController';


const router = express.Router();
//  POST

router.post('/', Validate.isLoggedIn, Validate.sendMail, MessageController.sendMail); // send message
router.post('/draft', Validate.isLoggedIn, Validate.saveDraft, MessageController.saveDraft); // save draft

//  GET
router.get('/', Validate.isLoggedIn, MessageController.getInbox); //  get inbox
router.get('/unread', Validate.isLoggedIn, MessageController.getUnreadInbox); // get unread inbox
router.get('/read', Validate.isLoggedIn, MessageController.getReadInbox); // get read inbox
router.get('/sent', Validate.isLoggedIn, MessageController.getSentMail); // get sent message
router.get('/sent/:id', Validate.isLoggedIn, Validate.sentMailId, MessageController.getSentMailId); // get sent message with id
router.get('/:id', Validate.isLoggedIn, Validate.mailId, MessageController.getMailId); // get inbox  with id

//  PUT
router.put('/', Validate.isLoggedIn, Validate.sendDraft, MessageController.sendDraft); // send draft

//  DELETE
router.delete('/:id', Validate.isLoggedIn, Validate.deleteInboxWithId, MessageController.deleteMail); // delete inbox with id
router.delete('/sent/:id', Validate.isLoggedIn, Validate.deleteSentWithId, MessageController.deleteMail); // delete sent message with id
router.delete('/sent/:id/retract', Validate.isLoggedIn, Validate.deleteSentWithId, MessageController.retractMail); // retract sent message with id

export default router;
