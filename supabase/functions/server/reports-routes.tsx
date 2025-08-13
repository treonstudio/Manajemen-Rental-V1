import { Hono } from 'npm:hono'
import * as kv from './kv_store.tsx'

const reportsRoutes = new Hono()

// Mock data for reports
const mockFinancialSummary = {
  totalRevenue: 87500000,
  totalExpenses: 42800000,
  netProfit: 44700000,
  profitMargin: 51.1,
  totalRentals: 156,
  averageRentalValue: 560897,
  outstandingAmount: 15750000,
  cashFlow: 44700000,
  period: "2025-01-01 to 2025-01-31"
}

const mockRentalSalesReports = [
  {
    id: 'rs_1',
    date: '2025-01-11',
    customerName: 'Ahmad Rifai',
    vehicleName: 'Toyota Avanza',
    amount: 750000,
    paymentStatus: 'paid',
    driverName: 'Ahmad Supri',
    orderSource: 'Website',
    profit: 450000,
    expenses: 300000
  },
  {
    id: 'rs_2',
    date: '2025-01-10',
    customerName: 'Sari Indah',
    vehicleName: 'Honda City',
    amount: 650000,
    paymentStatus: 'partial',
    driverName: 'Budi Santoso',
    orderSource: 'WhatsApp',
    profit: 320000,
    expenses: 330000
  }
]

// Performance reports endpoint
reportsRoutes.get('/performance', async (c) => {
  try {
    const vehicles = await kv.getByPrefix('vehicle:') || []
    const bookings = await kv.getByPrefix('booking:') || []
    
    const performanceData = vehicles.map((vehicle: any) => {
      const vehicleBookings = bookings.filter((b: any) => b.vehicleId === vehicle.id)
      const totalRevenue = vehicleBookings.reduce((sum: number, b: any) => sum + (b.totalCost || 0), 0)
      const totalDistance = vehicleBookings.reduce((sum: number, b: any) => sum + (b.distance || 0), 0)
      
      return {
        id: vehicle.id,
        name: vehicle.name,
        plateNumber: vehicle.plateNumber,
        category: vehicle.category,
        totalBookings: vehicleBookings.length,
        totalRevenue,
        utilizationRate: Math.min(100, vehicleBookings.length * 15),
        averageRating: 4.5 + Math.random() * 0.5,
        totalDistance,
        maintenanceCost: totalRevenue * 0.15,
        fuelCost: totalRevenue * 0.12,
        profitMargin: 68 + Math.random() * 10,
        averageRentalDuration: 2.5 + Math.random() * 2,
        peakSeason: ['Weekend', 'Liburan Sekolah', 'Mudik & Liburan'][Math.floor(Math.random() * 3)]
      }
    })
    
    return c.json({ success: true, data: performanceData })
  } catch (error) {
    console.log('Error generating performance report:', error)
    return c.json({ success: false, error: 'Failed to generate performance report' }, 500)
  }
})

// Financial summary endpoint
reportsRoutes.get('/financial-summary', async (c) => {
  try {
    let summary = await kv.get('financial_summary')
    
    if (!summary) {
      summary = mockFinancialSummary
      await kv.set('financial_summary', summary)
    }

    return c.json({ success: true, data: summary })
  } catch (error) {
    console.log('Error fetching financial summary:', error)
    return c.json({ success: true, data: mockFinancialSummary })
  }
})

// Rental sales reports endpoint
reportsRoutes.get('/rental-sales', async (c) => {
  try {
    let sales = await kv.get('rental_sales_reports')
    
    if (!sales) {
      sales = mockRentalSalesReports
      await kv.set('rental_sales_reports', sales)
    }

    return c.json({ success: true, data: sales })
  } catch (error) {
    console.log('Error fetching rental sales reports:', error)
    return c.json({ success: true, data: mockRentalSalesReports })
  }
})

// Export reports (generate download links)
reportsRoutes.post('/exports', async (c) => {
  try {
    const { reportType, format, period } = await c.req.json()
    
    const exportRecord = {
      id: `export_${Date.now()}`,
      reportType,
      format,
      period,
      filename: `${reportType}_${period}_${Date.now()}.${format}`,
      exportedAt: new Date().toISOString(),
      downloadUrl: `https://example.com/reports/${reportType}_${period}_${Date.now()}.${format}`
    }
    
    // Store export record
    let exports = await kv.get('report_exports') || []
    exports.push(exportRecord)
    await kv.set('report_exports', exports)
    
    return c.json({ 
      success: true, 
      data: exportRecord, 
      message: 'Report export initiated successfully' 
    })
  } catch (error) {
    console.log('Error creating report export:', error)
    return c.json({ success: false, error: 'Failed to create report export' }, 500)
  }
})

// Get export history
reportsRoutes.get('/exports', async (c) => {
  try {
    const exports = await kv.get('report_exports') || []
    return c.json({ success: true, data: exports })
  } catch (error) {
    console.log('Error fetching export history:', error)
    return c.json({ success: true, data: [] })
  }
})

export default reportsRoutes