# API Testing Guide

Use `http://localhost:5000` as the base URL. Create a user first, then sign in and copy the returned token. For protected requests, choose **Bearer Token** in Postman and paste that token.

## Recommended screenshot order

1. `POST /api/users` — create Zohaib's user.
2. `POST /api/auth/signin` — show the returned JWT.
3. `GET /api/auth/profile` without a token — show `401 Unauthorized`.
4. `GET /api/auth/profile` with the token — show authenticated access.
5. For each of contacts, projects, and qualifications, demonstrate POST, GET all, GET by ID, PUT, DELETE by ID, and DELETE all.
6. For users, demonstrate GET all, GET by ID, PUT, and DELETE by ID.
7. `POST /api/auth/signout` — show the successful sign-out response.

## Example request bodies

### User

```json
{
  "name": "Zohaib Syed",
  "email": "zsyed26@my.centennialcollege.ca",
  "password": "choose-a-strong-password"
}
```

### Contact

```json
{
  "firstname": "Jane",
  "lastname": "Visitor",
  "email": "jane@example.com"
}
```

### Project

```json
{
  "title": "Custom AI Chatbot",
  "firstname": "Zohaib",
  "lastname": "Syed",
  "email": "zsyed26@my.centennialcollege.ca",
  "completion": "2026-10-01",
  "description": "A custom AI chatbot for business websites."
}
```

### Qualification

```json
{
  "title": "Software Engineering Technology",
  "firstname": "Zohaib",
  "lastname": "Syed",
  "email": "zsyed26@my.centennialcollege.ca",
  "completion": "2028-04-30",
  "description": "Advanced diploma studies at Centennial College."
}
```

Do not place a real password, JWT, MongoDB URI, or any other credential in the evidence document or screenshots.
