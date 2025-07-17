# Farm Ferry Order Management - Troubleshooting Guide

## Common Issues and Solutions

### 🔐 Authentication Issues

#### Issue: "Role: admin is not allowed to access this resource" (403 Forbidden)

**Symptoms:**
- 403 error when trying to fetch orders
- Admin login works but subsequent API calls fail

**Causes:**
1. Token not being sent correctly
2. Token expired
3. Role not properly set in token
4. Admin user not created properly

**Solutions:**

1. **Check if admin user exists:**
   ```bash
   cd farmferry-backend-revised
   node createTestAdmin.js
   ```

2. **Debug token generation:**
   ```bash
   cd farmferry-backend-revised
   node debugAuth.js
   ```

3. **Check token in browser:**
   - Open browser developer tools
   - Go to Application/Storage tab
   - Check localStorage for 'token'
   - Verify token is present and not expired

4. **Verify environment variables:**
   ```env
   ACCESS_TOKEN_SECRET=your_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_secret_here
   ACCESS_TOKEN_EXPIRY=1d
   ```

5. **Test admin login manually:**
   ```bash
   curl -X POST http://localhost:9000/api/v1/auth/login/admin \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@farmferry.com","password":"admin123"}'
   ```

#### Issue: "Can't find /api/v1/admin/delivery-associates on this server!" (404 Not Found)

**Symptoms:**
- 404 error when trying to fetch delivery associates
- Endpoint not found

**Causes:**
1. Route not properly registered
2. Import/export issues in controller
3. Server not restarted after changes

**Solutions:**

1. **Check if route is registered:**
   ```bash
   cd farmferry-backend-revised
   node testEndpoints.js
   ```

2. **Verify admin routes file:**
   - Check `routes/admin.routes.js` has the delivery-associates route
   - Ensure `getAllDeliveryAssociates` is imported correctly

