const router = require('express').Router();
const {
  getCards, createCard, deleteCard, putLike, removeLike,
} = require('../controllers/cards');

// --- Описание основных роутов для карточки ---
router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', removeLike);

module.exports = router;
