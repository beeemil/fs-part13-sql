const Blog = require('./blog')
const User = require('./user')
const UserBlogs = require('./user_blogs')
const Session = require('./session')

User.hasMany(Blog)
User.hasMany(Session)

Session.belongsTo(User)

Blog.belongsTo(User)
Blog.hasMany(UserBlogs, { foreignKey: 'blogId', as: 'readinglists'})

User.belongsToMany(Blog, { through: UserBlogs, as: 'readings' })
Blog.belongsToMany(User, { through: UserBlogs, as: 'usersMarked' })

module.exports = {
  Blog,
  User,
  UserBlogs,
  Session
}