import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import RouteController from './RouteController';
import swagger from '../../swagger.json';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

//  POST
app.post('/api/v1/auth/signup', RouteController.signUp);
app.post('/api/v1/auth/login', RouteController.login);
app.post('/api/v1/messages', RouteController.validateLogin, RouteController.message);
app.post('/api/v1/messages/save', RouteController.validateLogin, RouteController.saveDraft);

//  GET
app.get('/api/v1/messages', RouteController.validateLogin, RouteController.getInbox); //  Message
app.get('/api/v1/messages/unread', RouteController.validateLogin, RouteController.getUnreadInbox);
app.get('/api/v1/messages/read', RouteController.validateLogin, RouteController.getReadInbox);
app.get('/api/v1/messages/sent', RouteController.validateLogin, RouteController.getSentMail);
app.get('/api/v1/messages/:id', RouteController.validateLogin, RouteController.getMailId);

//  PUT
app.put('/api/v1/messages/', RouteController.validateLogin, RouteController.sendDraft);

//  DELETE
app.delete('/api/v1/messages/:id', RouteController.validateLogin, RouteController.deleteMail);


// PORT
const port = process.env.PORT || 3000;
app.listen(port);
export default app;
