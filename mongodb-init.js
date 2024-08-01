const dbName = process.env.MONGO_INITDB_DATABASE
const user = process.env.MONGO_INITDB_ROOT_USERNAME
const password = process.env.MONGO_INITDB_ROOT_PASSWORD

console.log(dbName, user, password)

// Connect to the admin database
db = db.getSiblingDB('admin')
db.auth(user, password)

db = db.getSiblingDB(dbName)

db.getSiblingDB('admin').grantRolesToUser(user, [{ role: 'dbOwner', db: dbName }])
