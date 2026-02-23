# Farmly REST API

A RESTful backend for an online farmers market platform that connects consumers with local producers. Built with Express 5, PostgreSQL, and Socket.io for real-time messaging.

![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?logo=postgresql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?logo=socket.io&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Storage-3FCF8E?logo=supabase&logoColor=white)

## Overview

Farmly is a platform where local food producers can list their products and communicate directly with buyers. The API handles user authentication, product management, real-time 1-on-1 messaging, producer reviews, and product favorites — everything needed to power a marketplace connecting farms to consumers.

## Features

**Authentication & Users**
- JWT-based registration and login
- Profile management with image upload
- Password hashing with bcrypt

**Products**
- Full CRUD operations with image upload (Supabase Storage)
- Filter by category, city, price range, and search by name
- Pagination support
- Each product belongs to one producer and one category

**Real-Time Chat (WebSocket)**
- 1-on-1 messaging between buyers and producers via Socket.io
- Chat initiated from a specific product (product context attached)
- JWT-authenticated WebSocket connections
- Join/leave chat rooms with live message broadcasting

**Reviews**
- Buyers can review producers (rating 1–5 + text comment)
- Review allowed only if a chat exists between the two users
- Automatic producer rating calculation

**Favorites**
- Users can favorite/unfavorite products
- Retrieve personalized favorites list

**Categories**
- Product categorization with optional category images

## Tech Stack

| Technology | Purpose |
|---|---|
| **Express 5** | Web framework |
| **Sequelize 6** | ORM for PostgreSQL |
| **PostgreSQL** | Relational database |
| **Socket.io** | Real-time WebSocket communication |
| **Supabase** | Image storage (Storage) + hosted PostgreSQL |
| **JWT** | Stateless authentication |
| **bcrypt** | Password hashing |
| **Joi** | Request validation |
| **Multer** | File upload handling (memory storage) |
| **Vitest** | Testing framework |

## Architecture

The project follows a **layered architecture** with clear separation of concerns:

```
Routes → Controllers → Services → Repositories → Models (Sequelize) → PostgreSQL
                          ↓
                     Validators (Joi)
                          ↓
                     Error Handling (Custom Error Classes)
```

- **Routes** define endpoints and wire up middleware
- **Controllers** handle HTTP request/response
- **Services** contain business logic and validation
- **Repositories** encapsulate all database operations
- **Models** define Sequelize schemas and associations

### Error Handling

Custom error class hierarchy extending a `BaseError`:

- `ValidationError` (400) — invalid request data
- `AuthenticationError` (401) — missing or invalid token
- `AuthorizationError` (403) — insufficient permissions
- Global error handler middleware formats all errors as consistent JSON responses

## Database Schema

![ERD Diagram](screenshots/erd-diagram.png)

## Use Case Diagram

![Use Case Diagram](screenshots/use-case-diagram.png)

## UI Design (Figma)

![Figma Design](screenshots/figma-design.png)

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login with email and password | No |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/register` | Register a new user | No |
| GET | `/api/users/:userId/profile` | Get user profile | No |
| PATCH | `/api/users/profile` | Update own profile (image optional) | Yes |
| GET | `/api/users/:userId/products` | Get user's products (paginated) | No |
| GET | `/api/users/products/:productId` | Get specific product details | No |
| GET | `/api/users/:userId/reviews` | Get reviews for a user | No |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List products (filter, search, paginate) | No |
| POST | `/api/products` | Create product (image required) | Yes |
| PATCH | `/api/products/:productId` | Update product (owner only) | Yes |
| DELETE | `/api/products/:productId` | Delete product (owner only) | Yes |

**Query Parameters for `GET /api/products`:**
`limit`, `offset`, `value` (search), `city`, `priceFrom`, `priceTo`, `categoryId`

### Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | Get all categories | No |
| POST | `/api/categories` | Create a category | No |

### Chats

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/chats` | Create a 1-on-1 chat (with product context) | Yes |
| GET | `/api/chats` | Get user's chats (paginated) | Yes |
| GET | `/api/chats/:chatId` | Get chat details | Yes |
| GET | `/api/chats/:chatId/info` | Get chat participant info | Yes |
| POST | `/api/chats/:chatId/messages` | Send a text message | Yes |
| GET | `/api/chats/:chatId/messages` | Get messages (paginated) | Yes |

### Reviews

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/reviews` | Create a review (requires existing chat) | Yes |

### Favorites

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/users/favorites/:productId` | Add product to favorites | Yes |
| DELETE | `/api/users/favorites/:productId` | Remove from favorites | Yes |
| GET | `/api/users/favorites` | Get favorite products | Yes |

## WebSocket Events

Real-time chat is powered by Socket.io with JWT authentication.

**Connection:** Clients authenticate via `socket.handshake.auth.token` (JWT).

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-chat` | Client → Server | Join a chat room |
| `joined-chat` | Server → Client | Confirmation of joining |
| `leave-chat` | Client → Server | Leave a chat room |
| `left-chat` | Server → Client | Confirmation of leaving |
| `send-message` | Client → Server | Send a text message (max 1000 chars) |
| `new-message` | Server → Client | Broadcast new message to chat participants |
| `error` | Server → Client | Validation or permission error |

## Getting Started

### Prerequisites

- **Node.js** 18+
- **PostgreSQL** database (or a [Supabase](https://supabase.com) account)
- **Supabase** project (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/farmly-rest-api.git
   cd farmly-rest-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:
   ```env
   NODE_ENV=development
   PORT=8000
   JWT_SECRET=your-secret-key
   DATABASE_URL=postgres://user:password@host:port/database
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   SUPABASE_BUCKET_NAME=farmly-images
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The server starts at `http://localhost:8000` with hot reload via Nodemon.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |

## Project Structure

```
farmly-rest-api/
├── config/              # Database and Supabase configuration
├── controllers/         # HTTP request handlers
├── errors/              # Custom error classes and global error handler
├── middlewares/          # Auth (JWT) and file upload (Multer) middleware
├── models/              # Sequelize models and associations
├── repositories/        # Data access layer (database queries)
├── routes/              # Express route definitions
├── services/            # Business logic layer
├── socket/              # Socket.io setup, auth, and event handlers
├── tests/               # Unit and integration tests (Vitest)
├── utils/               # JWT and password hashing utilities
├── validators/          # Joi validation schemas
├── app.js               # Express app configuration
├── server.js            # Entry point (HTTP server + Socket.io init)
└── package.json
```

## Key Design Decisions

- **Layered Architecture** — Strict separation between HTTP handling, business logic, and data access makes the codebase testable and maintainable
- **Repository Pattern** — All Sequelize queries are isolated in repositories, making it easy to swap the ORM or database without touching business logic
- **Custom Error Hierarchy** — Typed exceptions (`ValidationError`, `AuthenticationError`, `AuthorizationError`) ensure consistent error responses across all endpoints
- **Chat-gated Reviews** — Requiring an existing chat before a review can be submitted prevents spam and ensures buyers have actually interacted with the producer
- **Product-scoped Chats** — Each chat is tied to a specific product, giving context to conversations and preventing duplicate chat creation
- **Supabase Storage** — Image uploads go through Multer (memory storage) to Supabase Storage, keeping the server stateless
- **Express 5** — Early adoption of Express 5 with native async error handling support

## License

This project is open source and available under the [MIT License](LICENSE).
