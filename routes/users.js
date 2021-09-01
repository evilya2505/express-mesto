const router = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUserAvatar, updateUserInfo,
} = require('../controllers/users');

// --- Описание основных роутов для пользователя ---
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
