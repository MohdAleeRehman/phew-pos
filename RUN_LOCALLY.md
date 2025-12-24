# Commands to Run Phew POS Locally

## Step 1: Install Dependencies

### Install Backend Dependencies
```bash
npm install
```

### Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

**OR install both at once:**
```bash
npm run install-all
```

## Step 2: Create .env File

```bash
cat > .env << 'ENVEOF'
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://mohdaleerehman_db_user:8Sj0pu3BexuFWp8Z@drinkpheww.jts4pbd.mongodb.net/phew-pos?retryWrites=true&w=majority&appName=drinkpheww
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
TAX_RATE=0.05
TAX_ENABLED=true
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=PHEWcares12@
ENVEOF
```

## Step 3: Seed Database (First Time Only)

```bash
npm run seed
```

This creates:
- Admin user (username: admin, password: PHEWcares12@)
- All menu categories and items

## Step 4: Run Backend and Frontend

### Option A: Run Separately (Recommended for Development)

**Terminal 1 - Backend:**
```bash
npm run server
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on: http://localhost:3000

### Option B: Run Both Together

```bash
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Login Credentials

- **Username**: admin
- **Password**: PHEWcares12@

## Stop the Servers

Press `Ctrl + C` in each terminal window.
