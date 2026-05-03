# 🚀 Restaurant Management System (RMS) - Setup Guide

This guide will help you set up and run the RMS project on your local machine for development.

## 📋 Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (v20 or higher)
- **npm** (v10 or higher)
- **Docker Desktop** (Recommended for the database) OR **MySQL 8.0**
- **Git**

---

## 🛠️ Installation Steps

### 1. Clone the Repository
Open your terminal and run:
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Configure Environment Variables
You need to create local `.env` files from the provided templates. Run these commands in the project root:

**For the API:**
- Copy `apps/api/.env.example` to `apps/api/.env`
- Edit `apps/api/.env` if you need to change database credentials.

**For the Web Frontend:**
- Copy `apps/web/.env.example` to `apps/web/.env`

**Optional (Root):**
- Copy `.env.example` to `.env`

---

## 🗄️ Database Setup

### Option A: Using Docker (Recommended)
If you have Docker installed, simply run:
```bash
docker-compose up -d
```
This starts a MySQL container with the correct credentials and database (`rms`) already configured.

### Option B: Local MySQL Installation
1. Log into your MySQL instance.
2. Create a database named `rms`.
3. Update the `DB_USER` and `DB_PASSWORD` in `apps/api/.env` to match your local MySQL settings.

---

## 📦 Install Dependencies & Initialize

From the **root folder**, run:

```bash
# Install all project dependencies
npm install

# Build shared types (required before running apps)
npm run build -w @rms/shared-types

# Run database migrations to create tables
npm run migrate
```

---

## 🏃 Running the Application

To start both the Backend (API) and Frontend (Web) simultaneously in development mode:

```bash
npm run dev
```

### Accessing the services:
- **Web Frontend:** [http://localhost:5173](http://localhost:5173)
- **API Server:** [http://localhost:4000/api](http://localhost:4000/api)

---

## 🛠️ Available Scripts

- `npm run dev`: Start all apps in dev mode.
- `npm run build`: Build all apps for production.
- `npm run lint`: Run linting checks across the monorepo.
- `npm run typecheck`: Run TypeScript type checks.
- `npm run migrate`: Run database migrations.
