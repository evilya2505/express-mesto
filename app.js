require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

// Создание приложения
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключение к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// Регистрация и логин
app.post('/signup', createUser);
app.post('/signin', login);

// Авторизация
app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((err, req, res, next) => {
  const { name, statusCode = 500, message } = err;

  res.status(statusCode).send({ message: `${name}: ${message}` });
});

app.all('*', require('./routes/notExisted'));

app.listen(PORT);
