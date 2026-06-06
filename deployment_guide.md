# WardrobeIQ - Render Production Deployment Guide

This guide details how to deploy the **WardrobeIQ** application (both backend and frontend) using **Render** and link them to a hosted **Render PostgreSQL** database.

---

## Step 1: Deploy a Render PostgreSQL Database

Render offers managed PostgreSQL databases that our Sequelize models can connect to.

1. Go to your [Render Dashboard](https://dashboard.render.com/) and click **New** (top right) -> **PostgreSQL**.
2. Configure the database details:
   - **Name**: `wardrobe-iq-db`
   - **Database**: `wardrobe_iq` (or leave blank for auto-generated)
   - **User**: (leave blank for auto-generated)
   - **Region**: Select a region close to your users (e.g., Singapore for Asia, Oregon for US).
3. Scroll down and click **Create Database**.
4. Once the database status changes to **Available**, look for the connection URLs on the right side under **Connections**:
   - Copy the **Internal Database URL** (if you deploy the backend on Render in the same region, this is faster).
   - Alternatively, copy the **External Database URL** (works from any region).
   - *Example connection URL format*: `postgresql://db_user:password@host:port/database`

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
