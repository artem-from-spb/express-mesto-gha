const router = require('express').Router();
const { createUser, getUsers, getUserId, updateProfile, updateAvatar } = require('../controllers/users')

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUserId);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;