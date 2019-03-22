import express from 'express';
import Validate from '../Middleware/Validate';
import UserController from '../Controller/UserController';

const router = express.Router();
router.post('/signup', Validate.signup, UserController.signUp); // signup
router.post('/login', Validate.login, UserController.login); // login

export default router;
