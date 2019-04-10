import express from 'express';
import Validate from '../Middleware/Validate';
import GroupController from '../Controller/GroupController';


const router = express.Router();

//  POST
router.post('/', Validate.isLoggedIn, Validate.createGroup, GroupController.createGroup); // create groups
router.post('/:id/users', Validate.isLoggedIn, Validate.addGroupMember, GroupController.addGroupMember); // add users
router.post('/:id/messages', Validate.isLoggedIn, Validate.messageGroup, GroupController.messageGroup); // send mail to group

// GET
router.get('/', Validate.isLoggedIn, GroupController.getGroups); // get groups
router.get('/:id', Validate.isLoggedIn, Validate.groupId, GroupController.getGroupMembers); // get sepcified group

// PATCH
router.patch('/:id/name', Validate.isLoggedIn, Validate.updateGroupName, GroupController.updateGroupName); // update group name

// PUT
router.put('/:id/messages', Validate.isLoggedIn, Validate.sendDraftToGroup, GroupController.sendDraft); // send draft

// DELETE
router.delete('/:groupId/users/:userId', Validate.isLoggedIn, Validate.deleteGroupMember, GroupController.deleteGroupMember);
router.delete('/:id', Validate.isLoggedIn, Validate.deleteGroup, GroupController.deleteGroup);

export default router;
