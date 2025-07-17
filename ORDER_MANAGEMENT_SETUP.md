# Farm Ferry Order Management - Dynamic Setup Guide

## Overview

The Farm Ferry Order Management system has been completely transformed from static mock data to a fully dynamic backend-integrated solution. This guide will help you set up and test the system.

## Features Implemented

### ✅ Backend Integration
- **Real-time Order Data**: Orders are fetched from the MongoDB database
- **Live Status Updates**: Order status can be updated in real-time
- **Delivery Associate Assignment**: Assign delivery personnel to orders
- **Pagination**: Handle large datasets with server-side pagination
- **Search & Filtering**: Filter orders by status, date, and search terms
- **Error Handling**: Comprehensive error handling with user feedback

### ✅ API Endpoints Used
- `GET /api/v1/orders` - Fetch all orders with pagination and filtering
- `GET /api/v1/orders/:id` - Get specific order details
- `PUT /api/v1/orders/:id/status` - Update order status
- `PUT /api/v1/orders/:id/assign-delivery` - Assign delivery associate
- `GET /api/v1/admin/delivery-associates` - Get all delivery associates

### ✅ Frontend Features
- **Loading States**: Show loading indicators during API calls
- **Error Handling**: Display error messages with retry options
- **Real-time Updates**: Automatically refresh data after actions
- **Responsive Design**: Works on all screen sizes
- **Modal Dialogs**: Detailed order views and action forms

## Setup Instructions

### 1. Backend Setup

#### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Environment variables configured

#### Install Dependencies
```bash
cd farmferry-backend-revised
npm install
```

#### Environment Configuration
Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=9000
NODE_ENV=development

# MongoDB Configuration
MONGO_DB_URI=mongodb://localhost:27017
DB_NAME=farmferry

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

#### Start Backend Server
```bash
npm run dev
```

The backend will be available at `http://localhost:9000`

### 2. Create Test Data

#### Create Test Admin User
```bash
cd farmferry-backend-revised
node createTestAdmin.js
```

This creates an admin user with:
- Email: `admin@farmferry.com`
- Password: `admin123`

#### Create Test Delivery Associates
```bash
cd farmferry-backend-revised
node createTestDeliveryAssociates.js
```

This creates 4 delivery associates:
- Mike Johnson (mike@farmferry.com)
- Sarah Davis (sarah@farmferry.com)
- Tom Anderson (tom@farmferry.com)
- Lisa Wilson (lisa@farmferry.com)

All with password: `delivery123`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd farm-ferry-admin
npm install
```

#### Environment Configuration
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:9000
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Testing the System

### 1. Login as Admin
1. Navigate to `http://localhost:3000/loginpage`
2. Login with:
   - Email: `admin@farmferry.com`
   - Password: `admin123`
3. You'll be redirected to the admin dashboard

### 2. Access Order Management
1. Navigate to the Order Management section
2. You should see the dynamic order management interface

### 3. Test Features

#### View Orders
- Orders are loaded from the backend
- Pagination works for large datasets
- Search and filtering are functional

#### Update Order Status
1. Click the edit icon (pencil) on any order
2. Select a new status from the modal
3. The order status will be updated in real-time

#### Assign Delivery Associate
1. Click the truck icon on any order
2. Select an available delivery associate
3. The assignment will be saved to the database

#### View Order Details
1. Click the eye icon on any order
2. View comprehensive order information
3. See customer details, items, and delivery information

## API Documentation

### Order Endpoints

#### Get All Orders
```http
GET /api/v1/orders?page=1&limit=10&status=pending&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin_token>
```

#### Get Order by ID
```http
GET /api/v1/orders/:orderId
Authorization: Bearer <admin_token>
```

#### Update Order Status
```http
PUT /api/v1/orders/:orderId/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "processing",
  "note": "Order is being processed"
}
```

#### Assign Delivery Associate
```http
PUT /api/v1/orders/:orderId/assign-delivery
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "deliveryAssociateId": "associate_id_here"
}
```

