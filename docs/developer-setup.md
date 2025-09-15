# Developer Setup

This guide will help you get the Cosmic Events apps running locally.

## Prerequisites
- Node.js (v22+ recommended)

## 1. Install Dependencies
```sh
npm install
```

## 2. Set Up API Environment Variables
Create a `.env` file in `apps/api/` with the following:
```env
AWS_REGION=
CDN_BUCKET=
DATABASE_NAME=
DATABASE_RESOURCE_ARN=
DATABASE_SECRET_ARN=
GOOGLE_CLIENT_ID=
CACHE_URL=
SESSION_SECRET=
```

Fill in with the appropriate values.

## 3. Run the Web App
```sh
npx nx serve web
```
This will start the frontend on [http://localhost:4200](http://localhost:4200) and the backend on [http://localhost:3000](http://localhost:3000).
