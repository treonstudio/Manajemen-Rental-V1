// Mock API for development and fallback with comprehensive dummy data
export const mockApi = {
  // Vehicle-related endpoints
  getVehicles: () => {
    return [
      {
        id: "1",
        license_plate: "B 1234 ABC",
        brand: "Toyota",
        model: "Avanza",
        year: 2022,
        type: "MPV",
        category: "ekonomi",
        capacity: 7,
        fuel_type: "bensin",
        transmission: "manual",
        daily_rate: 300000,
        with_driver_rate: 450000,
        status: "available",
        features: ["AC", "Audio System", "Power Steering", "Electric Windows"],
        rating: 4.5,
        total_reviews: 128,
        engine_capacity: "1500cc",
        fuel_consumption: "14 km/liter",
        max_speed: "180 km/jam",
        color: "Putih",
        location: "Jakarta",
        last_maintenance: "2024-01-15",
        insurance_type: "comprehensive",
        mileage: 25000,
        condition: "excellent",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        image_url: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=80",
        gallery_images: [
          "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=80",
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80"
        ]
      },
      {
        id: "2",
        license_plate: "B 5678 DEF",
        brand: "Honda",
        model: "Civic",
        year: 2021,
        type: "Sedan",
        category: "premium",
        capacity: 5,
        fuel_type: "bensin",
        transmission: "automatic",
        daily_rate: 450000,
        with_driver_rate: 600000,
        status: "available",
        features: ["AC", "Audio System", "Power Steering", "Leather Seats", "Sunroof"],
        rating: 4.8,
        total_reviews: 89,
        engine_capacity: "1800cc",
        fuel_consumption: "12 km/liter",
        max_speed: "200 km/jam",
        color: "Hitam",
        location: "Jakarta",
        last_maintenance: "2024-01-10",
        insurance_type: "comprehensive",
        mileage: 18000,
        condition: "excellent",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-10T14:20:00Z",
        image_url: "https://images.unsplash.com/photo-1580414155951-82c4ac5fb29c?w=800&q=80",
        gallery_images: [
          "https://images.unsplash.com/photo-1580414155951-82c4ac5fb29c?w=800&q=80",
          "https://images.unsplash.com/photo-1619976215249-f927565c3db7?w=800&q=80"
        ]
      },
      {
        id: "3",
        license_plate: "B 9012 GHI",
        brand: "Suzuki",
        model: "Ertiga",
        year: 2023,
        type: "MPV",
        category: "ekonomi",
        capacity: 7,
        fuel_type: "bensin",
        transmission: "manual",
        daily_rate: 350000,
        with_driver_rate: 500000,
        status: "available",
        features: ["AC", "Audio System", "Power Steering", "USB Charging"],
        rating: 4.3,
        total_reviews: 76,
        engine_capacity: "1500cc",
        fuel_consumption: "15 km/liter",
        max_speed: "175 km/jam",
        color: "Silver",
        location: "Jakarta",
        last_maintenance: "2024-01-20",
        insurance_type: "comprehensive",
        mileage: 8000,
        condition: "good",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-20T09:15:00Z",
        image_url: "https://images.unsplash.com/photo-1589018256083-1c7c4cf1c5ac?w=800&q=80"
      },
      {
        id: "4",
        license_plate: "B 3456 JKL",
        brand: "Mitsubishi",
        model: "Xpander",
        year: 2022,
        type: "MPV",
        category: "ekonomi",
        capacity: 7,
        fuel_type: "bensin",
        transmission: "automatic",
        daily_rate: 400000,
        with_driver_rate: 550000,
        status: "rented",
        features: ["AC", "Audio System", "Power Steering", "Cruise Control", "Keyless Entry"],
        rating: 4.6,
        total_reviews: 154,
        engine_capacity: "1500cc",
        fuel_consumption: "13 km/liter",
        max_speed: "185 km/jam",
        color: "Merah",
        location: "Jakarta",
        last_maintenance: "2024-01-05",
        insurance_type: "comprehensive",
        mileage: 15000,
        condition: "excellent",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-22T08:00:00Z",
        image_url: "https://images.unsplash.com/photo-1605515298946-d062f2e9cd14?w=800&q=80"
      },
      {
        id: "5",
        license_plate: "B 7890 MNO",
        brand: "Toyota",
        model: "Fortuner",
        year: 2023,
        type: "SUV",
        category: "luxury",
        capacity: 7,
        fuel_type: "solar",
        transmission: "automatic",
        daily_rate: 700000,
        with_driver_rate: 900000,
        status: "available",
        features: ["AC", "4WD", "Leather Seats", "Sunroof", "Premium Audio", "Navigation"],
        rating: 4.9,
        total_reviews: 203,
        engine_capacity: "2400cc",
        fuel_consumption: "10 km/liter",
        max_speed: "220 km/jam",
        color: "Putih",
        location: "Jakarta",
        last_maintenance: "2024-01-12",
        insurance_type: "comprehensive",
        mileage: 12000,
        condition: "excellent",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-12T11:00:00Z",
        image_url: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=80"
      },
      {
        id: "6",
        license_plate: "B 4567 PQR",
        brand: "Honda",
        model: "HR-V",
        year: 2022,
        type: "SUV",
        category: "premium",
        capacity: 5,
        fuel_type: "bensin",
        transmission: "CVT",
        daily_rate: 500000,
        with_driver_rate: 650000,
        status: "maintenance",
        features: ["AC", "Audio System", "Power Steering", "Parking Sensor", "Rearview Camera"],
        rating: 4.4,
        total_reviews: 98,
        engine_capacity: "1500cc",
        fuel_consumption: "16 km/liter",
        max_speed: "190 km/jam",
        color: "Biru",
        location: "Jakarta",
        last_maintenance: "2024-01-22",
        insurance_type: "comprehensive",
        mileage: 22000,
        condition: "good",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-22T14:00:00Z",
        image_url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80"
      },
      {
        id: "7",
        license_plate: "B 8901 STU",
        brand: "Nissan",
        model: "Livina",
        year: 2021,
        type: "MPV",
        category: "ekonomi",
        capacity: 7,
        fuel_type: "bensin",
        transmission: "manual",
        daily_rate: 320000,
        with_driver_rate: 470000,
        status: "available",
        features: ["AC", "Audio System", "Power Steering", "Central Lock"],
        rating: 4.2,
        total_reviews: 67,
        engine_capacity: "1500cc",
        fuel_consumption: "14 km/liter",
        max_speed: "175 km/jam",
        color: "Abu-abu",
        location: "Jakarta",
        last_maintenance: "2024-01-08",
        insurance_type: "TLO",
        mileage: 28000,
        condition: "good",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-08T16:30:00Z",
        image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80"
      },
      {
        id: "8",
        license_plate: "B 2345 VWX",
        brand: "Toyota",
        model: "Alphard",
        year: 2023,
        type: "Van",
        category: "luxury",
        capacity: 8,
        fuel_type: "bensin",
        transmission: "automatic",
        daily_rate: 1200000,
        with_driver_rate: 1500000,
        status: "available",
        features: ["Premium AC", "Leather Seats", "Captain Seats", "Entertainment System", "Power Doors"],
        rating: 4.9,
        total_reviews: 156,
        engine_capacity: "2500cc",
        fuel_consumption: "8 km/liter",
        max_speed: "200 km/jam",
        color: "Hitam",
        location: "Jakarta",
        last_maintenance: "2024-01-18",
        insurance_type: "comprehensive",
        mileage: 5000,
        condition: "excellent",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-18T13:20:00Z",
        image_url: "https://images.unsplash.com/photo-1564586797368-f7f1643bfa0e?w=800&q=80"
      },
      {
        id: "9",
        license_plate: "B 6789 YZA",
        brand: "Mazda",
        model: "CX-5",
        year: 2022,
        type: "SUV",
        category: "premium",
        capacity: 5,
        fuel_type: "bensin",
        transmission: "automatic",
        daily_rate: 600000,
        with_driver_rate: 800000,
        status: "rented",
        features: ["AC", "Leather Seats", "Sunroof", "Premium Audio", "AWD", "Lane Assist"],
        rating: 4.7,
        total_reviews: 112,
        engine_capacity: "2500cc",
        fuel_consumption: "11 km/liter",
        max_speed: "210 km/jam",
        color: "Merah",
        location: "Jakarta",
        last_maintenance: "2024-01-14",
        insurance_type: "comprehensive",
        mileage: 16000,
        condition: "excellent",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-21T10:45:00Z",
        image_url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80"
      },
      {
        id: "10",
        license_plate: "B 1357 BCD",
        brand: "Daihatsu",
        model: "Terios",
        year: 2021,
        type: "SUV",
        category: "ekonomi",
        capacity: 7,
        fuel_type: "bensin",
        transmission: "manual",
        daily_rate: 380000,
        with_driver_rate: 530000,
        status: "available",
        features: ["AC", "Audio System", "Power Steering", "4WD"],
        rating: 4.1,
        total_reviews: 89,
        engine_capacity: "1500cc",
        fuel_consumption: "13 km/liter",
        max_speed: "170 km/jam",
        color: "Hitam",
        location: "Jakarta",
        last_maintenance: "2024-01-11",
        insurance_type: "TLO",
        mileage: 32000,
        condition: "fair",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-11T09:00:00Z",
        image_url: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=80"
      },
      {
        id: "11",
        license_plate: "B 2468 EFG",
        brand: "BMW",
        model: "X3",
        year: 2023,
        type: "SUV",
        category: "luxury",
        capacity: 5,
        fuel_type: "bensin",
        transmission: "automatic",
        daily_rate: 1000000,
        with_driver_rate: 1300000,
        status: "available",
        features: ["Premium AC", "Leather Seats", "Panoramic Sunroof", "Premium Audio", "AWD", "Parking Assist"],
        rating: 4.8,
        total_reviews: 78,
        engine_capacity: "2000cc",
        fuel_consumption: "9 km/liter",
        max_speed: "230 km/jam",
        color: "Silver",
        location: "Jakarta",
        last_maintenance: "2024-01-16",
        insurance_type: "comprehensive",
        mileage: 8000,
        condition: "excellent",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-16T15:10:00Z",
        image_url: "https://images.unsplash.com/photo-1580414155951-82c4ac5fb29c?w=800&q=80"
      },
      {
        id: "12",
        license_plate: "B 9753 HIJ",
        brand: "Toyota",
        model: "Hiace",
        year: 2022,
        type: "Van",
        category: "ekonomi",
        capacity: 16,
        fuel_type: "solar",
        transmission: "manual",
        daily_rate: 550000,
        with_driver_rate: 750000,
        status: "available",
        features: ["AC", "Audio System", "High Roof", "Comfortable Seats"],
        rating: 4.3,
        total_reviews: 145,
        engine_capacity: "2800cc",
        fuel_consumption: "12 km/liter",
        max_speed: "160 km/jam",
        color: "Putih",
        location: "Jakarta",
        last_maintenance: "2024-01-19",
        insurance_type: "comprehensive",
        mileage: 45000,
        condition: "good",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-19T12:30:00Z",
        image_url: "https://images.unsplash.com/photo-1564586797368-f7f1643bfa0e?w=800&q=80"
      }
    ]
  },

  getDashboardData: () => {
    return {
      // KPI Data
      totalRevenue: 125000000,
      totalTransactions: 248,
      averageTransaction: 504032,
      monthlyGrowth: 18.5,
      totalVehicles: 24,
      availableVehicles: 18,
      rentedVehicles: 4,
      maintenanceVehicles: 2,
      totalDrivers: 15,
      activeDrivers: 12,
      totalCustomers: 456,
      activeRentals: 8,
      outstandingAmount: 8500000,
      collectionRate: 94.2,
      utilizationRate: 82.5,

      // Profit Loss Data
      profitLossData: [
        { month: 'Jan', revenue: 25500000, expenses: 8200000, profit: 17300000, margin: 67.8 },
        { month: 'Dec', revenue: 22200000, expenses: 7800000, profit: 14400000, margin: 64.9 },
        { month: 'Nov', revenue: 20800000, expenses: 7200000, profit: 13600000, margin: 65.4 },
        { month: 'Oct', revenue: 19500000, expenses: 6900000, profit: 12600000, margin: 64.6 },
        { month: 'Sep', revenue: 18900000, expenses: 6700000, profit: 12200000, margin: 64.6 },
        { month: 'Aug', revenue: 21500000, expenses: 7400000, profit: 14100000, margin: 65.6 }
      ],

      // Vehicle Performance
      vehiclePerformance: [
        {
          vehicleId: "8",
          vehicleName: "Toyota Alphard",
          model: "B 2345 VWX",
          totalRentals: 28,
          totalRevenue: 33600000,
          utilizationRate: 92.5,
          averageRentalValue: 1200000,
          lastRentalDate: "2024-01-21",
          status: "excellent"
        },
        {
          vehicleId: "11",
          vehicleName: "BMW X3",
          model: "B 2468 EFG",
          totalRentals: 22,
          totalRevenue: 22000000,
          utilizationRate: 88.0,
          averageRentalValue: 1000000,
          lastRentalDate: "2024-01-20",
          status: "excellent"
        },
        {
          vehicleId: "1",
          vehicleName: "Toyota Avanza",
          model: "B 1234 ABC",
          totalRentals: 45,
          totalRevenue: 13500000,
          utilizationRate: 85.5,
          averageRentalValue: 300000,
          lastRentalDate: "2024-01-22",
          status: "excellent"
        },
        {
          vehicleId: "2", 
          vehicleName: "Honda Civic",
          model: "B 5678 DEF",
          totalRentals: 32,
          totalRevenue: 14400000,
          utilizationRate: 78.0,
          averageRentalValue: 450000,
          lastRentalDate: "2024-01-21",
          status: "excellent"
        },
        {
          vehicleId: "5",
          vehicleName: "Toyota Fortuner",
          model: "B 7890 MNO",
          totalRentals: 26,
          totalRevenue: 18200000,
          utilizationRate: 82.3,
          averageRentalValue: 700000,
          lastRentalDate: "2024-01-19",
          status: "excellent"
        }
      ],

      // Driver Performance
      driverPerformance: [
        {
          driverId: "DRV001",
          driverName: "Ahmad Susanto",
          totalTrips: 256,
          totalRevenue: 15360000,
          averageRating: 4.9,
          completionRate: 98.2,
          customerSatisfaction: 96.5,
          efficiency: 92.7,
          status: "top"
        },
        {
          driverId: "DRV002",
          driverName: "Budi Hartono", 
          totalTrips: 198,
          totalRevenue: 11880000,
          averageRating: 4.7,
          completionRate: 94.8,
          customerSatisfaction: 92.2,
          efficiency: 88.3,
          status: "good"
        },
        {
          driverId: "DRV003",
          driverName: "Citra Pengemudi",
          totalTrips: 234,
          totalRevenue: 14040000,
          averageRating: 4.8,
          completionRate: 96.5,
          customerSatisfaction: 94.8,
          efficiency: 90.5,
          status: "top"
        },
        {
          driverId: "DRV004",
          driverName: "Dedi Kurniawan",
          totalTrips: 176,
          totalRevenue: 10560000,
          averageRating: 4.6,
          completionRate: 92.1,
          customerSatisfaction: 89.5,
          efficiency: 85.2,
          status: "good"
        }
      ],

      // Realtime Metrics
      realtimeMetrics: {
        activeRentals: 8,
        todayRevenue: 4850000,
        todayTransactions: 7,
        vehicleUtilization: 82.5,
        driverUtilization: 80.0,
        pendingMaintenance: 3,
        overduePayments: 2,
        newCustomers: 6
      }
    }
  },

  getTransactions: () => {
    return [
      {
        id: "TRX001",
        customer_name: "John Doe",
        customer_email: "john@example.com",
        customer_phone: "08123456789",
        vehicle_id: "1",
        vehicle_info: "Toyota Avanza - B 1234 ABC",
        service_type: "with_driver",
        rental_start: "2024-01-22",
        rental_duration: 2,
        pickup_time: "09:00",
        pickup_location: "Kantor Rental",
        return_location: "Kantor Rental",
        total_amount: 900000,
        status: "completed",
        payment_status: "paid",
        payment_method: "transfer",
        source: "admin",
        created_at: "2024-01-20T10:00:00Z",
        updated_at: "2024-01-22T15:30:00Z",
        notes: "Pelanggan reguler"
      },
      {
        id: "TRX002",
        customer_name: "Jane Smith", 
        customer_email: "jane@example.com",
        customer_phone: "08234567890",
        vehicle_id: "2",
        vehicle_info: "Honda Civic - B 5678 DEF",
        service_type: "without_driver",
        rental_start: "2024-01-25",
        rental_duration: 3,
        pickup_time: "14:00",
        pickup_location: "Alamat Customer",
        return_location: "Kantor Rental",
        total_amount: 1350000,
        status: "confirmed",
        payment_status: "pending",
        payment_method: null,
        source: "public_portal",
        created_at: "2024-01-21T08:15:00Z",
        updated_at: "2024-01-21T08:15:00Z",
        notes: "Booking dari portal publik"
      },
      {
        id: "TRX003",
        customer_name: "Budi Santoso",
        customer_email: "budi@example.com",
        customer_phone: "08345678901",
        vehicle_id: "8",
        vehicle_info: "Toyota Alphard - B 2345 VWX",
        service_type: "with_driver",
        rental_start: "2024-01-23",
        rental_duration: 1,
        pickup_time: "08:00",
        pickup_location: "Hotel Grand Indonesia",
        return_location: "Bandara Soekarno-Hatta",
        total_amount: 1500000,
        status: "active",
        payment_status: "paid",
        payment_method: "cash",
        source: "whatsapp",
        created_at: "2024-01-22T14:30:00Z",
        updated_at: "2024-01-23T08:00:00Z",
        notes: "Transfer bandara VIP"
      },
      {
        id: "TRX004",
        customer_name: "Sari Indahsari",
        customer_email: "sari@example.com",
        customer_phone: "08456789012",
        vehicle_id: "5",
        vehicle_info: "Toyota Fortuner - B 7890 MNO",
        service_type: "without_driver",
        rental_start: "2024-01-24",
        rental_duration: 5,
        pickup_time: "10:00",
        pickup_location: "Kantor Rental",
        return_location: "Kantor Rental",
        total_amount: 3500000,
        status: "active",
        payment_status: "partially_paid",
        payment_method: "transfer",
        source: "admin",
        created_at: "2024-01-22T16:45:00Z",
        updated_at: "2024-01-24T10:00:00Z",
        notes: "Liburan keluarga ke Bandung"
      },
      {
        id: "TRX005",
        customer_name: "Robert Johnson",
        customer_email: "robert@example.com",
        customer_phone: "08567890123",
        vehicle_id: "11",
        vehicle_info: "BMW X3 - B 2468 EFG",
        service_type: "with_driver",
        rental_start: "2024-01-20",
        rental_duration: 3,
        pickup_time: "13:00",
        pickup_location: "Four Seasons Hotel",
        return_location: "Four Seasons Hotel",
        total_amount: 3900000,
        status: "completed",
        payment_status: "paid",
        payment_method: "credit_card",
        source: "public_portal",
        created_at: "2024-01-18T11:20:00Z",
        updated_at: "2024-01-20T18:00:00Z",
        notes: "Business trip - foreign client"
      },
      {
        id: "TRX006",
        customer_name: "Lisa Permata",
        customer_email: "lisa@example.com",
        customer_phone: "08678901234",
        vehicle_id: "4",
        vehicle_info: "Mitsubishi Xpander - B 3456 JKL",
        service_type: "with_driver",
        rental_start: "2024-01-21",
        rental_duration: 2,
        pickup_time: "07:00",
        pickup_location: "Kantor Rental",
        return_location: "Kantor Rental",
        total_amount: 1100000,
        status: "active",
        payment_status: "paid",
        payment_method: "transfer",
        source: "phone",
        created_at: "2024-01-19T09:30:00Z",
        updated_at: "2024-01-21T07:00:00Z",
        notes: "Wisata keluarga"
      },
      {
        id: "TRX007",
        customer_name: "Ahmad Wijaya",
        customer_email: "ahmad.w@example.com",
        customer_phone: "08789012345",
        vehicle_id: "12",
        vehicle_info: "Toyota Hiace - B 9753 HIJ",
        service_type: "with_driver",
        rental_start: "2024-01-26",
        rental_duration: 1,
        pickup_time: "05:00",
        pickup_location: "Kantor Rental",
        return_location: "Kantor Rental",
        total_amount: 750000,
        status: "confirmed",
        payment_status: "pending",
        payment_method: null,
        source: "whatsapp",
        created_at: "2024-01-23T20:15:00Z",
        updated_at: "2024-01-23T20:15:00Z",
        notes: "Tour grup rombongan"
      },
      {
        id: "TRX008",
        customer_name: "Maria Garcia",
        customer_email: "maria@example.com",
        customer_phone: "08890123456",
        vehicle_id: "9",
        vehicle_info: "Mazda CX-5 - B 6789 YZA",
        service_type: "without_driver",
        rental_start: "2024-01-19",
        rental_duration: 4,
        pickup_time: "11:00",
        pickup_location: "Alamat Customer",
        return_location: "Kantor Rental",
        total_amount: 2400000,
        status: "active",
        payment_status: "paid",
        payment_method: "transfer",
        source: "public_portal",
        created_at: "2024-01-17T13:45:00Z",
        updated_at: "2024-01-19T11:00:00Z",
        notes: "Weekend trip dengan keluarga"
      }
    ]
  },

  getCustomers: () => {
    return [
      {
        id: "CUST001",
        name: "John Doe",
        email: "john@example.com",
        phone: "08123456789",
        address: "Jl. Sudirman No. 123, Jakarta Pusat",
        dateOfBirth: "1985-06-15",
        idNumber: "3201234567890123",
        drivingLicense: "12345678901234",
        emergencyContact: "Jane Doe",
        emergencyPhone: "08987654321",
        customerType: "individual" as const,
        companyName: "",
        status: "active" as const,
        blacklistReason: "",
        blacklistDate: "",
        blacklistedBy: "",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T14:30:00Z",
        totalRentals: 8,
        totalSpent: 6500000,
        lastRental: "2024-01-22T00:00:00Z",
        averageRating: 4.8,
        notes: "Pelanggan VIP - always punctual"
      },
      {
        id: "CUST002",
        name: "Jane Smith",
        email: "jane@example.com", 
        phone: "08234567890",
        address: "Jl. Thamrin No. 456, Jakarta Pusat",
        dateOfBirth: "1990-03-22",
        idNumber: "3201234567890124",
        drivingLicense: "12345678901235",
        emergencyContact: "John Smith",
        emergencyPhone: "08876543210",
        customerType: "individual" as const,
        companyName: "",
        status: "active" as const,
        blacklistReason: "",
        blacklistDate: "",
        blacklistedBy: "",
        createdAt: "2024-01-21T08:15:00Z",
        updatedAt: "2024-01-21T08:15:00Z",
        totalRentals: 3,
        totalSpent: 2800000,
        lastRental: "2024-01-25T00:00:00Z",
        averageRating: 4.5,
        notes: "Registrasi dari portal publik"
      },
      {
        id: "CUST003",
        name: "Budi Santoso",
        email: "budi@example.com",
        phone: "08345678901",
        address: "Jl. Gatot Subroto No. 789, Jakarta Selatan",
        dateOfBirth: "1988-12-10",
        idNumber: "3201234567890125",
        drivingLicense: "12345678901236",
        emergencyContact: "Sari Santoso",
        emergencyPhone: "08765432109",
        customerType: "corporate" as const,
        companyName: "PT. Santoso Jaya",
        status: "active" as const,
        blacklistReason: "",
        blacklistDate: "",
        blacklistedBy: "",
        createdAt: "2024-01-10T12:00:00Z",
        updatedAt: "2024-01-23T16:00:00Z",
        totalRentals: 15,
        totalSpent: 18500000,
        lastRental: "2024-01-23T00:00:00Z",
        averageRating: 4.9,
        notes: "Klien korporat premium"
      },
      {
        id: "CUST004",
        name: "Sari Indahsari",
        email: "sari@example.com",
        phone: "08456789012",
        address: "Jl. Kemang Raya No. 234, Jakarta Selatan",
        dateOfBirth: "1992-08-18",
        idNumber: "3201234567890126",
        drivingLicense: "12345678901237",
        emergencyContact: "Indra Sari",
        emergencyPhone: "08654321098",
        customerType: "individual" as const,
        companyName: "",
        status: "active" as const,
        blacklistReason: "",
        blacklistDate: "",
        blacklistedBy: "",
        createdAt: "2024-01-12T14:20:00Z",
        updatedAt: "2024-01-24T10:00:00Z",
        totalRentals: 6,
        totalSpent: 8200000,
        lastRental: "2024-01-24T00:00:00Z",
        averageRating: 4.7,
        notes: "Frequent traveler"
      },
      {
        id: "CUST005",
        name: "Robert Johnson",
        email: "robert@example.com",
        phone: "08567890123",
        address: "Jl. HR Rasuna Said No. 567, Jakarta Selatan",
        dateOfBirth: "1980-11-05",
        idNumber: "3201234567890127",
        drivingLicense: "12345678901238",
        emergencyContact: "Jennifer Johnson",
        emergencyPhone: "08543210987",
        customerType: "corporate" as const,
        companyName: "Johnson & Associates",
        status: "active" as const,
        blacklistReason: "",
        blacklistDate: "",
        blacklistedBy: "",
        createdAt: "2024-01-08T09:45:00Z",
        updatedAt: "2024-01-20T18:00:00Z",
        totalRentals: 12,
        totalSpent: 25600000,
        lastRental: "2024-01-20T00:00:00Z",
        averageRating: 4.9,
        notes: "International business client"
      },
      {
        id: "CUST006",
        name: "Lisa Permata",
        email: "lisa@example.com",
        phone: "08678901234",
        address: "Jl. Senopati No. 890, Jakarta Selatan",
        dateOfBirth: "1987-04-12",
        idNumber: "3201234567890128",
        drivingLicense: "12345678901239",
        emergencyContact: "Maya Permata",
        emergencyPhone: "08432109876",
        customerType: "individual" as const,
        companyName: "",
        status: "active" as const,
        blacklistReason: "",
        blacklistDate: "",
        blacklistedBy: "",
        createdAt: "2024-01-16T11:30:00Z",
        updatedAt: "2024-01-21T07:00:00Z",
        totalRentals: 4,
        totalSpent: 3200000,
        lastRental: "2024-01-21T00:00:00Z",
        averageRating: 4.6,
        notes: "Family trips regular"
      },
      {
        id: "CUST007",
        name: "Ahmad Wijaya",
        email: "ahmad.w@example.com",
        phone: "08789012345",
        address: "Jl. Blok M No. 123, Jakarta Selatan",
        dateOfBirth: "1983-09-28",
        idNumber: "3201234567890129",
        drivingLicense: "12345678901240",
        emergencyContact: "Fitri Wijaya",
        emergencyPhone: "08321098765",
        customerType: "corporate" as const,
        companyName: "PT. Wijaya Tour",
        status: "active" as const,
        blacklistReason: "",
        blacklistDate: "",
        blacklistedBy: "",
        createdAt: "2024-01-05T16:15:00Z",
        updatedAt: "2024-01-23T20:15:00Z",
        totalRentals: 22,
        totalSpent: 14800000,
        lastRental: "2024-01-26T00:00:00Z",
        averageRating: 4.8,
        notes: "Travel agency partner"
      },
      {
        id: "CUST008",
        name: "Maria Garcia",
        email: "maria@example.com",
        phone: "08890123456",
        address: "Jl. Pondok Indah No. 456, Jakarta Selatan",
        dateOfBirth: "1991-02-14",
        idNumber: "3201234567890130",
        drivingLicense: "12345678901241",
        emergencyContact: "Carlos Garcia",
        emergencyPhone: "08210987654",
        customerType: "individual" as const,
        companyName: "",
        status: "active" as const,
        blacklistReason: "",
        blacklistDate: "",
        blacklistedBy: "",
        createdAt: "2024-01-14T13:45:00Z",
        updatedAt: "2024-01-19T11:00:00Z",
        totalRentals: 5,
        totalSpent: 4600000,
        lastRental: "2024-01-19T00:00:00Z",
        averageRating: 4.4,
        notes: "Expat customer"
      },
      {
        id: "CUST009",
        name: "Dedi Kurniawan",
        email: "dedi@example.com",
        phone: "08901234567",
        address: "Jl. Kuningan No. 789, Jakarta Selatan",
        dateOfBirth: "1986-07-03",
        idNumber: "3201234567890131",
        drivingLicense: "12345678901242",
        emergencyContact: "Rina Kurniawan",
        emergencyPhone: "08109876543",
        customerType: "individual" as const,
        companyName: "",
        status: "inactive" as const,
        blacklistReason: "",
        blacklistDate: "",
        blacklistedBy: "",
        createdAt: "2023-12-20T10:30:00Z",
        updatedAt: "2024-01-02T14:20:00Z",
        totalRentals: 2,
        totalSpent: 1200000,
        lastRental: "2024-01-02T00:00:00Z",
        averageRating: 4.0,
        notes: "Inactive since early January"
      },
      {
        id: "CUST010",
        name: "Fatimah Zahra",
        email: "fatimah@example.com",
        phone: "08012345678",
        address: "Jl. Menteng No. 321, Jakarta Pusat",
        dateOfBirth: "1989-12-25",
        idNumber: "3201234567890132",
        drivingLicense: "12345678901243",
        emergencyContact: "Hassan Zahra",
        emergencyPhone: "08998765432",
        customerType: "individual" as const,
        companyName: "",
        status: "blacklisted" as const,
        blacklistReason: "Kerusakan kendaraan berulang",
        blacklistDate: "2024-01-18T00:00:00Z",
        blacklistedBy: "Admin User",
        createdAt: "2023-11-15T08:00:00Z",
        updatedAt: "2024-01-18T15:30:00Z",
        totalRentals: 7,
        totalSpent: 3800000,
        lastRental: "2024-01-15T00:00:00Z",
        averageRating: 3.2,
        notes: "Multiple vehicle damage incidents"
      }
    ]
  },

  getDrivers: () => {
    return [
      {
        id: "DRV001",
        name: "Ahmad Susanto",
        phone: "08111222333",
        email: "ahmad.susanto@example.com",
        address: "Jl. Kebon Jeruk No. 45, Jakarta Barat",
        dateOfBirth: "1985-03-15",
        idNumber: "3175051503850001",
        drivingLicense: "12345678901234",
        licenseExpiryDate: "2025-12-31",
        emergencyContact: "Siti Susanto",
        emergencyPhone: "08199888777",
        status: "available" as const,
        currentVehicleId: "",
        currentVehicleName: "",
        currentBookingId: "",
        joinDate: "2024-01-01T00:00:00Z",
        lastActive: "2024-01-22T10:00:00Z",
        rating: 4.9,
        totalTrips: 256,
        totalEarnings: 25600000,
        totalExpenses: 4800000,
        notes: "Senior driver dengan rekam jejak excellent",
        location: {
          lat: -6.2088,
          lng: 106.8456,
          address: "Monas, Jakarta Pusat",
          lastUpdated: "2024-01-22T10:00:00Z"
        }
      },
      {
        id: "DRV002", 
        name: "Budi Hartono",
        phone: "08222333444",
        email: "budi.hartono@example.com",
        address: "Jl. Cipinang Raya No. 78, Jakarta Timur",
        dateOfBirth: "1990-07-22",
        idNumber: "3175052207900002",
        drivingLicense: "12345678901235",
        licenseExpiryDate: "2025-06-30",
        emergencyContact: "Ani Hartono",
        emergencyPhone: "08188777666",
        status: "on_duty" as const,
        currentVehicleId: "2",
        currentVehicleName: "Honda Civic B5678DEF",
        currentBookingId: "TRX002",
        joinDate: "2024-01-01T00:00:00Z",
        lastActive: "2024-01-22T09:30:00Z",
        rating: 4.7,
        totalTrips: 198,
        totalEarnings: 19800000,
        totalExpenses: 3500000,
        notes: "Reliable untuk perjalanan jarak jauh",
        location: {
          lat: -6.1751,
          lng: 106.8650,
          address: "Kemayoran, Jakarta Pusat",
          lastUpdated: "2024-01-22T09:30:00Z"
        }
      },
      {
        id: "DRV003",
        name: "Citra Pengemudi",
        phone: "08333444555",
        email: "citra.driver@example.com",
        address: "Jl. Menteng Dalam No. 12, Jakarta Pusat",
        dateOfBirth: "1988-11-10",
        idNumber: "3175055011880003",
        drivingLicense: "12345678901236",
        licenseExpiryDate: "2026-02-15",
        emergencyContact: "Dewi Pengemudi",
        emergencyPhone: "08177666555",
        status: "off_duty" as const,
        currentVehicleId: "",
        currentVehicleName: "",
        currentBookingId: "",
        joinDate: "2024-01-05T00:00:00Z",
        lastActive: "2024-01-21T18:00:00Z",
        rating: 4.8,
        totalTrips: 234,
        totalEarnings: 23400000,
        totalExpenses: 4200000,
        notes: "Female driver profesional dengan rating tinggi"
      },
      {
        id: "DRV004",
        name: "Dedi Kurniawan",
        phone: "08444555666",
        email: "dedi.k@example.com",
        address: "Jl. Cempaka Putih No. 56, Jakarta Pusat",
        dateOfBirth: "1987-05-08",
        idNumber: "3175050805870004",
        drivingLicense: "12345678901244",
        licenseExpiryDate: "2025-08-20",
        emergencyContact: "Rina Kurniawan",
        emergencyPhone: "08166555444",
        status: "on_duty" as const,
        currentVehicleId: "8",
        currentVehicleName: "Toyota Alphard B2345VWX",
        currentBookingId: "TRX003",
        joinDate: "2024-01-03T00:00:00Z",
        lastActive: "2024-01-23T08:00:00Z",
        rating: 4.6,
        totalTrips: 176,
        totalEarnings: 17600000,
        totalExpenses: 3100000,
        notes: "Spesialis VIP transport dan luxury vehicles"
      },
      {
        id: "DRV005",
        name: "Eko Prasetyo",
        phone: "08555666777",
        email: "eko.p@example.com",
        address: "Jl. Tanah Abang No. 89, Jakarta Pusat",
        dateOfBirth: "1992-01-20",
        idNumber: "3175052001920005",
        drivingLicense: "12345678901245",
        licenseExpiryDate: "2026-01-15",
        emergencyContact: "Sri Prasetyo",
        emergencyPhone: "08155444333",
        status: "available" as const,
        currentVehicleId: "",
        currentVehicleName: "",
        currentBookingId: "",
        joinDate: "2024-01-08T00:00:00Z",
        lastActive: "2024-01-22T14:45:00Z",
        rating: 4.5,
        totalTrips: 145,
        totalEarnings: 14500000,
        totalExpenses: 2800000,
        notes: "Young energetic driver, good with technology"
      },
      {
        id: "DRV006",
        name: "Farid Rahman",
        phone: "08666777888",
        email: "farid.r@example.com",
        address: "Jl. Sawah Besar No. 123, Jakarta Pusat",
        dateOfBirth: "1984-09-14",
        idNumber: "3175051409840006",
        drivingLicense: "12345678901246",
        licenseExpiryDate: "2025-11-30",
        emergencyContact: "Zahra Rahman",
        emergencyPhone: "08144333222",
        status: "on_duty" as const,
        currentVehicleId: "4",
        currentVehicleName: "Mitsubishi Xpander B3456JKL",
        currentBookingId: "TRX006",
        joinDate: "2024-01-02T00:00:00Z",
        lastActive: "2024-01-21T07:00:00Z",
        rating: 4.8,
        totalTrips: 189,
        totalEarnings: 18900000,
        totalExpenses: 3400000,
        notes: "Experienced family trip specialist"
      },
      {
        id: "DRV007",
        name: "Guntur Wibowo",
        phone: "08777888999",
        email: "guntur.w@example.com",
        address: "Jl. Gambir No. 67, Jakarta Pusat",
        dateOfBirth: "1989-12-03",
        idNumber: "3175050312890007",
        drivingLicense: "12345678901247",
        licenseExpiryDate: "2026-05-10",
        emergencyContact: "Indira Wibowo",
        emergencyPhone: "08133222111",
        status: "maintenance" as const,
        currentVehicleId: "",
        currentVehicleName: "",
        currentBookingId: "",
        joinDate: "2024-01-06T00:00:00Z",
        lastActive: "2024-01-20T16:30:00Z",
        rating: 4.4,
        totalTrips: 134,
        totalEarnings: 13400000,
        totalExpenses: 2600000,
        notes: "Currently on medical leave"
      },
      {
        id: "DRV008",
        name: "Hendra Setiawan",
        phone: "08888999000",
        email: "hendra.s@example.com",
        address: "Jl. Senen No. 45, Jakarta Pusat",
        dateOfBirth: "1986-06-18",
        idNumber: "3175051806860008",
        drivingLicense: "12345678901248",
        licenseExpiryDate: "2025-09-25",
        emergencyContact: "Maya Setiawan",
        emergencyPhone: "08122111000",
        status: "available" as const,
        currentVehicleId: "",
        currentVehicleName: "",
        currentBookingId: "",
        joinDate: "2024-01-04T00:00:00Z",
        lastActive: "2024-01-22T11:15:00Z",
        rating: 4.7,
        totalTrips: 167,
        totalEarnings: 16700000,
        totalExpenses: 3000000,
        notes: "Multi-language speaker (English, Mandarin)"
      },
      {
        id: "DRV009",
        name: "Ivan Pratama",
        phone: "08999000111",
        email: "ivan.p@example.com",
        address: "Jl. Pasar Baru No. 78, Jakarta Pusat",
        dateOfBirth: "1991-04-25",
        idNumber: "3175052504910009",
        drivingLicense: "12345678901249",
        licenseExpiryDate: "2026-03-12",
        emergencyContact: "Lina Pratama",
        emergencyPhone: "08111000999",
        status: "on_duty" as const,
        currentVehicleId: "9",
        currentVehicleName: "Mazda CX-5 B6789YZA",
        currentBookingId: "TRX008",
        joinDate: "2024-01-07T00:00:00Z",
        lastActive: "2024-01-19T11:00:00Z",
        rating: 4.6,
        totalTrips: 156,
        totalEarnings: 15600000,
        totalExpenses: 2900000,
        notes: "Tech-savvy driver dengan GPS expertise"
      },
      {
        id: "DRV010",
        name: "Joko Santoso",
        phone: "08000111222",
        email: "joko.s@example.com",
        address: "Jl. Veteran No. 91, Jakarta Pusat",
        dateOfBirth: "1983-08-30",
        idNumber: "3175053008830010",
        drivingLicense: "12345678901250",
        licenseExpiryDate: "2025-07-18",
        emergencyContact: "Ratna Santoso",
        emergencyPhone: "08100999888",
        status: "available" as const,
        currentVehicleId: "",
        currentVehicleName: "",
        currentBookingId: "",
        joinDate: "2024-01-01T00:00:00Z",
        lastActive: "2024-01-22T13:20:00Z",
        rating: 4.5,
        totalTrips: 198,
        totalEarnings: 19800000,
        totalExpenses: 3700000,
        notes: "Senior driver dengan 15 tahun pengalaman"
      },
      {
        id: "DRV011",
        name: "Kurnia Sari",
        phone: "08001112233",
        email: "kurnia.s@example.com",
        address: "Jl. Harmoni No. 34, Jakarta Pusat",
        dateOfBirth: "1990-10-12",
        idNumber: "3175055012900011",
        drivingLicense: "12345678901251",
        licenseExpiryDate: "2026-04-22",
        emergencyContact: "Budi Sari",
        emergencyPhone: "08099888777",
        status: "off_duty" as const,
        currentVehicleId: "",
        currentVehicleName: "",
        currentBookingId: "",
        joinDate: "2024-01-09T00:00:00Z",
        lastActive: "2024-01-21T19:45:00Z",
        rating: 4.9,
        totalTrips: 143,
        totalEarnings: 14300000,
        totalExpenses: 2500000,
        notes: "Female driver untuk female customers"
      },
      {
        id: "DRV012",
        name: "Lucky Handoko",
        phone: "08002223344",
        email: "lucky.h@example.com",
        address: "Jl. Juanda No. 56, Jakarta Pusat",
        dateOfBirth: "1988-02-28",
        idNumber: "3175052802880012",
        drivingLicense: "12345678901252",
        licenseExpiryDate: "2025-12-15",
        emergencyContact: "Jenny Handoko",
        emergencyPhone: "08088777666",
        status: "on_duty" as const,
        currentVehicleId: "12",
        currentVehicleName: "Toyota Hiace B9753HIJ",
        currentBookingId: "TRX007",
        joinDate: "2024-01-05T00:00:00Z",
        lastActive: "2024-01-26T05:00:00Z",
        rating: 4.7,
        totalTrips: 178,
        totalEarnings: 17800000,
        totalExpenses: 3200000,
        notes: "Group transportation specialist"
      }
    ]
  },

  // New: Public booking creation
  createPublicBooking: (bookingData: any) => {
    console.log('Mock API: Creating public booking', bookingData)
    
    // Simulate successful booking creation
    return {
      success: true,
      bookingId: bookingData.bookingId,
      message: 'Booking created successfully',
      estimatedResponse: '15-30 menit'
    }
  },

  getPublicBookings: () => {
    return [
      {
        bookingId: "BK1737570234567",
        vehicleId: "1",
        customerData: {
          fullName: "Maria Garcia",
          email: "maria@example.com",
          phone: "08345678901",
          idNumber: "3201234567890125",
          address: "Jl. Gatot Subroto No. 789, Jakarta"
        },
        bookingDetails: {
          serviceType: "without_driver",
          startDate: "2024-01-25",
          duration: 2,
          pickupTime: "10:00",
          location: "Jakarta Selatan"
        },
        locationDetails: {
          pickupLocation: "Kantor Rental",
          returnLocation: "Kantor Rental",
          pickupType: "office",
          returnType: "office"
        },
        pricing: {
          baseRate: 300000,
          subtotal: 600000,
          deliveryFee: 0,
          returnFee: 0,
          driverFee: 0,
          insuranceFee: 30000,
          serviceFee: 25000,
          totalBeforeTax: 655000,
          tax: 72050,
          total: 727050
        },
        status: "pending_verification",
        source: "public_portal",
        createdAt: "2024-01-23T14:30:00Z"
      },
      {
        bookingId: "BK1737570234568",
        vehicleId: "5",
        customerData: {
          fullName: "David Wilson",
          email: "david@example.com",
          phone: "08456789012",
          idNumber: "3201234567890126",
          address: "Jl. Kuningan No. 456, Jakarta"
        },
        bookingDetails: {
          serviceType: "with_driver",
          startDate: "2024-01-28",
          duration: 3,
          pickupTime: "08:00",
          location: "Jakarta Pusat"
        },
        locationDetails: {
          pickupLocation: "Hotel Grand Hyatt",
          returnLocation: "Bandara Soekarno-Hatta",
          pickupType: "customer_address",
          returnType: "airport"
        },
        pricing: {
          baseRate: 700000,
          subtotal: 2100000,
          deliveryFee: 50000,
          returnFee: 0,
          driverFee: 450000,
          insuranceFee: 105000,
          serviceFee: 85000,
          totalBeforeTax: 2790000,
          tax: 307900,
          total: 3097900
        },
        status: "pending_verification",
        source: "public_portal",
        createdAt: "2024-01-24T09:20:00Z"
      }
    ]
  },

  // Financial data
  getFinancialData: () => {
    return {
      totalRevenue: 125000000,
      monthlyRevenue: 25500000,
      totalExpenses: 32000000,
      netProfit: 93000000,
      revenueByMonth: [
        { month: 'Jan', revenue: 25500000, profit: 17300000, expenses: 8200000 },
        { month: 'Dec', revenue: 22200000, profit: 14400000, expenses: 7800000 },
        { month: 'Nov', revenue: 20800000, profit: 13600000, expenses: 7200000 },
        { month: 'Oct', revenue: 19500000, profit: 12600000, expenses: 6900000 },
        { month: 'Sep', revenue: 18900000, profit: 12200000, expenses: 6700000 },
        { month: 'Aug', revenue: 18100000, profit: 11800000, expenses: 6300000 }
      ],
      revenueByVehicleType: [
        { type: 'Luxury', revenue: 45000000, percentage: 36 },
        { type: 'Premium', revenue: 38000000, percentage: 30.4 },
        { type: 'MPV', revenue: 28000000, percentage: 22.4 },
        { type: 'SUV', revenue: 14000000, percentage: 11.2 }
      ],
      paymentMethods: [
        { method: 'Transfer Bank', amount: 65000000, percentage: 52 },
        { method: 'Cash', amount: 35000000, percentage: 28 },
        { method: 'Credit Card', amount: 20000000, percentage: 16 },
        { method: 'E-Wallet', amount: 5000000, percentage: 4 }
      ]
    }
  },

  // Communication data
  getCommunicationData: () => {
    return {
      whatsappSettings: {
        enabled: true,
        phoneNumber: "+628123456789",
        apiKey: "your-whatsapp-api-key",
        templates: [
          {
            id: "booking_confirmation",
            name: "Konfirmasi Booking",
            message: "Terima kasih telah melakukan booking. Booking ID: {{bookingId}}"
          },
          {
            id: "payment_reminder", 
            name: "Pengingat Pembayaran",
            message: "Mohon segera lakukan pembayaran untuk booking {{bookingId}}"
          },
          {
            id: "trip_reminder",
            name: "Pengingat Perjalanan",
            message: "Besok adalah hari keberangkatan Anda. Booking ID: {{bookingId}}"
          }
        ]
      },
      messageHistory: [
        {
          id: "MSG001",
          customer: "John Doe",
          phone: "08123456789",
          message: "Booking confirmation sent - TRX001",
          timestamp: "2024-01-22T10:30:00Z",
          status: "delivered"
        },
        {
          id: "MSG002",
          customer: "Jane Smith",
          phone: "08234567890",
          message: "Payment reminder sent - TRX002",
          timestamp: "2024-01-23T09:15:00Z",
          status: "delivered"
        },
        {
          id: "MSG003",
          customer: "Budi Santoso",
          phone: "08345678901",
          message: "Trip reminder sent - TRX003",
          timestamp: "2024-01-22T20:00:00Z",
          status: "delivered"
        }
      ]
    }
  },

  // Support data
  getSupportData: () => {
    return {
      tickets: [
        {
          id: "TICKET001",
          subject: "Masalah Pembayaran Transfer",
          customer: "John Doe",
          status: "open",
          priority: "medium",
          created_at: "2024-01-22T10:00:00Z",
          description: "Tidak bisa melakukan pembayaran via transfer bank BCA"
        },
        {
          id: "TICKET002",
          subject: "Pertanyaan Syarat Rental",
          customer: "Jane Smith", 
          status: "resolved",
          priority: "low",
          created_at: "2024-01-21T14:30:00Z",
          description: "Ingin mengetahui syarat rental kendaraan untuk wisatawan asing"
        },
        {
          id: "TICKET003",
          subject: "Komplain Kondisi Kendaraan",
          customer: "Robert Johnson",
          status: "in_progress",
          priority: "high",
          created_at: "2024-01-23T08:45:00Z",
          description: "AC tidak dingin pada kendaraan BMW X3"
        },
        {
          id: "TICKET004",
          subject: "Request Perubahan Jadwal",
          customer: "Sari Indahsari",
          status: "open",
          priority: "medium",
          created_at: "2024-01-23T16:20:00Z",
          description: "Ingin mengubah tanggal rental dari 24 Jan ke 26 Jan"
        },
        {
          id: "TICKET005",
          subject: "Kehilangan Barang di Kendaraan",
          customer: "Lisa Permata",
          status: "in_progress",
          priority: "high",
          created_at: "2024-01-22T19:30:00Z",
          description: "Tertinggal tas berisi dokumen penting di Xpander"
        }
      ],
      faq: [
        {
          id: "FAQ001",
          question: "Bagaimana cara melakukan booking?",
          answer: "Anda dapat melakukan booking melalui website, WhatsApp di +628123456789, atau datang langsung ke kantor kami."
        },
        {
          id: "FAQ002",
          question: "Apa saja syarat rental kendaraan?",
          answer: "Syarat: KTP asli, SIM A yang masih berlaku, deposit sesuai kategori kendaraan, dan mengisi formulir kesepakatan sewa."
        },
        {
          id: "FAQ003",
          question: "Berapa deposit yang harus dibayar?",
          answer: "Deposit bervariasi: Ekonomi Rp 2jt, Premium Rp 5jt, Luxury Rp 10jt. Deposit dikembalikan setelah kendaraan diperiksa."
        },
        {
          id: "FAQ004",
          question: "Apakah bisa rental tanpa sopir?",
          answer: "Ya, kami menyediakan layanan lepas kunci dengan syarat tambahan berupa jaminan dan verifikasi dokumen."
        },
        {
          id: "FAQ005",
          question: "Bagaimana jika terjadi kecelakaan?",
          answer: "Segera hubungi kami dan polisi. Semua kendaraan sudah diasuransikan comprehensive untuk keamanan bersama."
        },
        {
          id: "FAQ006",
          question: "Apakah ada layanan antar-jemput?",
          answer: "Ya, kami menyediakan layanan antar-jemput dengan biaya tambahan sesuai jarak dan lokasi."
        }
      ]
    }
  },

  // Users
  getUsers: () => {
    return [
      {
        id: "1",
        name: "Admin Utama",
        email: "admin@rentalcar.com",
        role: "admin",
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        lastLogin: "2024-01-23T08:30:00Z",
        permissions: ["dashboard", "vehicle_management", "transaction_management", "user_management", "financial_reports"]
      },
      {
        id: "2", 
        name: "Manager Operasional",
        email: "manager@rentalcar.com",
        role: "manager",
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        lastLogin: "2024-01-22T15:45:00Z",
        permissions: ["dashboard", "vehicle_management", "reports_view", "customer_management", "driver_management"]
      },
      {
        id: "3",
        name: "Pemilik Bisnis", 
        email: "owner@rentalcar.com",
        role: "owner",
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        lastLogin: "2024-01-23T09:15:00Z",
        permissions: ["all_access"]
      },
      {
        id: "4",
        name: "Operator CS",
        email: "cs@rentalcar.com",
        role: "operator",
        isActive: true,
        createdAt: "2024-01-02T00:00:00Z",
        lastLogin: "2024-01-23T10:20:00Z",
        permissions: ["dashboard", "transaction_management", "customer_management", "communication_settings"]
      },
      {
        id: "5",
        name: "Teknisi Maintenance",
        email: "teknisi@rentalcar.com",
        role: "technician",
        isActive: true,
        createdAt: "2024-01-03T00:00:00Z",
        lastLogin: "2024-01-22T14:30:00Z",
        permissions: ["dashboard", "vehicle_management", "condition_management"]
      },
      {
        id: "6",
        name: "Akuntan Keuangan",
        email: "finance@rentalcar.com",
        role: "finance",
        isActive: true,
        createdAt: "2024-01-02T00:00:00Z",
        lastLogin: "2024-01-23T11:45:00Z",
        permissions: ["dashboard", "financial_reports", "transaction_management", "reports_view"]
      }
    ]
  },

  // Blacklist data with more comprehensive entries
  getBlacklist: () => {
    return [
      {
        id: "BL001",
        customerId: "CUST010",
        customerName: "Fatimah Zahra",
        reason: "Kerusakan kendaraan berulang",
        description: "Telah menyebabkan kerusakan pada 3 kendaraan dalam 6 bulan terakhir. Kerusakan meliputi interior robek, eksterior lecet, dan mesin overheating.",
        blacklistedBy: "Admin Utama",
        blacklistDate: "2024-01-18T15:30:00Z",
        severity: "high" as const,
        canAppeal: false,
        appealDeadline: undefined
      },
      {
        id: "BL002", 
        customerId: "CUST011",
        customerName: "Susi Telat Bayar",
        reason: "Keterlambatan pembayaran berulang",
        description: "Pembayaran terlambat lebih dari 7 hari sebanyak 5 kali dalam 3 bulan terakhir. Total tunggakan pernah mencapai Rp 8.5 juta.",
        blacklistedBy: "Manager Operasional",
        blacklistDate: "2024-01-15T14:30:00Z",
        severity: "medium" as const,
        canAppeal: true,
        appealDeadline: "2024-02-15T00:00:00Z"
      },
      {
        id: "BL003",
        customerId: "CUST012",
        customerName: "Andi Trouble",
        reason: "Pelanggaran kontrak dan tidak bertanggung jawab",
        description: "Menggunakan kendaraan untuk racing ilegal, memodifikasi kendaraan tanpa izin, dan menolak bertanggung jawab atas kerusakan.",
        blacklistedBy: "Pemilik Bisnis",
        blacklistDate: "2024-01-10T16:45:00Z",
        severity: "high" as const,
        canAppeal: false,
        appealDeadline: undefined
      }
    ]
  },

  // Reports data with much more comprehensive data
  getExpensesReport: () => {
    return [
      {
        id: "EXP001",
        date: "2024-01-22",
        category: "fuel",
        description: "Pengisian BBM kendaraan - Toyota Avanza",
        amount: 250000,
        vehicleId: "1",
        status: "approved"
      },
      {
        id: "EXP002", 
        date: "2024-01-21",
        category: "maintenance",
        description: "Service rutin kendaraan - Honda Civic",
        amount: 750000,
        vehicleId: "2", 
        status: "approved"
      },
      {
        id: "EXP003",
        date: "2024-01-20",
        category: "insurance",
        description: "Pembayaran asuransi comprehensive - BMW X3",
        amount: 2400000,
        vehicleId: "11",
        status: "approved"
      },
      {
        id: "EXP004",
        date: "2024-01-19",
        category: "maintenance",
        description: "Ganti ban kendaraan - Toyota Fortuner",
        amount: 1600000,
        vehicleId: "5",
        status: "approved"
      },
      {
        id: "EXP005",
        date: "2024-01-18",
        category: "fuel",
        description: "Pengisian solar - Toyota Hiace",
        amount: 320000,
        vehicleId: "12",
        status: "approved"
      },
      {
        id: "EXP006",
        date: "2024-01-17",
        category: "repair",
        description: "Perbaikan AC - Honda HR-V",
        amount: 850000,
        vehicleId: "6",
        status: "pending"
      },
      {
        id: "EXP007",
        date: "2024-01-16",
        category: "cleaning",
        description: "Car wash dan detailing - Toyota Alphard",
        amount: 200000,
        vehicleId: "8",
        status: "approved"
      },
      {
        id: "EXP008",
        date: "2024-01-15",
        category: "tax",
        description: "Pajak kendaraan tahunan - Mazda CX-5",
        amount: 1200000,
        vehicleId: "9",
        status: "approved"
      }
    ]
  },

  getOrderSourcesReport: () => {
    return [
      {
        source: "website",
        orders: 95,
        revenue: 62000000,
        percentage: 49.6
      },
      {
        source: "whatsapp",
        orders: 78,
        revenue: 35000000,
        percentage: 28
      },
      {
        source: "phone",
        orders: 45,
        revenue: 18000000,
        percentage: 14.4
      },
      {
        source: "walk_in",
        orders: 30,
        revenue: 10000000,
        percentage: 8
      }
    ]
  },

  getCustomerAnalysisReport: () => {
    return {
      totalCustomers: 456,
      newCustomers: 67,
      returningCustomers: 389,
      customerSegments: [
        {
          segment: "VIP",
          count: 35,
          revenue: 45000000,
          percentage: 7.7
        },
        {
          segment: "Premium", 
          count: 89,
          revenue: 38000000,
          percentage: 19.5
        },
        {
          segment: "Regular",
          count: 245,
          revenue: 32000000,
          percentage: 53.7
        },
        {
          segment: "New",
          count: 87,
          revenue: 10000000,
          percentage: 19.1
        }
      ]
    }
  },

  getOutstandingRentalsReport: () => {
    return [
      {
        id: "RENT001",
        customerName: "Ahmad Pending",
        vehicleName: "Toyota Avanza 2022",
        startDate: "2024-01-18",
        endDate: "2024-01-20",
        amount: 900000,
        status: "overdue",
        daysOverdue: 3
      },
      {
        id: "RENT002",
        customerName: "Sari Indahsari", 
        vehicleName: "Toyota Fortuner 2023",
        startDate: "2024-01-24",
        endDate: "2024-01-29",
        amount: 3500000,
        status: "active",
        daysOverdue: 0
      },
      {
        id: "RENT003",
        customerName: "Robert Johnson",
        vehicleName: "BMW X3 2023",
        startDate: "2024-01-20",
        endDate: "2024-01-23",
        amount: 3900000,
        status: "completed",
        daysOverdue: 0
      },
      {
        id: "RENT004",
        customerName: "Maria Garcia",
        vehicleName: "Mazda CX-5 2022",
        startDate: "2024-01-19",
        endDate: "2024-01-23",
        amount: 2400000,
        status: "active",
        daysOverdue: 0
      },
      {
        id: "RENT005",
        customerName: "Budi Terlambat",
        vehicleName: "Honda Civic 2021",
        startDate: "2024-01-15",
        endDate: "2024-01-17",
        amount: 1350000,
        status: "overdue",
        daysOverdue: 6
      }
    ]
  },

  getDriverPerformanceReport: () => {
    return [
      {
        id: "DRV001",
        name: "Ahmad Susanto",
        totalTrips: 256,
        revenue: 25600000,
        rating: 4.9,
        completionRate: 98.2,
        customerSatisfaction: 96.5,
        efficiency: 92.7
      },
      {
        id: "DRV003",
        name: "Citra Pengemudi",
        totalTrips: 234,
        revenue: 23400000,
        rating: 4.8,
        completionRate: 96.5,
        customerSatisfaction: 94.8,
        efficiency: 90.5
      },
      {
        id: "DRV002",
        name: "Budi Hartono",
        totalTrips: 198,
        revenue: 19800000, 
        rating: 4.7,
        completionRate: 94.8,
        customerSatisfaction: 92.2,
        efficiency: 88.3
      },
      {
        id: "DRV010",
        name: "Joko Santoso",
        totalTrips: 198,
        revenue: 19800000,
        rating: 4.5,
        completionRate: 93.1,
        customerSatisfaction: 89.8,
        efficiency: 86.2
      },
      {
        id: "DRV006",
        name: "Farid Rahman",
        totalTrips: 189,
        revenue: 18900000,
        rating: 4.8,
        completionRate: 95.8,
        customerSatisfaction: 93.5,
        efficiency: 89.7
      },
      {
        id: "DRV012",
        name: "Lucky Handoko",
        totalTrips: 178,
        revenue: 17800000,
        rating: 4.7,
        completionRate: 94.4,
        customerSatisfaction: 91.8,
        efficiency: 88.9
      },
      {
        id: "DRV004",
        name: "Dedi Kurniawan",
        totalTrips: 176,
        revenue: 17600000,
        rating: 4.6,
        completionRate: 92.1,
        customerSatisfaction: 89.5,
        efficiency: 85.2
      },
      {
        id: "DRV008",
        name: "Hendra Setiawan",
        totalTrips: 167,
        revenue: 16700000,
        rating: 4.7,
        completionRate: 94.0,
        customerSatisfaction: 90.2,
        efficiency: 87.8
      },
      {
        id: "DRV009",
        name: "Ivan Pratama",
        totalTrips: 156,
        revenue: 15600000,
        rating: 4.6,
        completionRate: 92.9,
        customerSatisfaction: 88.7,
        efficiency: 86.4
      },
      {
        id: "DRV005",
        name: "Eko Prasetyo",
        totalTrips: 145,
        revenue: 14500000,
        rating: 4.5,
        completionRate: 91.7,
        customerSatisfaction: 87.5,
        efficiency: 84.8
      },
      {
        id: "DRV011",
        name: "Kurnia Sari",
        totalTrips: 143,
        revenue: 14300000,
        rating: 4.9,
        completionRate: 97.2,
        customerSatisfaction: 95.8,
        efficiency: 91.3
      },
      {
        id: "DRV007",
        name: "Guntur Wibowo",
        totalTrips: 134,
        revenue: 13400000,
        rating: 4.4,
        completionRate: 90.3,
        customerSatisfaction: 86.1,
        efficiency: 83.7
      }
    ]
  },

  // Communication Settings data
  getCommunicationSenders: () => {
    return [
      {
        id: "SEND001",
        name: "Main WhatsApp Business",
        phoneNumber: "+6281234567890",
        apiKey: "wa_business_key_12345",
        status: "active" as const,
        dailyLimit: 1000,
        usedToday: 156,
        isDefault: true,
        createdAt: "2024-01-01T00:00:00Z"
      },
      {
        id: "SEND002",
        name: "Customer Service WA",
        phoneNumber: "+6281234567891",
        apiKey: "wa_cs_key_67890",
        status: "active" as const,
        dailyLimit: 500,
        usedToday: 78,
        isDefault: false,
        createdAt: "2024-01-02T00:00:00Z"
      },
      {
        id: "SEND003",
        name: "Backup WhatsApp",
        phoneNumber: "+6281234567892",
        apiKey: "wa_backup_key_54321",
        status: "inactive" as const,
        dailyLimit: 300,
        usedToday: 0,
        isDefault: false,
        createdAt: "2024-01-03T00:00:00Z"
      }
    ]
  },

  getCommunicationTemplates: () => {
    return [
      {
        id: "TEMP001",
        name: "Booking Confirmation",
        category: "confirmation" as const,
        subject: "Konfirmasi Booking Rental",
        content: "Halo {{customerName}},\n\nBooking Anda telah dikonfirmasi:\n- Kendaraan: {{vehicleName}}\n- Tanggal: {{rentalDate}} - {{returnDate}}\n- Total: {{totalAmount}}\n- Pickup: {{pickupLocation}}\n\nTerima kasih telah mempercayai {{companyName}}!\n\nInfo: {{phone}}",
        variables: ["customerName", "vehicleName", "rentalDate", "returnDate", "totalAmount", "pickupLocation", "companyName", "phone"],
        isActive: true,
        senderId: "SEND001",
        createdAt: "2024-01-01T00:00:00Z"
      },
      {
        id: "TEMP002",
        name: "Payment Reminder",
        category: "payment" as const,
        subject: "Pengingat Pembayaran",
        content: "Halo {{customerName}},\n\nIni adalah pengingat pembayaran untuk rental {{vehicleName}}.\n\nSisa pembayaran: {{remainingAmount}}\nJatuh tempo: {{dueDate}}\nBooking ID: {{bookingId}}\n\nSilakan lakukan pembayaran melalui:\n- Transfer: BCA 1234567890\n- WhatsApp: {{phone}}\n\nTerima kasih!",
        variables: ["customerName", "vehicleName", "remainingAmount", "dueDate", "bookingId", "phone"],
        isActive: true,
        senderId: "SEND001", 
        createdAt: "2024-01-01T00:00:00Z"
      },
      {
        id: "TEMP003",
        name: "Trip Reminder",
        category: "reminder" as const,
        subject: "Pengingat Perjalanan",
        content: "Halo {{customerName}},\n\nBesok adalah hari keberangkatan Anda:\n- Kendaraan: {{vehicleName}}\n- Tanggal: {{rentalDate}}\n- Waktu pickup: {{pickupTime}}\n- Lokasi: {{pickupLocation}}\n- Sopir: {{driverName}}\n\nPastikan dokumen lengkap ya!\n\nInfo: {{phone}}",
        variables: ["customerName", "vehicleName", "rentalDate", "pickupTime", "pickupLocation", "driverName", "phone"],
        isActive: true,
        senderId: "SEND001",
        createdAt: "2024-01-05T00:00:00Z"
      },
      {
        id: "TEMP004",
        name: "Vehicle Return Reminder",
        category: "reminder" as const,
        subject: "Pengingat Pengembalian Kendaraan",
        content: "Halo {{customerName}},\n\nMasa rental akan berakhir:\n- Kendaraan: {{vehicleName}}\n- Tanggal return: {{returnDate}}\n- Waktu: {{returnTime}}\n- Lokasi: {{returnLocation}}\n\nMohon pastikan:\n- Kendaraan dalam kondisi bersih\n- BBM full tank\n- Dokumen lengkap\n\nInfo: {{phone}}",
        variables: ["customerName", "vehicleName", "returnDate", "returnTime", "returnLocation", "phone"],
        isActive: true,
        senderId: "SEND002",
        createdAt: "2024-01-08T00:00:00Z"
      },
      {
        id: "TEMP005",
        name: "Welcome New Customer",
        category: "welcome" as const,
        subject: "Selamat Datang di RentalCar Pro",
        content: "Halo {{customerName}},\n\nSelamat datang di {{companyName}}!\n\nTerima kasih telah mempercayai kami untuk kebutuhan transportasi Anda. Kami berkomitmen memberikan pelayanan terbaik.\n\nLayanan kami:\n✓ Rental mobil harian/bulanan\n✓ Sopir profesional\n✓ Asuransi comprehensive\n✓ Support 24/7\n\nHubungi kami: {{phone}}\nWebsite: {{website}}",
        variables: ["customerName", "companyName", "phone", "website"],
        isActive: true,
        senderId: "SEND002",
        createdAt: "2024-01-10T00:00:00Z"
      }
    ]
  },

  getCommunicationAssistant: () => {
    return [
      {
        id: "RESP001",
        trigger: "halo",
        response: "Halo! Selamat datang di RentalCar Pro. Saya asisten virtual yang siap membantu Anda 24/7. Ada yang bisa saya bantu?",
        category: "greeting" as const,
        isActive: true,
        priority: 1
      },
      {
        id: "RESP002",
        trigger: "harga",
        response: "Untuk informasi harga rental terbaru:\n\n📋 Kategori Ekonomi: 300-400rb/hari\n📋 Kategori Premium: 450-600rb/hari\n📋 Kategori Luxury: 700rb-1.5jt/hari\n\nHarga sudah termasuk asuransi. Sopir +150-300rb/hari.\n\nInfo lengkap: +628123456789",
        category: "faq" as const,
        isActive: true,
        priority: 3
      },
      {
        id: "RESP003",
        trigger: "booking",
        response: "Cara booking mudah:\n\n1️⃣ Kunjungi website kami\n2️⃣ WhatsApp ke +628123456789\n3️⃣ Telepon langsung ke kantor\n4️⃣ Datang ke kantor kami\n\nSyarat: KTP, SIM, deposit sesuai kategori\n\nTim kami siap membantu 24/7! 🚗",
        category: "booking" as const,
        isActive: true,
        priority: 2
      },
      {
        id: "RESP004",
        trigger: "syarat",
        response: "Syarat rental kendaraan:\n\n📄 KTP asli (fotocopy)\n📄 SIM A yang masih berlaku\n💰 Deposit: Ekonomi 2jt, Premium 5jt, Luxury 10jt\n📝 Isi formulir kesepakatan\n👤 Minimal usia 21 tahun\n\nUntuk lepas kunci: +jaminan tambahan\n\nInfo: +628123456789",
        category: "faq" as const,
        isActive: true,
        priority: 4
      },
      {
        id: "RESP005",
        trigger: "lokasi",
        response: "Kantor Rental kami:\n\n📍 Jl. Sudirman No. 123, Jakarta Pusat\n🕒 Buka: 06:00 - 22:00 WIB\n📞 Telepon: +628123456789\n📱 WhatsApp: +628123456789\n\nLayanan antar-jemput tersedia dengan biaya tambahan.\n\nSampai jumpa! 🚗",
        category: "info" as const,
        isActive: true,
        priority: 5
      },
      {
        id: "RESP006",
        trigger: "sopir",
        response: "Layanan sopir profesional:\n\n👨‍💼 Sopir berpengalaman & berlisensi\n⭐ Rating tinggi dari customer\n🕒 Tersedia 24 jam\n💰 Tarif: +150-300rb/hari\n🛡️ Sudah terlatih safety driving\n\nBisa request sopir khusus (wanita/pria)\n\nInfo: +628123456789",
        category: "service" as const,
        isActive: true,
        priority: 6
      }
    ]
  },

  getCommunicationBrand: () => {
    return {
      companyName: "RentalCar Pro",
      logo: "https://images.unsplash.com/photo-1567515004624-219c11d31f2e?w=200&q=80",
      favicon: "https://images.unsplash.com/photo-1567515004624-219c11d31f2e?w=32&q=80",
      primaryColor: "#3b82f6",
      secondaryColor: "#10b981",
      domain: "rentalcarpro.com",
      subdomain: "admin",
      tagline: "Solusi Rental Terpercaya #1 Jakarta",
      address: "Jl. Sudirman No. 123, Jakarta Pusat 10220",
      phone: "+628123456789",
      email: "info@rentalcarpro.com",
      socialMedia: {
        whatsapp: "+628123456789",
        instagram: "@rentalcarpro",
        facebook: "RentalCar Pro Jakarta",
        website: "https://rentalcarpro.com"
      }
    }
  },

  // Driver-related endpoints with comprehensive data
  getDriverExpenses: () => {
    return [
      {
        id: "DEXP001",
        driverId: "DRV001",
        driverName: "Ahmad Susanto",
        date: "2024-01-22",
        category: "fuel",
        description: "Pengisian BBM untuk trip Jakarta-Bandung",
        amount: 180000,
        vehicleId: "1",
        vehicleName: "Toyota Avanza B1234ABC",
        status: "approved",
        approvedBy: "Manager Operasional",
        approvedAt: "2024-01-22T14:30:00Z",
        notes: "Trip VIP client"
      },
      {
        id: "DEXP002",
        driverId: "DRV001",
        driverName: "Ahmad Susanto",
        date: "2024-01-21",
        category: "toll",
        description: "Tol Jakarta-Bandung PP",
        amount: 75000,
        vehicleId: "1",
        vehicleName: "Toyota Avanza B1234ABC",
        status: "approved",
        approvedBy: "Manager Operasional",
        approvedAt: "2024-01-21T18:00:00Z",
        notes: "Same trip sebagai fuel expense"
      },
      {
        id: "DEXP003",
        driverId: "DRV002",
        driverName: "Budi Hartono",
        date: "2024-01-20",
        category: "meal",
        description: "Makan siang trip luar kota",
        amount: 50000,
        vehicleId: "2",
        vehicleName: "Honda Civic B5678DEF",
        status: "approved",
        approvedBy: "Admin Utama",
        approvedAt: "2024-01-20T16:45:00Z",
        notes: "Trip 8 jam Bekasi-Bogor"
      },
      {
        id: "DEXP004",
        driverId: "DRV004",
        driverName: "Dedi Kurniawan",
        date: "2024-01-19",
        category: "parking",
        description: "Parkir mall Grand Indonesia",
        amount: 15000,
        vehicleId: "8",
        vehicleName: "Toyota Alphard B2345VWX",
        status: "approved",
        approvedBy: "Manager Operasional",
        approvedAt: "2024-01-19T20:30:00Z",
        notes: "Client shopping trip"
      },
      {
        id: "DEXP005",
        driverId: "DRV006",
        driverName: "Farid Rahman",
        date: "2024-01-18",
        category: "fuel",
        description: "BBM untuk family trip",
        amount: 120000,
        vehicleId: "4",
        vehicleName: "Mitsubishi Xpander B3456JKL",
        status: "pending",
        approvedBy: null,
        approvedAt: null,
        notes: "Menunggu approval manager"
      }
    ]
  },

  getDriverSchedule: () => {
    return [
      {
        id: "SCH001",
        driverId: "DRV001",
        driverName: "Ahmad Susanto",
        bookingId: "TRX009",
        customerName: "Corporate Client A",
        vehicleId: "1",
        vehicleName: "Toyota Avanza B1234ABC",
        startDate: "2024-01-24",
        endDate: "2024-01-24",
        startTime: "08:00",
        endTime: "17:00",
        pickupLocation: "Kantor Client",
        dropoffLocation: "Kantor Client",
        status: "scheduled",
        notes: "Meeting luar kota"
      },
      {
        id: "SCH002",
        driverId: "DRV002",
        driverName: "Budi Hartono",
        bookingId: "TRX002",
        customerName: "Jane Smith",
        vehicleId: "2",
        vehicleName: "Honda Civic B5678DEF",
        startDate: "2024-01-25",
        endDate: "2024-01-27",
        startTime: "14:00",
        endTime: "18:00",
        pickupLocation: "Alamat Customer",
        dropoffLocation: "Kantor Rental",
        status: "confirmed",
        notes: "Wisata keluarga 3 hari"
      },
      {
        id: "SCH003",
        driverId: "DRV004",
        driverName: "Dedi Kurniawan",
        bookingId: "TRX003",
        customerName: "Budi Santoso",
        vehicleId: "8",
        vehicleName: "Toyota Alphard B2345VWX",
        startDate: "2024-01-23",
        endDate: "2024-01-23",
        startTime: "08:00",
        endTime: "12:00",
        pickupLocation: "Hotel Grand Indonesia",
        dropoffLocation: "Bandara Soekarno-Hatta",
        status: "active",
        notes: "Airport transfer VIP"
      },
      {
        id: "SCH004",
        driverId: "DRV006",
        driverName: "Farid Rahman",
        bookingId: "TRX006",
        customerName: "Lisa Permata",
        vehicleId: "4",
        vehicleName: "Mitsubishi Xpander B3456JKL",
        startDate: "2024-01-21",
        endDate: "2024-01-22",
        startTime: "07:00",
        endTime: "19:00",
        pickupLocation: "Kantor Rental",
        dropoffLocation: "Kantor Rental",
        status: "active",
        notes: "Family trip Puncak"
      }
    ]
  },

  getDriverLocation: () => {
    return [
      {
        driverId: "DRV001",
        driverName: "Ahmad Susanto",
        currentLocation: {
          lat: -6.2088,
          lng: 106.8456,
          address: "Monas, Jakarta Pusat",
          lastUpdated: "2024-01-23T10:15:00Z"
        },
        status: "available",
        vehicleId: "",
        isOnline: true
      },
      {
        driverId: "DRV002",
        driverName: "Budi Hartono",
        currentLocation: {
          lat: -6.1751,
          lng: 106.8650,
          address: "Kemayoran, Jakarta Pusat",
          lastUpdated: "2024-01-23T10:12:00Z"
        },
        status: "on_duty",
        vehicleId: "2",
        isOnline: true
      },
      {
        driverId: "DRV003",
        driverName: "Citra Pengemudi",
        currentLocation: {
          lat: -6.2297,
          lng: 106.8181,
          address: "Senayan, Jakarta Selatan",
          lastUpdated: "2024-01-22T18:45:00Z"
        },
        status: "off_duty",
        vehicleId: "",
        isOnline: false
      },
      {
        driverId: "DRV004",
        driverName: "Dedi Kurniawan",
        currentLocation: {
          lat: -6.1256,
          lng: 106.6557,
          address: "Bandara Soekarno-Hatta",
          lastUpdated: "2024-01-23T10:30:00Z"
        },
        status: "on_duty",
        vehicleId: "8",
        isOnline: true
      },
      {
        driverId: "DRV005",
        driverName: "Eko Prasetyo",
        currentLocation: {
          lat: -6.2607,
          lng: 106.7816,
          address: "Blok M, Jakarta Selatan",
          lastUpdated: "2024-01-23T09:45:00Z"
        },
        status: "available",
        vehicleId: "",
        isOnline: true
      }
    ]
  },

  // Missing method for driver assignments
  getDriverAssignments: () => {
    return [
      {
        id: "ASG001",
        driverId: "DRV002",
        driverName: "Budi Hartono",
        vehicleId: "2",
        vehicleName: "Honda Civic B5678DEF",
        bookingId: "TRX002",
        customerName: "Jane Smith",
        startTime: "2024-01-25T14:00:00Z",
        endTime: "2024-01-27T18:00:00Z",
        status: "active",
        startLocation: "Alamat Customer",
        endLocation: "Kantor Rental",
        distance: 150,
        earnings: 180000
      },
      {
        id: "ASG002", 
        driverId: "DRV004",
        driverName: "Dedi Kurniawan", 
        vehicleId: "8",
        vehicleName: "Toyota Alphard B2345VWX",
        bookingId: "TRX003",
        customerName: "Budi Santoso",
        startTime: "2024-01-23T08:00:00Z",
        endTime: "2024-01-23T12:00:00Z",
        status: "completed",
        startLocation: "Hotel Grand Indonesia",
        endLocation: "Bandara Soekarno-Hatta",
        distance: 45,
        earnings: 200000
      },
      {
        id: "ASG003",
        driverId: "DRV006",
        driverName: "Farid Rahman",
        vehicleId: "4", 
        vehicleName: "Mitsubishi Xpander B3456JKL",
        bookingId: "TRX006",
        customerName: "Lisa Permata",
        startTime: "2024-01-21T07:00:00Z",
        endTime: "2024-01-22T19:00:00Z",
        status: "completed",
        startLocation: "Kantor Rental",
        endLocation: "Kantor Rental",
        distance: 280,
        earnings: 150000
      },
      {
        id: "ASG004",
        driverId: "DRV012",
        driverName: "Lucky Handoko",
        vehicleId: "12",
        vehicleName: "Toyota Hiace B9753HIJ",
        bookingId: "TRX007",
        customerName: "Ahmad Wijaya",
        startTime: "2024-01-26T05:00:00Z",
        endTime: null,
        status: "active",
        startLocation: "Kantor Rental",
        endLocation: "Kantor Rental",
        distance: 0,
        earnings: 100000
      }
    ]
  }
}