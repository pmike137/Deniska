const jwt = require("jsonwebtoken"); // Подключам JWT для расшивровки токена
const { secret } = require("../config"); // Получаем секретный ключ

module.exports = function (roles) {
  // roles - Роли которым разрешен доступ
  // Используем замыкание и вызываем middleware функцию внутри другой функции, которая принимает список ролей пользователя
  return function (req, res, next) {
    // Функция предоставляет доступ к списку клиентов только администраторам req = запрос, res = ответ, next = вызов по цепочке следующий middleware
    if (req.method === "OPTIONS") {
      // Проверка метода запроса если он равен OPTIONS вызываем следующий middleware
      next();
    }

    try {
      const token = req.headers.authorization.split(" ")[1]; // Получаем токен из заголовка. Делим строку на две части и берем вотрую часть. Вид токена 'Bearer - (тип токена) JsakLLAldvsisdjidnjhdnfmheknvuenptwcjuem - (токен)'
      if (!token) {
        // Проверка пользователя на наличие токена
        return res
          .status(403)
          .json({
            message: "Пользователь не авторизован",
            status: 403,
            ok: false,
          });
      }
      const { roles: userRoles } = jwt.verify(token, secret); // Получаем массив ролей из токена; 1-параметр: токен: 2-параметр: сектретный ключ
      let hasRole = false; // Переменная определяющая есть ли роль админа у пользователя
      userRoles.forEach((role) => {
        // Итерируем по всем ролям пользователя
        if (roles.includes(role)) {
          // Проверям есть ли разрешенная роль среди всех ролей пользователя
          hasRole = true; // Если разрешенная роль есть в списке ролей пользователя меняем статус переменной
        }
      });
      if (!hasRole) {
        return res
          .status(403)
          .json({ message: "У вас нет доступа", status: 403, ok: false });
      }
      next(); // Вызываем следующий по цепочке middleware
    } catch (error) {
      console.log(error);
      return res
        .status(403)
        .json({
          message: "Пользователь не авторизован",
          status: 403,
          ok: false,
        });
    }
  };
};
