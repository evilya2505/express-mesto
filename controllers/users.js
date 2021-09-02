const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const notFoundError = new NotFoundError('Пользователь с указанным _id не найден.');
const badRequestError = new BadRequestError('Переданы некорректные данные');

// --- Описание схем пользователя ---
// Получить всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

// Получить пользователя по ID
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw notFoundError;
      } else {
        res.send({ data: user });
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

// Создать пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        Promise.reject(badRequestError)
          .catch((error) => res.status(error.statusCode).send({ message: `${error.name}: ${error.message}` }));
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Обновить информацию о пользователе
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user !== null) {
        res.send({ data: user });
      } else {
        throw notFoundError;
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        Promise.reject(badRequestError)
          .catch((error) => res.status(error.statusCode).send({ message: `${error.name}: ${error.message}` }));
      } else if (err.name === 'Not Found') {
        res.status(err.statusCode).send({ message: `${err.name}: ${err.message}` });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

// Обновление аватара пользователя
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user !== null) {
        res.send({ data: user });
      } else {
        throw notFoundError;
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        Promise.reject(badRequestError)
          .catch((error) => res.status(error.statusCode).send({ message: `${error.name}: ${error.message}` }));
      } else if (err.name === 'Not Found') {
        res.status(err.statusCode).send({ message: `${err.name}: ${err.message}` });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
