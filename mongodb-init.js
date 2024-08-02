const dbName = process.env.MONGO_INITDB_DATABASE
const user = process.env.MONGO_INITDB_ROOT_USERNAME
const password = process.env.MONGO_INITDB_ROOT_PASSWORD

const blogAdminUser = process.env.MONGO_INITDB_BLOG_ADMIN

// Decode the password
const blogAdminPassword = Buffer.from(process.env.MONGO_INITDB_BLOG_ADMIN_PASSWORD, 'base64').toString('ascii')

// Connect to the admin database
db = db.getSiblingDB('admin')
db.auth(user, password)

db = db.getSiblingDB(dbName)
db.getSiblingDB('admin').grantRolesToUser(user, [{ role: 'dbOwner', db: dbName }])

db.createCollection('users', { capped: false })
db.users.insertOne({
  email: blogAdminUser,
  isAdmin: true,
  password: blogAdminPassword
})
