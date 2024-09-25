const router = require('express').Router()
const { Op } = require('sequelize')
const { UserBlogs, Blog, User } = require('../models')
const { tokenExtractor, authenticateUserSession } = require('../util/middleware')

router.post('/', async (req, res) => {
  const blog = Blog.findByPk(req.body.blog_id)
  const user = User.findByPk(req.body.user_id)
  if (blog && user) {
    const userblog = await UserBlogs.create({ blogId: req.body.blog_id, userId: req.body.user_id, read: false })
    return res.json(userblog)
  }
})

router.put('/:id', tokenExtractor, authenticateUserSession, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const userBlog = await UserBlogs.findOne({
    where: {
      blogId: req.params.id,
      userId: user.id
    }
  })
  if (userBlog) {
    userBlog.read = req.body.read
    await userBlog.save()
    res.json(userBlog)
  }
  else {
    res.status(401).end()
  }
})


module.exports = router