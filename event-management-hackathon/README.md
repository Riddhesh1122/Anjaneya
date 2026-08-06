# event-management-hackathon

Starter scaffold for a college event management hackathon project.

Structure

```
event-management-hackathon/
├── package.json
├── .gitignore
├── README.md
├── public/
├── src/
└── .env.example
```

Quick start

```bash
cd event-management-hackathon
npm install
npm run dev
```

Open `http://localhost:3001` (default)

MongoDB Atlas setup

1. Create a MongoDB Atlas cluster and a database user.
2. Copy `event-management-hackathon/.env.example` to `event-management-hackathon/.env`.
3. Update `MONGO_URI` in `.env` with your Atlas connection string (replace `<username>`, `<password>`, and `<dbname>`).
4. Set a secure `JWT_SECRET` in `.env`.
5. Run the server:

```bash
npm run dev
```

Warning: Do not commit the `.env` file — it is ignored by `.gitignore`. Share only `event-management-hackathon/.env.example` with teammates.
