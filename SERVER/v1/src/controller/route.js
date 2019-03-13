import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import UserController from './UserController';
import swagger from '../swagger.json';
import Validate from './Validate';
import MessageController from './MessageController';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

//  POST
app.post('/api/v1/auth/signup', Validate.signup, UserController.signUp);
app.post('/api/v1/auth/login', Validate.login, UserController.login);
app.post('/api/v1/messages', Validate.isLoggedIn, Validate.sendMail, MessageController.sendMail);
app.post('/api/v1/messages/save', Validate.isLoggedIn, Validate.saveDraft, MessageController.saveDraft);

//  GET
app.get('/api/v1/messages', Validate.isLoggedIn, MessageController.getInbox); //  Message
app.get('/api/v1/messages/unread', Validate.isLoggedIn, MessageController.getUnreadInbox);
app.get('/api/v1/messages/read', Validate.isLoggedIn, MessageController.getReadInbox);
app.get('/api/v1/messages/sent', Validate.isLoggedIn, MessageController.getSentMail);
app.get('/api/v1/messages/:id', Validate.isLoggedIn, Validate.mailId, MessageController.getMailId);

//  PUT
app.put('/api/v1/messages/', Validate.isLoggedIn, Validate.sendDraft, MessageController.sendDraft);

//  DELETE
app.delete('/api/v1/messages/:id', Validate.isLoggedIn, Validate.mailId, MessageController.deleteMail);


// PORT
const port = process.env.PORT || 3000;
app.listen(port);
export default app;
