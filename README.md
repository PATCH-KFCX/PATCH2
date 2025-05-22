# Patch

> A web platform that empowers individuals—especially those managing chronic conditions like diabetes—to track symptoms, medications, insulin use, and pain levels in one centralized, user-friendly space. PATCH bridges the communication gap between patients and healthcare providers by organizing health data into a clear, visual timeline that improves diagnosis and care outcomes.

## Team

  - Fernando Martinez: **Scrum Master, Full Stack Developer**
  - Xavier Hertzog: **Frontend Developer**
  - Caleb Johnson: **Frontend Developer**
  - Kristopher Noel: **Backend Developer**

## Table of Contents
- [Getting Started](#getting-started)
  - [Build and Start Commands](#build-and-start-commands)
  - [Technologies Used](#technologies-used)
- [Project Proposal](#project-proposal)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Style Guide](#style-guide)

## Getting Started

Before you can actually start building, you need to create a database and configure your server's environment variables to connect with it.

- Create a database with a name of your choice.
- In the `server/` folder, copy the `.env.template` and name it `.env`.
- Update the `.env` variables to match your Postgres database information (username, password, database name)
- Replace the `SESSION_SECRET` value with your own random string. This is used to encrypt the cookie's `userId` value.
  - Use a tool like [https://randomkeygen.com/](https://randomkeygen.com/) to help generate the secret.
- Your `.env` file should look something like this:

```sh
# Replace these variables with your Postgres server information
# These values are used by knexfile.js to connect to your postgres server
PG_HOST=127.0.0.1
PG_PORT=5432
PG_USER=postgres
PG_PASS=postgres
PG_DB=patch2_clean

# Replace session secret with your own random string!
# This is used by handleCookieSessions to hash your cookie data 
SESSION_SECRET=''

# When you deploy your database on render, this string can be used to test SQL queries to the deployed database.
# Leave this value blank until you deploy your database.
PG_CONNECTION_STRING=''
```

### Build and Start Commands

From within the root directory, run the following commands to install dependencies and run the project locally:

```sh
# Build Command — install dependencies, build the static assets, and run migrations/seeds
cd frontend && npm i && npm run build && cd ../server && npm i && npm run migrate && npm run seed && cd ..

# Start Command
cd server && npm start
```

## Technologies Used

- Node
- Express
- Postgresql
- React
- Knex
- BCrypt HASH

## Project Proposal

See [PROPOSAL.md](PROPOSAL.md) for more details on the project proposal.

## Roadmap

View the project roadmap [here](https://github.com/orgs/PATCH-KFCX/projects/2).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Style Guide

This project adheres to the [Airbnb Style Guide](https://github.com/airbnb/javascript).
