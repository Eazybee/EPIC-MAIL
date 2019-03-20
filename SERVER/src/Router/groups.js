import express from 'express';
import Validate from '../Middleware/Validate';
import GroupController from '../Controller/GroupController';


const router = express.Router();

//  POST
router.post('/', Validate.isLoggedIn, Validate.isAdmin, Validate.createGroup, GroupController.createGroup); // create groups
router.post('/:id/users', Validate.isLoggedIn, Validate.isAdmin, Validate.addGroupMember, GroupController.addGroupMember);

// GET
router.get('/', Validate.isLoggedIn, Validate.isAdmin, GroupController.getGroups);

// PATCH
router.patch('/:id/name', Validate.isLoggedIn, Validate.isAdmin, Validate.updateGroupName, GroupController.updateGroupName);

// DELETE
router.delete('/:id', Validate.isLoggedIn, Validate.isAdmin, Validate.deleteGroup, GroupController.deleteGroup);

export default router;
