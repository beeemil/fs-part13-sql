const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { Session, User } = require('../models')
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'SequelizeValidationError') {
    // Handles validation errors from Sequelize
    return res.status(400).json({ error: error.errors.map(err => err.message).join(', ') });
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    // Handles unique constraint violations from Sequelize
    return res.status(400).json({ error: 'Duplicate entry, violates unique constraint' });
  } else if (error.name === 'SequelizeForeignKeyConstraintError') {
    // Handles foreign key constraint errors
    return res.status(400).json({ error: 'Foreign key constraint failed' });
  } else if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    // Handle JSON parsing errors
    return res.status(400).json({ error: 'Malformed JSON payload' });
  }
  next(error);
};

const tokenExtractor = async (request,response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    try {
      const token = authorization.replace('Bearer ', '')
      const session = await Session.findOne({ where: { token: token } })
      if (session) {
        request.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        request.token = token
      } else {
        return response.status(401).json({ error: 'token invalid' })  
      }
    } catch (error) {
      console.log(error)
      return response.status(401).json({ error: 'token invalid' })
    }
  } else  {
    request.token = null
    return response.status(401).json({ error: 'token missing' })
  }
  next()
  }

const authenticateUserSession = async (req, res, next) => {
  const session = await Session.findOne({ where: { token: req.token } });

  if (!session) {
    return res.status(403).json({ error: 'Session disabled or not found' });
  }
  const user = await User.findByPk(session.userId);

  if (user.disabled) {
    return res.status(403).json({ error: 'User account is disabled' });
  }
  next();
};


module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  authenticateUserSession
};
