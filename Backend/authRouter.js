const Router = require("express"); // Импортируем Router из express для определения маршрутов по которым будут отправляться запросы
const router = new Router(); // инициализируем Router, теперь он может слушать запросы (GET, POST, DELETE)
const controller = require("./authController"); // Импортируем контроллер
const { check } = require("express-validator"); // Импортируем валидатор для полей
const authMiddleware = require("./middleware/authMiddleware"); // Подключаем созданный middleware для авторизации и проверки пользователя на авторизацию
const roleMiddleware = require("./middleware/roleMiddleware"); // Подключаем созданный middleware для авторизации и проверки пользователя на роль администратора

router.post(
  "/registration",
  // Валидация
  [
    check("username", "Имя пользователя не может быть пустым")
      .trim()
      .notEmpty(),
    check(
      "password",
      "Пароль не может быть меньше 4 и больше 10 символов"
    ).isLength({ min: 4, max: 10 }),
  ],
  controller.registration
); // Запрос на регистрацию
router.post("/login", controller.login); // Запрос на логин
router.get("/users", roleMiddleware(["ADMIN"]), controller.getUsers); // Установка прав доступа. 1-параметр: пути по которому будет выполняться запрос; 2-параметр: middleware для проверки роли пользователя; 3-параметр: тело исполнения запроса

module.exports = router; // Экспортируем объект роутера
