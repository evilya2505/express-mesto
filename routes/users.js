const router = require('express').Router();
const {
  getUsers, getUserById, updateUserAvatar, updateUserInfo, getUserInfo,
} = require('../controllers/users');

// --- Описание основных роутов для пользователя ---
router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', getUserById);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
