import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import swagger from './swagger.json';
import auth from './Router/auth';
import messages from './Router/messages';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));
app.use('/api/v1/auth', auth);
app.use('/api/v1/messages', messages);
app.get('/', (req, res) => res.redirect(301, '/api-docs'));


// PORT
const port = process.env.PORT || 3000;
app.listen(port);
export default app;
