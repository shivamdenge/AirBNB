# How to get and run only the frontend (GitHub guide)

## A) Push your project to GitHub

Run these commands from the repository root:

```bash
git add .
git commit -m "chore: prepare frontend usage guide"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

If `origin` already exists:

```bash
git push -u origin main
```

## B) Download/clone from GitHub

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>/frontend
```

## C) Run frontend only

```bash
cp .env.example .env
npm install
npm run dev
```

Then open:

- `http://localhost:5173`

## D) Open frontend as separate VS Code project

```bash
cd <your-repo>/frontend
code .
```

## E) Optional: create a portable frontend zip from this repo

```bash
./scripts/export-frontend.sh
```

This generates `frontend.zip` at repository root.
