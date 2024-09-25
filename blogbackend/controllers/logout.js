const router = require('express').Router()
const Session = require('../models/session')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (request, response) => {
  const userId = request.decodedToken.id
  await Session.destroy({
    where: {
      userId: userId
    }
  })
  response
    .status(200)
    .json({ message: 'logout successful' })
})

module.exports = router