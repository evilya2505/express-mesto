const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const notFoundError = new NotFoundError('Карточка с указанным _id не найдена.');
const badRequestError = new BadRequestError('Переданы некорректные данные');

// --- Описание схем карточки ---
// Получение всех карточек
const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

// Создание карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        Promise.reject(badRequestError)
          .catch((error) => res.status(error.statusCode).send({ message: `${error.name}: ${error.message}` }));
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Удаление карточки
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card !== null) {
        res.send({ data: card });
      } else {
        throw notFoundError;
      }
    })
    .catch((err) => {
      if (err.name === 'Bad Request') {
        res.status(err.statusCode).send({ message: `${err.name}: ${err.message}` });
      } else if (err.name === 'CastError') {
        Promise.reject(badRequestError)
          .catch((error) => res.status(error.statusCode).send({ message: `${error.name}: ${error.message}` }));
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Добавление лайка
const putLike = (req, res) => {
  const { _id } = req.user;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: _id } },
    { new: true },
  )
    .then((card) => {
      if (card !== null) {
        res.send({ data: card });
      } else {
        throw badRequestError;
      }
    })
    .catch((err) => {
      if (err.name === 'Bad Request') {
        res.status(err.statusCode).send({ message: `${err.name}: ${err.message}` });
      } else if (err.name === 'CastError') {
        Promise.reject(badRequestError)
          .catch((error) => res.status(error.statusCode).send({ message: `${error.name}: ${error.message}` }));
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Удаление лайка
const removeLike = (req, res) => {
  const { _id } = req.user;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: _id } },
    { new: true },
  )
    .then((card) => {
      if (card !== null) {
        res.send({ data: card });
      } else {
        throw badRequestError;
      }
    })
    .catch((err) => {
      if (err.name === 'Bad Request') {
        res.status(err.statusCode).send({ message: `${err.name}: ${err.message}` });
      } else if (err.name === 'CastError') {
        Promise.reject(badRequestError)
          .catch((error) => res.status(error.statusCode).send({ message: `${error.name}: ${error.message}` }));
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  removeLike,
};
