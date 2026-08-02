# event-management-hackathon

Starter scaffold for a college event management hackathon project.

Structure

```
event-management-hackathon/
├── package.json
├── server/
│   └── src/
├── client/
├── .gitignore
├── README.md
└── .env.example
```

Quick start

```bash
cd event-management-hackathon
npm install
npm run client:install
npm run dev
```

Run the client separately during development:

```bash
cd client
npm run dev
```

Open `http://localhost:3001` for the API/server and `http://localhost:5173` for the Vite client.

Docker (optional)

To run a local MongoDB quickly for development using Docker Compose:

```bash
docker compose up -d
# then copy .env.example to .env and set MONGO_URI to mongodb://localhost:27017/anjaneya
Copy-Item .env.example .env # PowerShell
# edit .env to set MONGO_URI and JWT_SECRET
npm run dev
```

Backend layout

```text
server/
	src/
		config/
		constants/
		controllers/
		middleware/
		models/
		routes/
		services/
		utils/
		validators/
		app.js
		server.js
```

MongoDB Atlas setup

1. Create a MongoDB Atlas cluster and a database user.
2. Copy `event-management-hackathon/.env.example` to `event-management-hackathon/.env`.
3. Update `MONGO_URI` in `.env` with your Atlas connection string (replace `<username>`, `<password>`, and `<dbname>`).
4. Set a secure `JWT_SECRET` in `.env`.
5. Start the backend and frontend as shown above.

Warning: Do not commit the `.env` file — it is ignored by `.gitignore`. Share only `event-management-hackathon/.env.example` with teammates.
