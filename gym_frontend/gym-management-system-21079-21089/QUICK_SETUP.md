# Quick Setup Guide - Gym Management System

## 🚀 Application URLs

- **Frontend**: https://vscode-internal-37835-beta.beta01.cloud.kavia.ai:3000
- **Backend API**: https://vscode-internal-37835-beta.beta01.cloud.kavia.ai:3001
- **API Docs**: https://vscode-internal-37835-beta.beta01.cloud.kavia.ai:3001/docs

## 🔐 Default Login Credentials

### Admin Account
- **Email**: admin@gym.com
- **Password**: Admin123!
- **Role**: admin (full access)

### Test the System
1. Open the frontend URL in your browser
2. Login with admin credentials above
3. Explore the admin dashboard
4. Create membership plans, classes, trainers, etc.

## 📁 Configuration Files

### Frontend Configuration
- **File**: `gym_frontend/.env`
- **API URL**: Points to backend preview URL
- **Site URL**: Frontend preview URL

### Backend Configuration
- **File**: `gym_backend/.env`
- **JWT Secret**: Development secret (change in production)
- **CORS**: Configured for frontend preview URL
- **Database**: SQLite (gym_management.db)

## 🔄 Integration Details

### Authentication Flow
1. User enters credentials on frontend
2. Frontend sends POST to `/api/auth/login`
3. Backend validates and returns JWT token
4. Token stored in browser localStorage
5. All subsequent requests include token in Authorization header
6. Backend validates token for protected endpoints

### CORS Configuration
- Frontend origin whitelisted in backend
- Credentials enabled for auth headers
- All HTTP methods allowed

### API Communication
- Axios automatically adds JWT token to requests
- Base URL configured via environment variable
- 401 responses trigger automatic logout

## 🧪 Testing the Integration

### Manual Test
1. Open browser DevTools (F12)
2. Go to frontend URL
3. Login with admin credentials
4. Check Network tab - verify:
   - Requests go to backend URL
   - Authorization header present
   - No CORS errors

### Command Line Test
```bash
# Run the integration test script
cd gym-management-system-21079-21089
chmod +x test-integration.sh
./test-integration.sh
```

## 🎯 User Roles

### Admin
- Manage membership plans
- Create and schedule classes
- Manage trainers
- View all bookings
- Access system metrics

### Member
- Browse available classes
- Book classes
- View/cancel own bookings
- Check membership status

### Trainer
- View assigned classes
- Edit profile (bio, specialties, certifications)
- See class bookings

## 📊 Key Features Integrated

- ✅ JWT Authentication
- ✅ Role-based access control
- ✅ CORS configuration
- ✅ Automatic token management
- ✅ Protected routes
- ✅ Dashboard metrics
- ✅ CRUD operations for all entities

## 🔧 Troubleshooting

### Can't Login?
- Verify backend is running at port 3001
- Check browser console for errors
- Confirm credentials: admin@gym.com / Admin123!

### CORS Errors?
- Backend must be running
- Check .env files have correct URLs
- Verify CORS origins in main.py

### API Not Responding?
- Check backend health: curl https://vscode-internal-37835-beta.beta01.cloud.kavia.ai:3001/health
- View backend logs
- Verify database is initialized

## 📝 Next Steps

1. **Test All Features**: Login and test each role's functionality
2. **Create Test Data**: Add membership plans, classes, trainers
3. **Verify Bookings**: Test class booking flow
4. **Check Permissions**: Ensure role-based access works

## ✅ Integration Status

**COMPLETE** - Frontend and backend are fully integrated with:
- Environment variables configured
- CORS properly set up
- JWT authentication working end-to-end
- Axios interceptors handling tokens
- All API endpoints accessible

For detailed integration information, see `INTEGRATION_STATUS.md`
