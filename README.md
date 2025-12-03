# FP_PWEB_SEcuan

 Kadek Angga Wistara 5053241025
 Oktaviann Ramadhan 5053241025

---

# 📌 API Endpoints Overview (CRUD Documentation)

This backend provides full **CRUD operations** for 4 main resources: **Users**, **Transactions**, **Games**, and **Characters**.
Authentication is handled using **JWT (Bearer tokens)** for secure access to protected routes.

---

# 1. User API (CRUD + Authentication)

**Model:** `User`
Fields: `username`, `email`, `password (hashed)`, `dateCreated`

### ➤ Create User (Register)

```
POST /api/register
```

### ➤ Login User (Generate JWT)

```
POST /api/login
```

Returns:

* user data
* JWT token

### ➤ Get All Users

```
GET /api/users
```

### ➤ Get User by ID

```
GET /api/users/:id
```

### ➤ Update User

```
PUT /api/users/:id
```

### ➤ Delete User

```
DELETE /api/users/:id
```

---

# 2. Transaction API (CRUD + JWT Protected)

**Model:** `Transaction`
Fields: `userEmail`, `gameName`, `packageAmount`, `price`, `uid`, `server`, `date`

> **All Transaction routes require:**
> `Authorization: Bearer <JWT_TOKEN>`

### ➤ Create Transaction

```
POST /api/transaction
```

Automatically links to the logged-in user via JWT.

### ➤ Get All of This User’s Transactions

```
GET /api/transaction
```

Returns only transactions matching the email inside the JWT.

### ➤ Get Transaction by ID

```
GET /api/transaction/:id
```

### ➤ Update Transaction

```
PUT /api/transaction/:id
```

### ➤ Delete Transaction

```
DELETE /api/transaction/:id
```

---

# 3. Game API (CRUD)

**Model:** `Game`
Fields: `name`, `description`, `bannerImageUrl`, `cardImageUrl`, `servers[]`, `createdAt`

### ➤ Create Game

```
POST /api/games
```

### ➤ Get All Games

```
GET /api/games
```

### ➤ Get Game by ID

```
GET /api/games/:id
```

### ➤ Update Game

```
PUT /api/games/:id
```

### ➤ Delete Game

```
DELETE /api/games/:id
```

---

# 4. Character API (CRUD)

**Model:** `Character`
Fields: `game (ObjectId)`, `name`, `title`, `role`, `description`, `imageUrl`, `createdAt`

### ➤ Create Character

```
POST /api/characters
```

### ➤ Get All Characters (Optional: filter by game)

```
GET /api/characters
GET /api/characters?game=<gameId>
```

### ➤ Get Character by ID

```
GET /api/characters/:id
```

### ➤ Update Character

```
PUT /api/characters/:id
```

### ➤ Delete Character

```
DELETE /api/characters/:id
```

---

# Authentication Summary

### Login and register generate JWT:

```
POST /api/login
POST /api/register
```

### Protected routes require the header:

```
Authorization: Bearer <TOKEN>
```

---

# CRUD Summary Table

| Resource        | CREATE            | READ ALL         | READ ONE             | UPDATE               | DELETE                  | AUTH REQUIRED     |
| --------------- | ----------------- | ---------------- | -------------------- | -------------------- | ----------------------- | ----------------- |
| **User**        | POST /register    | GET /users       | GET /users/:id       | PUT /users/:id       | DELETE /users/:id       | No (except login) |
| **Transaction** | POST /transaction | GET /transaction | GET /transaction/:id | PUT /transaction/:id | DELETE /transaction/:id | **Yes (JWT)**     |
| **Game**        | POST /games       | GET /games       | GET /games/:id       | PUT /games/:id       | DELETE /games/:id       | No                |
| **Character**   | POST /characters  | GET /characters  | GET /characters/:id  | PUT /characters/:id  | DELETE /characters/:id  | No                |

---

