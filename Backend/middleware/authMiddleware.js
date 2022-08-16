const jwt = require("jsonwebtoken"); // Подключам JWT для расшивровки токена
const { secret } = require("../config"); // Получаем секретный ключ

module.exports = function (req, res, next) {
  // Функция предоставляет доступ к списку клиентов только авторизованным пользователям req = запрос, res = ответ, next = вызов по цепочке следующий middleware
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
    const decodeData = jwt.verify(token, secret); // Декодируем токен, информация с id и ролями пользователя 1-параметр: токен: 2-параметр: сектретный ключ
    req.user = decodeData; // Для дальнейшего использования декодированного токена добавим в запрос новое поле user и положим в него декодированный токен
    next(); // Вызываем следующий по цепочке middleware
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ message: "Пользователь не авторизован", status: 403, ok: false });
  }
};
