# API Testing Guide

Use the terminal evidence runner to verify the required API routes without printing credentials or tokens.

## Terminal evidence commands

1. `node scripts/api-evidence.mjs auth-users`
2. `node scripts/api-evidence.mjs contacts-projects`
3. `node scripts/api-evidence.mjs qualifications`
4. `mongosh --quiet mongodb://127.0.0.1:27017/Portfolio`
5. `npm run dev`
6. `npm run verify`

The evidence runner creates an isolated in-memory MongoDB database, executes the real Express routes, checks each HTTP response, and prints only the method, route, status code, and pass/fail result. The screenshots should contain only the VS Code terminal area.

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

Do not place a real password, JWT, remote MongoDB URI, or any other credential in the evidence document or screenshots.
