# RideExpress Statistics API

This module provides comprehensive analytics and statistics for the RideExpress ride-sharing application. All endpoints require ADMIN or SUPER_ADMIN authentication.

## Endpoints

### 1. Dashboard Statistics

**GET** `/stats/dashboard`

Provides an overview of all key metrics in a single request.

**Response:**

```json
{
  "success": true,
  "message": "Dashboard stats fetched successfully",
  "data": {
    "overview": {
      "totalUsers": 150,
      "totalRides": 500,
      "totalDrivers": 45,
      "totalRevenue": 12500.5,
      "activeRides": 12,
      "completedRidesToday": 25,
      "newUsersThisWeek": 15,
      "newDriversThisWeek": 3
    }
  }
}
```

### 2. Ride Statistics

**GET** `/stats/rides`

Comprehensive ride analytics including counts, status distribution, and performance metrics.

**Response:**

```json
{
  "success": true,
  "message": "Ride stats fetched successfully",
  "data": {
    "totalRides": 500,
    "ridesByStatus": [
      { "_id": "COMPLETED", "count": 350 },
      { "_id": "CANCELLED", "count": 50 },
      { "_id": "REQUESTED", "count": 30 },
      { "_id": "ACCEPTED", "count": 20 },
      { "_id": "IN_TRANSIT", "count": 15 },
      { "_id": "PICKED_UP", "count": 15 },
      { "_id": "REJECTED", "count": 20 }
    ],
    "ridesByVehicleType": [
      { "_id": "CAR", "count": 350 },
      { "_id": "BIKE", "count": 150 }
    ],
    "totalDistance": 2500.75,
    "avgDistance": 5.0,
    "totalFare": 12500.5,
    "avgFare": 25.0,
    "ridesLast7Days": 45,
    "ridesLast30Days": 180,
    "ridesThisMonth": 180,
    "ridesThisYear": 500,
    "completedRides": 350,
    "cancelledRides": 50,
    "activeRides": 50,
    "ridesByHour": [
      { "_id": 0, "count": 15 },
      { "_id": 1, "count": 10 }
      // ... hours 0-23
    ],
    "topPickupLocations": [
      { "_id": "Airport Terminal 1", "count": 45 },
      { "_id": "Central Station", "count": 38 }
      // ... top 10 locations
    ],
    "topDestinationLocations": [
      { "_id": "Downtown Mall", "count": 52 },
      { "_id": "Business District", "count": 41 }
      // ... top 10 locations
    ],
    "avgRideDuration": 25.5
  }
}
```

### 3. User Statistics

**GET** `/stats/users`

User analytics including role distribution, status counts, and growth metrics.

**Response:**

```json
{
  "success": true,
  "message": "User stats fetched successfully",
  "data": {
    "totalUsers": 150,
    "totalRiders": 100,
    "totalDrivers": 45,
    "totalAdmins": 5,
    "activeUsers": 140,
    "blockedUsers": 5,
    "suspendedUsers": 5,
    "newUsersLast7Days": 15,
    "newUsersLast30Days": 45,
    "usersByRole": [
      { "_id": "RIDER", "count": 100 },
      { "_id": "DRIVER", "count": 45 },
      { "_id": "ADMIN", "count": 3 },
      { "_id": "SUPER_ADMIN", "count": 2 }
    ],
    "usersByStatus": [
      { "_id": "ACTIVE", "count": 140 },
      { "_id": "BLOCKED", "count": 5 },
      { "_id": "SUSPENDED", "count": 5 }
    ],
    "verifiedUsers": 145,
    "unverifiedUsers": 5
  }
}
```

### 4. Driver Statistics

**GET** `/stats/drivers`

Driver analytics including approval status, availability, earnings, and performance metrics.

**Response:**

