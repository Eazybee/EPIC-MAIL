import express from 'express';
import Validate from '../Middleware/Validate';
import GroupController from '../Controller/GroupController';


const router = express.Router();

//  POST
router.post('/', Validate.isLoggedIn, Validate.isAdmin, Validate.createGroup, GroupController.createGroup); // create groups


export default router;