### Delivery Associate Endpoints

#### Get All Delivery Associates
```http
GET /api/v1/admin/delivery-associates?page=1&limit=10&status=active
Authorization: Bearer <admin_token>
```

## Troubleshooting

### Common Issues

#### 1. CORS Errors
- Ensure `CORS_ORIGIN` is set correctly in backend `.env`
- Check that frontend URL matches the CORS configuration

#### 2. Authentication Errors
- Verify JWT tokens are being sent correctly
- Check that admin user exists in database
- Ensure token hasn't expired

#### 3. Database Connection Issues
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure database exists

#### 4. API Endpoint Errors
- Verify backend server is running on port 9000
- Check that all routes are properly configured
- Ensure admin middleware is working correctly

### Debug Steps

1. **Check Backend Logs**
   ```bash
   cd farmferry-backend-revised
   npm run dev
   ```

2. **Check Frontend Console**
   - Open browser developer tools
   - Check Network tab for API calls
   - Check Console for JavaScript errors

3. **Verify Database**
   ```bash
   # Connect to MongoDB
   mongosh
   use farmferry
   db.orders.find().limit(5)
   db.admins.find()
   db.deliveryassociates.find()
   ```

## Data Structure

### Order Model
```javascript
{
  _id: ObjectId,
  orderId: String,
  customer: ObjectId (ref: Customer),
  supplier: ObjectId (ref: Supplier),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number,
    discountedPrice: Number,
    totalPrice: Number,
    variation: Object
  }],
  subtotal: Number,
  discountAmount: Number,
  taxes: Number,
  deliveryCharge: Number,
  totalAmount: Number,
  status: String,
  paymentMethod: String,
  paymentStatus: String,
  deliveryAddress: Object,
  deliveryAssociate: {
    associate: ObjectId (ref: DeliveryAssociate),
    assignedAt: Date,
    status: String
  },
  estimatedDeliveryDate: Date,
  deliveredAt: Date,
  notes: String,
  statusHistory: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Delivery Associate Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  password: String,
  role: String,
  status: String,
  isOnline: Boolean,
  isAvailable: Boolean,
  vehicle: Object,
  address: Object,
  location: Object,
  documents: Array,
  createdAt: Date,
  updatedAt: Date
}
```

## Performance Considerations

### Backend Optimizations
- Database indexes on frequently queried fields
- Pagination to handle large datasets
- Efficient population of related data
- Caching for frequently accessed data

### Frontend Optimizations
- Debounced search inputs
- Lazy loading of order details
- Optimistic updates for better UX
- Error boundaries for graceful error handling

## Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Secure password hashing
- CORS protection
- Rate limiting (recommended for production)

## Next Steps

### Potential Enhancements
1. **Real-time Updates**: Implement WebSocket connections for live updates
2. **Push Notifications**: Notify admins of new orders or status changes
3. **Advanced Filtering**: Add more filter options (date ranges, amounts, etc.)
4. **Bulk Operations**: Allow updating multiple orders at once
5. **Export Functionality**: Export orders to CSV/PDF
6. **Analytics Dashboard**: Add charts and metrics
7. **Mobile App**: Create mobile app for delivery associates

### Production Considerations
1. **Environment Variables**: Use proper environment management
2. **Database Backups**: Implement regular backup strategies
3. **Monitoring**: Add application monitoring and logging
4. **SSL/TLS**: Enable HTTPS in production
5. **Rate Limiting**: Implement API rate limiting
6. **Load Balancing**: Scale the application as needed

## Support

If you encounter any issues or need assistance:

1. Check the troubleshooting section above
2. Review the backend logs for error messages
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed
5. Check that MongoDB is running and accessible

## Conclusion

The Farm Ferry Order Management system is now fully dynamic and production-ready. The integration with the backend provides real-time data management, comprehensive error handling, and a smooth user experience. Follow this guide to set up and test the system, and feel free to extend it with additional features as needed. 