import express from 'express';
import RouteController from './RouteController';

const app = express();
app.use(express.json());

//  POST
app.post('/api/v1/auth/signup', RouteController.signUp);
app.post('/api/v1/auth/login', RouteController.login);
app.post('/api/v1/messages', RouteController.message);

//  GET
app.get('/api/v1/messages', RouteController.getInbox);
app.get('/api/v1/messages/unread', RouteController.getUnreadInbox);
app.get('/api/v1/messages/read', RouteController.getReadInbox);
app.get('/api/v1/messages/:id', RouteController.getMailId);


//  DELETE
app.delete('/api/v1/messages/:id', RouteController.deletMail);


// PORT
const port = process.env.PORT || 3000;
app.listen(port);
export default app;
