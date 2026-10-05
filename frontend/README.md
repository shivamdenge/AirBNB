# AirBNB Frontend (React + TypeScript)

A production-oriented frontend starter compatible with this Spring Boot backend.

## Stack

- React + TypeScript + Vite
- React Router
- Axios with JWT + refresh-cookie handling

## 1) Run locally (frontend only)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open: `http://localhost:5173`

## 2) Push this project to GitHub

From the repository root (`AirBNB`):

```bash
git init
git add .
git commit -m "feat: add AirBNB backend + frontend"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

If your remote already exists, use:

```bash
git push -u origin main
```

## 3) Get the frontend from GitHub on another machine

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>/frontend
cp .env.example .env
npm install
npm run dev
```

## 4) (Optional) Work with frontend as a separate VS Code project

```bash
cd <your-repo>/frontend
code .
```

## Environment

Default backend URL:

- `http://localhost:8080/api/v1`

You can change it in `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Implemented Views

- Search hotels
- Hotel detail + quick booking initiation
- Login
- Profile
- My bookings
- Manager dashboard (hotels list)

## Troubleshooting

- If `npm install` fails because of network policy, try again on your local machine/home network.
- If pages load but API data is empty/error, start backend on `localhost:8080` or update `VITE_API_BASE_URL`.
- If port `5173` is busy, Vite will show an alternate port in terminal; open that URL.
