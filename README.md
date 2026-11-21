# HealthMate

A React Native (Expo) app for daily steps, calories and water, with local SQLite
storage,
goals, a dashboard, search, and a per-day entry log.

## Run
```bash
npm install
npx expo start          # then press "a" for Android
```

## Build
```bash
npx eas-cli build -p android --profile production    # produces an installable APK
```

## Test
```bash
npm test
npm run typecheck
npm run lint
```

## Structure
- `src/app`: routes (expo-router)
- `src/core`: database, theme, shared UI and utilities
- `src/features`: dashboard, records, goals, each with its own store and repository

## Data
SQLite via expo-sqlite. Schema and migrations: `src/core/db/migrations.ts`.
Seeded with dummy data on first launch for testing.
 ```

 Then commit it the same way as before, with a PR into develop and then develop into
 main:

 ```bash
git switch -c docs/readme
git add README.md
git commit -m "docs: write the project readme"
git push -u origin docs/readme
# merge on GitHub: docs/readme → develop, then develop → main