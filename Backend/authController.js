// Функции взаимодействия с пользователем (регистрация, авторизация, получение пользователей)
const User = require("./models/User"); // Импорируем созданные модели с сущностями
const Role = require("./models/Role"); // Импорируем созданные модели с сущностями
const bcrypt = require("bcrypt"); // Подключаем библиотеку для хэширования пароля
const jwt = require("jsonwebtoken"); // Импортируем библиотеку JWT токена
const { validationResult } = require("express-validator"); // Импортируем функцию которая будет возвращать ошибки полученные в процессе валидации
const { secret } = require("./config"); // Получаем секретный ключ

const generateAccessToken = (id, roles) => {
  // Функция генерации JWT токена
  const payload = {
    id,
    roles,
  }; // Прячем информацию о пользователе в payload токена
  return jwt.sign(payload, secret, { expiresIn: "24h" }); // Возвращается токен 1-параметр: payload с информацией о пользователе; 2-параметр: секретный ключ по которому будет расшифровываться токен; 3-параметр: объект опций в котором укажем сколько времени будет жить токен
};

class authController {
  // класс с функциями, функции принимают два параметра запрос и ответ; req - информация которую присылает нам пользователь; res - то что мы будем возвращать пользователю
  async registration(req, res) {
    // Функция регистрации
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Если объект с ошибками не пустой возвращаем клиенту соттветствующее сообщение
        return res.status(400).json({
          message: "Ошибка при регистрации",
          errors,
          status: 400,
          ok: false,
        });
      }
      const { username, password } = req.body; // Получаем имя пользователся и пароль из тела запроса
      const candidate = await User.findOne({ username }); // Проверяем есть ли уже такой пользователь в БД
      if (candidate) {
        // Если БД нам что-то вернула, значит пользователь уже есть и нужно вернуть клиенту ошибку с соответствующим сообщением
        return res.status(400).json({
          message: "Пользователь с таким именем уже существует",
          status: 400,
          ok: false,
        });
      }
      const hashPassword = bcrypt.hashSync(password, 7); // Создаем переменную с захэшированным паролем. 1-параметр: пароль пользователя; 2-параметр: степень хэширования
      const userRole = await Role.findOne({ value: "USER" }); // Задаем роль для пользователя
      const user = new User({
        username,
        password: hashPassword,
        roles: [userRole.value],
      }); // Создаем пользователя
      await user.save(); // Сохраняем пользователя в БД
      return res.json({
        message: "Пользователь успешно зарегестрирован",
        status: 200,
        ok: true,
      }); // Возвращаем клиенту сообщение о результате
    } catch (error) {
      console.log(error); // Выводим ошибку
      res
        .status(400)
        .json({ message: "Ошибка регистрации", status: 400, ok: false }); // Оповещаем клиент об ошибке (статус 400) и выводим сообщение
    }
  }
  async login(req, res) {
    // Функция логина
    try {
      const { username, password } = req.body; // Получаем имя пользователся и пароль из тела запроса
      const user = await User.findOne({ username }); // Ищем пользователя в БД
      if (!user) {
        // Проверка есть ли пользователь в БД, если нету возвращаем сообщение об ошибке
        return res.status(400).json({
          message: `Пользователь ${username} не найден`,
          status: 400,
          ok: false,
        });
      }
      const validPassword = bcrypt.compareSync(password, user.password); // Сравниваем пароли полученные от пользователя и тот который храниться в БД; 1-параметр: введенный пароль; 2-параметр: захэшированный пароль из БД
      if (!validPassword) {
        // Если пароли не совпали возвращаем сообщение с ошибкой
        return res
          .status(400)
          .json({ message: `Введен неверный пароль`, status: 400, ok: false });
      }
      const token = generateAccessToken(user._id, user.roles); // Генерируем JWT токен передаем id и роли пользователя (id генерируется БД)
      return res.status(200).json({ token, status: 200, ok: true }); //Возвращаем токен ответом на запрос клиента
    } catch (error) {
      console.log(error); // Выводим ошибку
      res
        .status(400)
        .json({ message: "Ошибка логина", status: 400, ok: false }); // Оповещаем клиент об ошибке (статус 400) и выводим сообщение
    }
  }
  async getUsers(req, res) {
    // Функция получения пользователя
    try {
      // const userRole = new Role(); // 'КОСТЫЛЬ': Добавляем роли в БД
      // const adminRole = new Role({ value: "ADMIN" }); // Для роли админа указываем значение
      // await userRole.save(); // Сохранение в БД
      // await adminRole.save(); // Сохранение в БД
      const users = await User.find(); // Делаем запрос к БД без параметров
      res.status(200).json({ users, status: 200, ok: true }); // Возвращаем массив с пользователями
      // res.json("server work"); // Возвращаем на клиент обратно сообщение
    } catch (error) {}
  }
}

module.exports = new authController(); // Экспортируем объект созданного класса