```json
{
  "success": true,
  "message": "Driver stats fetched successfully",
  "data": {
    "totalDrivers": 45,
    "approvedDrivers": 40,
    "pendingDrivers": 3,
    "rejectedDrivers": 1,
    "suspendedDrivers": 1,
    "availableDrivers": 25,
    "unavailableDrivers": 15,
    "onTripDrivers": 5,
    "driversByVehicleType": [
      { "_id": "CAR", "count": 30 },
      { "_id": "BIKE", "count": 15 }
    ],
    "driversByStatus": [
      { "_id": "APPROVED", "count": 40 },
      { "_id": "PENDING", "count": 3 },
      { "_id": "REJECTED", "count": 1 },
      { "_id": "SUSPEND", "count": 1 }
    ],
    "driversByAvailability": [
      { "_id": "AVAILABLE", "count": 25 },
      { "_id": "UNAVAILABLE", "count": 15 },
      { "_id": "ON_TRIP", "count": 5 }
    ],
    "totalEarnings": 8750.25,
    "avgEarnings": 194.45,
    "newDriversLast7Days": 3,
    "newDriversLast30Days": 8,
    "topEarningDrivers": [
      {
        "driverName": "John Doe",
        "vehicleType": "CAR",
        "vehicleModel": "Toyota Camry",
        "earnings": 450.75,
        "status": "APPROVED"
      }
      // ... top 10 drivers
    ]
  }
}
```

### 5. Revenue Statistics

**GET** `/stats/revenue`

Financial analytics including revenue trends, earnings by vehicle type, and revenue loss analysis.

**Response:**

```json
{
  "success": true,
  "message": "Revenue stats fetched successfully",
  "data": {
    "totalRevenue": 12500.5,
    "revenueThisMonth": 3200.75,
    "revenueThisYear": 12500.5,
    "revenueLast7Days": 850.25,
    "revenueLast30Days": 3200.75,
    "avgRevenuePerRide": 25.0,
    "revenueByVehicleType": [
      { "_id": "CAR", "total": 8750.35 },
      { "_id": "BIKE", "total": 3750.15 }
    ],
    "revenueByStatus": [
      { "_id": "COMPLETED", "total": 12500.5 },
      { "_id": "CANCELLED", "total": 0 },
      { "_id": "IN_TRANSIT", "total": 0 },
      { "_id": "PICKED_UP", "total": 0 },
      { "_id": "ACCEPTED", "total": 0 },
      { "_id": "REQUESTED", "total": 0 },
      { "_id": "REJECTED", "total": 0 }
    ],
    "revenueByHour": [
      { "_id": 0, "total": 375.15 },
      { "_id": 1, "total": 250.5 }
      // ... hours 0-23
    ],
    "revenueByDay": [
      { "_id": 1, "total": 1785.75 }, // Monday
      { "_id": 2, "total": 1920.5 } // Tuesday
      // ... days 1-7
    ],
    "topRevenueLocations": [
      { "_id": "Downtown Mall", "total": 1560.75 },
      { "_id": "Business District", "total": 1230.5 }
      // ... top 10 locations
    ],
    "cancellationRevenueLoss": 1250.25,
    "pendingRevenue": 750.5
  }
}
```

## Data Insights

### Key Metrics Tracked

1. **Ride Performance**

   - Total rides and completion rates
   - Average ride duration and distance
   - Popular pickup and destination locations
   - Hourly and daily ride patterns

2. **User Growth**

   - New user registrations (weekly/monthly)
   - User role distribution
   - Account verification status
   - User activity status

3. **Driver Analytics**

   - Driver approval pipeline
   - Availability patterns
   - Earnings distribution
   - Top performing drivers

4. **Revenue Analysis**

   - Revenue trends over time
   - Revenue by vehicle type
   - Revenue by location
   - Cancellation impact on revenue

5. **Operational Metrics**
   - Active rides and driver availability
   - Peak hours and demand patterns
   - Geographic distribution of rides
   - Vehicle type preferences

### Use Cases

- **Admin Dashboard**: Real-time overview of platform performance
- **Business Intelligence**: Revenue analysis and growth tracking
- **Operational Planning**: Driver allocation and demand forecasting
- **Performance Monitoring**: Driver and ride quality metrics
- **Financial Reporting**: Revenue tracking and loss analysis

### Authentication

All statistics endpoints require ADMIN or SUPER_ADMIN role authentication using the `checkAuth` middleware.

### Performance Notes

- Statistics use MongoDB aggregation pipelines for efficient data processing
- All queries are optimized with proper indexing recommendations
- Time-based calculations use efficient date arithmetic
- Large datasets are processed with pagination-friendly aggregation stages
