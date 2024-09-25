const router = require('express').Router()
const { User, Blog, UserBlogs } = require('../models')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  let read = {
    [Op.in]: [true, false]
  }
  if ( req.query.read ) {
    read = req.query.read === "true"
  }
  const user = await User.findByPk(req.params.id, {
    attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
    include: [{
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId','createdAt', 'updatedAt'] },
      through: {
        attributes: []
      },
      include: {
        model: UserBlogs,
        as: 'readinglists',
        attributes: ['id', 'read'],
        where: {
          read
        }
      }
    },
    ],
  })
  if (user) {
    res.json(user)
  }
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ 
    where: {
      username: req.params.username
    }
  })
  user.username = req.body.username
  await user.save()
  res.json(user)
})

module.exports = router