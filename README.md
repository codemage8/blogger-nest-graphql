# Simple Blog Backend API

## Description

A basic blog backend API using [Nest](https://github.com/nestjs/nest), [Apollo Server](https://www.apollographql.com/docs/apollo-server/), and MongoDB


## Technical Stack
- [Nest](https://github.com/nestjs/nest)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [Mongoose](https://mongoosejs.com/)
- Docker for Local MongoDB Instance
- TypeScript
- ESLint & Prettier
- JWT for authentication

## Installation

```bash
$ npm install
```

## Running the app

### Development Configuration

- Create `.env` file with the following content
  
  ```env
  MAX_PAGE_LIMIT=200
  ```

- Create `.env.development.local` file with following content
  
  ```env
  MONGO_INITDB_ROOT_USERNAME=root
  MONGO_INITDB_ROOT_PASSWORD=admin
  MONGO_INITDB_DATABASE=blog
  MONGODB_URI=mongodb://root:admin@localhost:27017/blog?authSource=admin

  MONGO_INITDB_BLOG_ADMIN=admin@joi.blog.com

  # Base64 encode of bcrypt of s3cr3t
  MONGO_INITDB_BLOG_ADMIN_PASSWORD=JDJhJDEwJHMvc056M05mV0RoU3RmWVFQZFgyUy5KcDIyNGhEbFNxeGw3d21oREJ4NHRjNms2Z01UTERX

  AUTH_JWT_SECRET=secret
  AUTH_JWT_TOKEN_EXPIRES_IN=1h
  AUTH_REFRESH_SECRET=secret_for_refresh
  AUTH_REFRESH_TOKEN_EXPIRES_IN=60d
  ```
  
  *You can change the variables, but make sure to match the `MONGODB_URI` with the `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD` and `MONGO_INITDB_DATABASE`*


### Run local mongodb instance

```bash
$ npm run docker:dev
```

On the initialization of container, the container will run `mongodb-init.js` file in the project root folder.


### Run

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

- Visit [https://localhost:3000/graphql](https://localhost:3000/graphql) to play
  
- Use the following `login` mutation to login

```graphql
mutation login($loginInput: LoginUserInput!) {
  login(loginInput: $loginInput) {
    token
    refreshToken
    user {
      email
    }
  }
}
```