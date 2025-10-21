const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { createWorkspace, listMyWorkspaces, inviteMember, acceptInvitation, rejectInvitation, listMyInvitations, removeMember, updateWorkspace, deleteWorkspace } = require('../controllers/workspace.controller');


router.use(auth(true));
router.post('/', createWorkspace);
router.get('/', listMyWorkspaces);
router.patch('/:workspaceId', updateWorkspace);
router.delete('/:workspaceId', deleteWorkspace);
router.post('/:workspaceId/invite', inviteMember);
router.get('/invitations', listMyInvitations);
router.post('/invitations/:invitationId/accept', acceptInvitation);
router.post('/invitations/:invitationId/reject', rejectInvitation);
router.delete('/:workspaceId/member/:userId', removeMember);


module.exports = router;