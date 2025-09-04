# **Mubadalah Backend (Express + PostgreSQL)**

This is the backend for the full stack trading app. It provides APIs for authentication and all CRUD operations

## Tech Stack 
- Node.js + Express
- PostgreSQL (via pg)
- dotenv, cors, morgan

## Getting Started
```bash 
# 1. Install dependencies
cd Mubadalah-server
npm install

# 2. Go to pgAdmin and create DB (e.g., `mubadalah`)

# 3. Start the server
node server.js
```

## Project Structure
```
mubadalah-server/
├── routes/                # Express route handlers
│   ├── auth.js            # Authentication (signup & login)
│   ├── admin.js           # Admin operations (profile, management)
│   └── users.js           # Users CRUD operations
│
├── middleware/            # Custom middleware
│   └── adminAuth.js       # Role-based guard for admin-only routes
│
├── db.js                  # pg client
├── server.js              # Application entry point 

```

## API Endpoints 
The API will run on: http://localhost:5000

### Auth Routes
**Base URL**: /api/auth

| Method | Endpoint | Description |
| :------- | :------: | -------: |
| POST     | /signup   | Register new user    |
| POST   | /login   | Log in existing user   |

#### POST `/api/auth/signup`
Register a new user (**only regular** users)

```json
{
    "name": "Asem",
    "username": "asemH",
    "email": "asem@gmail.com",
    "password": "123",
}
```

#### POST `api/auth/login`
Login existing user (regular user or admin)

```json
{
    "username": "mayaz",
    "password": "123"
}
```

### Admin Routes
**Base URL**: `api/admin`

| Method | Endpoint | Description |
| :------- | :------: | -------: |
| GET     | /   | Get all users' posts    |
| GET   | /:username   | Get profile   |
| DELETE | /posts/:id | Delete a post by its ID |

Admin requests must include:
```json
{"header": "user_id"}
```
#### GET api/admin/
```json
No request body needed. Just the user_id header
```

#### GET api/admin/:username
```json
No request body needed. Just the username 
```

#### DELETE api/admin/posts/:id
```json
No request body needed. Just the post ID 
```

### Users Routes
**Base URL**: `api/users`

| Method | Endpoint | Description |
| :------- | :------: | -------: |
| GET     | /   | Get all users' posts    |
| POST   | /create   | create a new post   |
| GET | /:username | view their own profile |
| GET | /:username/posts| view their own posts |
| POST | /saves | save a post |
| GET | /:username/saves | view their saved posts |
| PUT | /:id | edit their profile |
| DELETE | /:username/posts/:id | delete their post by its id |

#### GET /api/users/ 
```json
Returns a list of posts objects
```
#### POST /api/users/create
```json
{
    "user_id": 1,
    "phone_number": "0791111111",
    "location": "Amman",
    "image_url": "https://res.cloudinary.com/dsd1isfdb/image/upload/v1640367093/picofme/examples/example_1_xixqoj.jpg", 
    "caption": "This is a post"
}
```
#### GET /api/users/:username
```json
Returns a list of profile objects based on the user's username 
```
#### GET api/users/:username/posts
```json
Returns a list of posts objects based on the user's username 
```
#### POST api/users/saves
```json
{
    "post_id": 1,
    "user_id": 1
}
```

#### GET api/users/:username/saves
```json
Returns a list of saves objects based on the user's username 
```
#### PUT api/users/:id
```json
{
    "name": "Maya",
    "username": "mayaaaaaa",
    "email": "maya@hotmail.com",
    "password": "123456789"
}
```

#### DELETE api/users/:username/posts/:id
```json
No request body needed. Just the logged in user's username and post id
```