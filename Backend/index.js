const express = require("express"); // Импортируем express
const mongoose = require("mongoose"); // Импортируем mongoose
const authRouter = require("./authRouter"); // Импортируем созданный Router
const PORT = process.env.PORT || 5050; // Переменная которая хранит значение порта
const cors = require("cors");

const app = express(); // Задаем переменную для функции express, это является нашим приложением

app.use(cors());

app.use(express.json()); // Парсим json
app.use("/auth", authRouter); // Прослушиваем Router 1-параметр: url по котрому будет слушаться Router; 2-параметр: сам Router

const start = async () => {
  // Функця запускающая сервер try catch для отлавливания потенциальных ошибок. Операции с БД всегда асинхронные
  try {
    await mongoose.connect(
      `mongodb+srv://admin:admin@cluster0.b5ryid4.mongodb.net/?retryWrites=true&w=majority`
    ); // Подключение к БД
    app.listen(PORT, () => console.log(`server started on port ${PORT}`)); // Запуск сервера... 1-параметр: порт на котором запустится сервер; 2-параметр: колбэк вызывающийся при успешном запуске сервера
  } catch (error) {
    console.log(error); // Вывод ошибки в консоль
  }
};

start(); // Вызов функции запуска сервера
