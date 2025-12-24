# Quick Start Commands

## 1. Install All Dependencies
```bash
npm run install-all
```

## 2. Create .env File
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

## 3. Seed Database (First Time)
```bash
npm run seed
```

## 4. Run Backend (Terminal 1)
```bash
npm run server
```

## 5. Run Frontend (Terminal 2)
```bash
cd client && npm run dev
```

## Access
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Login: admin / PHEWcares12@
