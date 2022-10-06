const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
  
    if (!authorization || !authorization.startsWith('Bearer ')) {
throw new Error("")
//////////////////////////////////////
    }
  
    const token = authorization.replace('Bearer ', '');
    let payload;
    
    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
        throw new Error("")
        //////////////////////////////////////
    }
  
    req.user = payload; // записываем пейлоуд в объект запроса
  
    next(); // пропускаем запрос дальше
  }; 