import express from 'express';
import Validate from '../Middleware/Validate';
import MessageController from '../Controller/MessageController';


const router = express.Router();
//  POST

router.post('/', Validate.isLoggedIn, Validate.sendMail, MessageController.sendMail); // send message
router.post('/save', Validate.isLoggedIn, Validate.saveDraft, MessageController.saveDraft); // save draft

//  GET
router.get('/', Validate.isLoggedIn, MessageController.getInbox); //  get inbox
router.get('/unread', Validate.isLoggedIn, MessageController.getUnreadInbox); // get unread inbox
router.get('/read', Validate.isLoggedIn, MessageController.getReadInbox); // get read inbox
router.get('/sent', Validate.isLoggedIn, MessageController.getSentMail); // get sent message
router.get('/:id', Validate.isLoggedIn, Validate.mailId, MessageController.getMailId); // get inbox  with id

//  PUT
router.put('/', Validate.isLoggedIn, Validate.sendDraft, Validate.mailId, MessageController.sendDraft); // send draft

//  DELETE
router.delete('/:id', Validate.isLoggedIn, Validate.mailId, MessageController.deleteMail); // delete inbox with id


export default router;
