# COMP229 Assignment 2 Requirements Checklist

This checklist maps the official assignment document to the implementation and the evidence still required for submission.

## Part I — Backend setup and frontend connection (15 marks)

- [x] Node.js and Express backend created.
- [x] Existing Assignment 1 Next.js portfolio included in `client/`.
- [x] Root `npm run dev` starts the frontend and backend concurrently.
- [x] Contact form submits data to the Express API through a Next.js rewrite.
- [ ] Capture a screenshot showing both servers running concurrently.
- [ ] Capture a screenshot showing the portfolio contact form working with the API.

## Part II — MongoDB Portfolio database and collections (25 marks)

- [x] Mongoose connection explicitly selects the `Portfolio` database.
- [x] Contact model: `firstname`, `lastname`, `email`.
- [x] Project model: `title`, `firstname`, `lastname`, `email`, `completion`, `description`.
- [x] Qualification model: `title`, `firstname`, `lastname`, `email`, `completion`, `description`.
- [x] User model: `name`, `email`, `password`, `created`, `updated`.
- [x] User passwords are hashed with bcrypt and excluded from API responses.
- [ ] Connect the app to Zohaib's MongoDB Atlas cluster.
- [ ] Capture Atlas screenshots showing the `Portfolio` database and all four collections.

## Part III — Models, controllers, routes, and CRUD testing (50 marks)

- [x] Separate Mongoose models for contacts, projects, qualifications, and users.
- [x] Controllers support create, list, read-one, update, delete-one, and delete-all.
- [x] Express routers expose REST endpoints under `/api`.
- [x] Automated integration tests cover all resources.
- [ ] Manually test and capture Postman or Thunder Client evidence for contacts.
- [ ] Manually test and capture Postman or Thunder Client evidence for projects.
- [ ] Manually test and capture Postman or Thunder Client evidence for qualifications.
- [ ] Manually test and capture Postman or Thunder Client evidence for users.
- [ ] Place the screenshots into the final Word evidence document.

## Part IV — Authentication and protected routes (10 marks)

- [x] Sign-in validates email and hashed password.
- [x] Successful sign-in returns a JWT and sets an HTTP-only cookie.
- [x] Sign-out clears the authentication cookie.
- [x] Authentication middleware protects private CRUD routes.
- [x] Invalid, missing, and expired tokens receive `401 Unauthorized`.
- [ ] Capture sign-in, protected-success, unauthorized, and sign-out screenshots.

## Submission package

- [ ] Push the completed source code to a GitHub repository.
- [ ] Create the required Word document with testing and database screenshots.
- [ ] Create a clean `.zip` containing source code only (no `node_modules`, `.next`, `.env`, or secrets).
- [ ] Include the GitHub repository link with the submission.
- [ ] Open and inspect the final ZIP before submitting.
