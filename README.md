# COMP229 Assignment 2 — Portfolio REST API

Zohaib Syed's Assignment 1 Next.js portfolio is paired with an Express and MongoDB backend. The API provides CRUD operations for contacts, projects, qualifications, and users, plus JWT sign-in, sign-out, and protected routes.

## Technology

- Next.js and React frontend in `client/`
- Node.js and Express REST API in `server/`
- MongoDB with Mongoose models (local MongoDB or Atlas)
- JWT authentication and bcrypt password hashing
- Node test runner, Supertest, and an in-memory MongoDB test database

## Local setup

1. Install backend dependencies with `npm install`.
2. Install frontend dependencies with `npm --prefix client install`.
3. Copy `.env.example` to `.env` and supply your MongoDB Atlas URI and a strong JWT secret.
4. Start both applications with `npm run dev`.
5. Open the portfolio at `http://localhost:3000`; the API runs at `http://localhost:5001`.

Port 5001 is used because macOS AirPlay may reserve port 5000.

Never commit `.env`. The repository includes only a safe placeholder in `.env.example`.

## Verification

Run the complete automated check with:

```bash
npm run verify
```

This runs the API integration tests, frontend linting, and a production frontend build.

## API routes

| Resource | Public routes | JWT-protected routes |
|---|---|---|
| Authentication | `POST /api/auth/signin`, `POST /api/auth/signout` | `GET /api/auth/profile` |
| Contacts | `POST /api/contacts` | `GET /api/contacts`, `GET/PUT/DELETE /api/contacts/:id`, `DELETE /api/contacts` |
| Projects | `GET /api/projects`, `GET /api/projects/:id` | `POST /api/projects`, `PUT/DELETE /api/projects/:id`, `DELETE /api/projects` |
| Qualifications | `GET /api/qualifications`, `GET /api/qualifications/:id` | `POST /api/qualifications`, `PUT/DELETE /api/qualifications/:id`, `DELETE /api/qualifications` |
| Users | `POST /api/users` | `GET /api/users`, `GET/PUT/DELETE /api/users/:id`, `DELETE /api/users` |

For a protected request, add the header `Authorization: Bearer <token>` using the token returned by sign-in.
