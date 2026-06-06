# WardrobeIQ - Render Production Deployment Guide

This guide details how to deploy the **WardrobeIQ** application (both backend and frontend) using **Render** and link them to a hosted **Render PostgreSQL** database.

---

## Step 1: Create a PostgreSQL Database on Neon (neon.tech)

Neon offers a free, persistent serverless PostgreSQL database (with no 30-day deletion limit like Render's free tier).

1. Go to [Neon.tech](https://neon.tech/) and sign up / log in.
2. Click **Create Project**.
3. Configure the project details:
   - **Project Name**: `wardrobe-iq-db`
   - **Postgres Version**: Select the default (e.g., v16).
   - **Region**: Select a region close to your users (e.g., Singapore for Asia, Oregon/Virginia for US).
4. Click **Create Project**.
5. Once created, you will be shown the **Connection Details** modal:
   - Set the dropdown to **Connection string** (or choose URI).
   - Copy the provided URL. It will look like:
     `postgresql://neondb_owner:password@ep-some-host.region.aws.neon.tech/neondb?sslmode=require`
   - This connection string will be used as the `DATABASE_URL` environment variable when configuring your Backend Web Service.

---

## Step 2: Deploy the Express Backend Service

Deploy the backend folder as a Render **Web Service**.

1. In your Render Dashboard, click **New** -> **Web Service**.
2. Select **Connect a repository** and choose your `wardrobe-iq` GitHub repository.
3. Configure the service settings:
   - **Name**: `wardrobe-iq-backend`
   - **Root Directory**: `backend` (very important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Expand the **Advanced** section to add your Environment Variables (**Env Groups / Variables**):
   - **`DATABASE_URL`**: (Paste the PostgreSQL connection URL you copied in Step 1).
   - **`JWT_SECRET`**: (Type a secure random string, e.g. `your_production_jwt_secret_key_12345`).
   - **`NODE_ENV`**: `production`
   - **`PORT`**: `5000` (Render will map traffic to this port).
   - **`WEATHER_API_KEY`**: *(Optional)* Your OpenWeatherMap API key. If omitted, the server automatically defaults to the custom seeded date weather simulation.
   - **`GEMINI_API_KEY`**: *(Optional)* Your Google Gemini API key. If omitted, the AI operations (tagging, gaps, search) will fallback to the built-in local mock matching engines.
5. Click **Create Web Service**.
6. Wait for the build and deployment logs to say `PostgreSQL Connected Successfully via Sequelize!` and `Your service is live`.
7. **Copy the URL of your live Web Service** (e.g. `https://wardrobe-iq-backend.onrender.com`).

---

## Step 3: Deploy the React Frontend Static Site

Deploy the frontend folder as a Render **Static Site**.

1. In your Render Dashboard, click **New** -> **Static Site**.
2. Select the same `wardrobe-iq` GitHub repository.
3. Configure the static site settings:
   - **Name**: `wardrobe-iq`
   - **Root Directory**: `frontend` (very important!)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Expand the **Advanced** section and add the following Environment Variable:
   - **`VITE_API_URL`**: (Paste your Backend Web Service URL with `/api` appended, e.g., `https://wardrobe-iq-backend.onrender.com/api`).
5. Click **Create Static Site**.
6. Once the build finishes and the service goes live, navigate to the frontend URL! Your app is now fully deployed and communicating with the backend and PostgreSQL database.

---

## Developer Note: Local Development Check
During local development, you do not need to configure anything. The database still points to your local PostgreSQL, and the frontend defaults to `http://localhost:5000/api` if `VITE_API_URL` is omitted.
