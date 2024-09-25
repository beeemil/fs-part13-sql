require('dotenv').config()
const { Sequelize } = require('sequelize')
const Blog = require('./models/blog')

const sequelize = new Sequelize(process.env.DATABASE_URL, {logging: false})

const main = async () => {
  try {
    await sequelize.authenticate()
    const blogs = await Blog.findAll({logging:false})
    blogs.map(blog => console.log(`${blog.dataValues.author}:`, `"${blog.dataValues.title}",`, blog.dataValues.likes, 'likes'))
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()