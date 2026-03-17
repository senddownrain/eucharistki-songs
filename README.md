# Notes Manager (Vue 3 + Vuetify + Firebase + PWA)

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Firebase Hosting deploy

```bash
npm run build
firebase deploy --only hosting
```

## Required manual setup

1. Enable **Email/Password** provider in Firebase Authentication.
2. Create Firestore database and a `notes` collection.
3. Configure Firestore security rules so users can only access their own notes by `ownerId`.
4. Create `.env` from `.env.example` and set `VITE_FIREBASE_*` values for each environment.
5. Optionally, configure custom domain in Firebase Hosting.
