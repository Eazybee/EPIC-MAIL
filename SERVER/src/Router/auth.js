import express from 'express';
import Validate from '../Middleware/Validate';
import UserController from '../Controller/UserController';

const router = express.Router();
router.post('/signup', Validate.signup, UserController.signUp); // signup
router.post('/login', Validate.login, UserController.login); // login
router.post('/reset', Validate.reset, UserController.reset); // reset request

router.put('/reset', Validate.resetConfirmation, UserController.updatePassword); //  confirmation
export default router;
