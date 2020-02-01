const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    try {
      throw new UnauthorizedError('Необходима авторизация');
    } catch (err) {
      next(err);
    }
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'PassPhrase');
  } catch (error) {
    try {
      throw new UnauthorizedError('Необходима авторизация');
    } catch (err) {
      next(err);
    }
  }

  req.user = payload;

  next();
  return null;
};
