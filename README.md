# PATCH

**PATCH** is a full-stack health tracking web app that helps people — especially those managing chronic conditions like diabetes — log symptoms, medications, pain levels, and insulin use in one place.

---

## What Is It?

PATCH gives users a personal health dashboard where they can:

- Log daily symptoms with pain type, location, and severity
- Track medications and insulin use over time
- View visual charts of their health data
- Build a clear history to bring to doctor appointments

---

## Why Was It Made?

12 million adults in the U.S. are misdiagnosed every year — often because patients struggle to recall or clearly describe their symptoms during short clinical visits. PATCH was built to close that gap by making it easy to log health data in real time, so patients arrive at appointments with an organized, visual record instead of vague recollections.

---

## What Problem Does It Solve?

PATCH bridges the communication gap between patients and healthcare providers. Instead of trying to remember how you felt three weeks ago, you have a timestamped log. This leads to more accurate diagnoses, better treatment decisions, and more informed conversations with your doctor — especially for people managing ongoing or complex conditions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Vite |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| ORM | Knex.js |
| Auth | bcrypt, cookie-session |
| Charts | Chart.js, react-chartjs-2 |

---

## Live App

The app is deployed on Render:

- **Frontend + Backend:** https://patch2.onrender.com

---

## Running Locally

### Prerequisites

- Node.js
- PostgreSQL (install via `brew install postgresql@16` on Mac)

### Setup

**1. Start PostgreSQL**
```sh
brew services start postgresql@16
```

**2. Create a database**
```sh
createdb patch2_clean
```

**3. Configure environment variables**
```sh
cd server
cp .env.template .env
```

Edit `server/.env` with your Postgres credentials:
```sh
PG_HOST=127.0.0.1
PG_PORT=5432
PG_USER=your_postgres_username
PG_PASS=your_postgres_password
PG_DB=patch2_clean
SESSION_SECRET='some_random_string'
PG_CONNECTION_STRING=''
```

**4. Install, migrate, and seed (run once)**
```sh
cd frontend && npm i && npm run build && cd ../server && npm i && npm run migrate && npm run seed && cd ..
```

**5. Start the server**
```sh
cd server && npm start
```

Open your browser to **http://localhost:3000**

---

## Team

| Name | Role |
|---|---|
| Fernando Martinez | Scrum Master, Full Stack Developer |
| Xavier Hertzog | Frontend Developer |
| Caleb Johnson | Frontend Developer |
| Kristopher Noel | Backend Developer |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