3. **Restart backend server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart
   npm run dev
   ```

4. **Test endpoint manually:**
   ```bash
   # First get a token
   curl -X POST http://localhost:9000/api/v1/auth/login/admin \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@farmferry.com","password":"admin123"}'
   
   # Then test the endpoint (replace TOKEN with actual token)
   curl -X GET http://localhost:9000/api/v1/admin/delivery-associates \
     -H "Authorization: Bearer TOKEN"
   ```

### 🌐 Network Issues

#### Issue: CORS Errors

**Symptoms:**
- CORS errors in browser console
- Requests blocked by browser

**Solutions:**

1. **Check CORS configuration in backend:**
   ```javascript
   // In app.js
   app.use(cors({
     origin: true, // Allow all origins for development
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));
   ```

2. **Verify frontend URL:**
   - Ensure frontend is running on `http://localhost:3000`
   - Check that backend CORS allows this origin

3. **Check environment variables:**
   ```env
   CORS_ORIGIN=http://localhost:3000
   ```

#### Issue: Connection Refused

**Symptoms:**
- "Failed to fetch" errors
- Connection refused errors

**Solutions:**

1. **Check if backend is running:**
   ```bash
   cd farmferry-backend-revised
   npm run dev
   ```
   Should show: "Server running in development mode on port 9000"

2. **Check port configuration:**
   - Backend should be on port 9000
   - Frontend should be on port 3000
   - Verify in `.env` files

3. **Check firewall/antivirus:**
   - Ensure ports 9000 and 3000 are not blocked

### 🗄️ Database Issues

#### Issue: MongoDB Connection Failed

**Symptoms:**
- "MongoDB Connection Error" in backend logs
- Database queries failing

**Solutions:**

1. **Check if MongoDB is running:**
   ```bash
   # For local MongoDB
   mongosh
   # or
   mongo
   ```

2. **Verify connection string:**
   ```env
   MONGO_DB_URI=mongodb://localhost:27017
   DB_NAME=farmferry
   ```

3. **Check database exists:**
   ```bash
   mongosh
   use farmferry
   show collections
   ```

4. **For MongoDB Atlas:**
   - Ensure IP is whitelisted
   - Check connection string format
   - Verify username/password

#### Issue: No Data Found

**Symptoms:**
- Empty order list
- "No orders found" message

**Solutions:**

1. **Create test data:**
   ```bash
   cd farmferry-backend-revised
   node createTestAdmin.js
   node createTestDeliveryAssociates.js
   ```

2. **Check if orders exist:**
   ```bash
   mongosh
   use farmferry
   db.orders.find().limit(5)
   ```

3. **Create sample orders:**
   - Use the customer app to place orders
   - Or create orders directly in database

### 🔧 Frontend Issues

#### Issue: Token Not Stored

**Symptoms:**
- Login works but token not saved
- Subsequent requests fail

**Solutions:**

1. **Check localStorage:**
   ```javascript
   // In browser console
   localStorage.getItem('token')
   ```

2. **Verify AuthContext:**
   - Check if login function saves token
   - Ensure token is being set in localStorage

3. **Check browser storage:**
   - Some browsers block localStorage in private mode
   - Try in normal browsing mode

#### Issue: Component Not Loading

**Symptoms:**
- Blank page
- Loading spinner never stops

**Solutions:**

1. **Check browser console:**
   - Look for JavaScript errors
   - Check network tab for failed requests

2. **Verify component imports:**
   - Check if all imports are correct
   - Ensure all dependencies are installed

3. **Check React DevTools:**
   - Verify component state
   - Check if hooks are working

### 🐛 Debugging Steps

#### Step 1: Backend Debugging

1. **Check server logs:**
   ```bash
   cd farmferry-backend-revised
   npm run dev
   # Watch for error messages
   ```

2. **Test endpoints manually:**
   ```bash
   # Test admin login
   curl -X POST http://localhost:9000/api/v1/auth/login/admin \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@farmferry.com","password":"admin123"}'
   ```

3. **Run debug scripts:**
   ```bash
   node debugAuth.js
   node testEndpoints.js
   ```

#### Step 2: Frontend Debugging

1. **Check browser console:**
   - Open developer tools (F12)
   - Look for error messages
   - Check network tab

2. **Add console logs:**
   ```javascript
   console.log('Token:', localStorage.getItem('token'));
   console.log('API Response:', response);
   ```

3. **Test API calls:**
   - Use browser's Network tab
   - Check request/response headers
   - Verify token is being sent

#### Step 3: Database Debugging

1. **Check database connection:**
   ```bash
   mongosh
   use farmferry
   show collections
   ```

2. **Verify data exists:**
   ```bash
   db.admins.find()
   db.deliveryassociates.find()
   db.orders.find()
   ```

3. **Check indexes:**
   ```bash
   db.orders.getIndexes()
   ```

### 🚀 Quick Fix Checklist

If you're still having issues, go through this checklist:

- [ ] Backend server is running on port 9000
- [ ] Frontend is running on port 3000
- [ ] MongoDB is running and accessible
- [ ] Admin user exists in database
- [ ] Delivery associates exist in database
- [ ] Environment variables are set correctly
- [ ] No CORS errors in browser console
- [ ] Token is stored in localStorage
- [ ] Token is not expired
- [ ] All dependencies are installed

### 📞 Getting Help

If you're still experiencing issues:

1. **Check the logs:**
   - Backend console output
   - Browser console errors
   - Network tab in developer tools

2. **Verify setup:**
   - Follow the setup guide step by step
   - Run all test scripts
   - Check environment configuration

3. **Common solutions:**
   - Restart both frontend and backend servers
   - Clear browser cache and localStorage
   - Recreate test data
   - Check for typos in environment variables

### 🔄 Reset Everything

If all else fails, you can reset everything:

```bash
# 1. Stop all servers
# 2. Clear database (optional)
mongosh
use farmferry
db.dropDatabase()

# 3. Recreate test data
cd farmferry-backend-revised
node createTestAdmin.js
node createTestDeliveryAssociates.js

# 4. Restart servers
npm run dev  # Backend
# In another terminal
cd farm-ferry-admin
npm run dev  # Frontend

# 5. Test login
# Go to http://localhost:3000/loginpage
# Login with admin@farmferry.com / admin123
```

This troubleshooting guide should help you resolve most common issues with the Farm Ferry Order Management system. 