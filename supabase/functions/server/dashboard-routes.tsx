import { Hono } from 'npm:hono'
import * as kv from './kv_store.tsx'

const dashboardRoutes = new Hono()

interface DashboardKPI {
  totalRevenue: number
  totalTransactions: number
  averageTransaction: number
  monthlyGrowth: number
  totalVehicles: number
  availableVehicles: number
  rentedVehicles: number
  maintenanceVehicles: number
  totalDrivers: number
  activeDrivers: number
  totalCustomers: number
  activeRentals: number
  outstandingAmount: number
  collectionRate: number
  utilizationRate: number
}

interface ProfitLossData {
  month: string
  revenue: number
  expenses: number
  profit: number
  margin: number
}

interface VehiclePerformance {
  vehicleId: string
  vehicleName: string
  model: string
  totalRentals: number
  totalRevenue: number
  utilizationRate: number
  averageRentalValue: number
  lastRentalDate: string
  status: 'excellent' | 'good' | 'average' | 'poor'
}

interface DriverPerformance {
  driverId: string
  driverName: string
  totalTrips: number
  totalRevenue: number
  averageRating: number
  completionRate: number
  customerSatisfaction: number
  efficiency: number
  status: 'top' | 'good' | 'average' | 'needs_improvement'
}

interface RealtimeMetrics {
  activeRentals: number
  todayRevenue: number
  todayTransactions: number
  vehicleUtilization: number
  driverUtilization: number
  pendingMaintenance: number
  overduePayments: number
  newCustomers: number
}

// Helper function to get period dates
const getPeriodDates = (period: string) => {
  const now = new Date()
  let startDate: Date
  let endDate = new Date()

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'quarter':
      const quarterStart = Math.floor(now.getMonth() / 3) * 3
      startDate = new Date(now.getFullYear(), quarterStart, 1)
      break
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  return { startDate, endDate }
}

// Helper function to filter by date range
const filterByDateRange = (items: any[], startDate?: Date, endDate?: Date, dateField = 'createdAt') => {
  if (!startDate && !endDate) return items
  
  return items.filter(item => {
    const itemDate = new Date(item[dateField])
    const start = startDate || new Date('2000-01-01')
    const end = endDate || new Date('2099-12-31')
    return itemDate >= start && itemDate <= end
  })
}

// Dashboard KPI Endpoint (FR-DAS-001)
dashboardRoutes.get('/kpi', async (c) => {
  try {
    const period = c.req.query('period') || 'month'
    const { startDate, endDate } = getPeriodDates(period)
    
    // Get all data
    const vehicles = await kv.getByPrefix('vehicle_') || []
    const transactions = await kv.getByPrefix('transaction_') || []
    const drivers = await kv.getByPrefix('driver_') || []
    const customers = await kv.getByPrefix('customer_') || []
    const assignments = await kv.getByPrefix('driver_assignment_') || []
    const conditions = await kv.getByPrefix('vehicle_condition_') || []
    
    // Filter transactions by period
    const filteredTransactions = filterByDateRange(transactions, startDate, endDate)
    
    // Calculate KPIs
    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    const totalTransactions = filteredTransactions.length
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0
    
    // Calculate growth (mock calculation for demo)
    const previousPeriodStart = new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime()))
    const previousTransactions = filterByDateRange(transactions, previousPeriodStart, startDate)
    const previousRevenue = previousTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    const monthlyGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0
    
    // Vehicle status
    const totalVehicles = vehicles.length
    const availableVehicles = vehicles.filter(v => v.status === 'available').length
    const rentedVehicles = vehicles.filter(v => v.status === 'rented').length
    const maintenanceVehicles = vehicles.filter(v => 
      v.status === 'maintenance' || 
      conditions.some(c => c.vehicleId === v.id && c.needsMaintenance)
    ).length
    
    // Driver status
    const totalDrivers = drivers.length
    const activeDrivers = drivers.filter(d => d.status === 'available' || d.status === 'on_duty').length
    
    // Other metrics
    const totalCustomers = customers.length
    const activeRentals = assignments.filter(a => a.status === 'active').length
    
    // Outstanding payments
    const outstandingTransactions = transactions.filter(t => t.paymentStatus !== 'paid')
    const outstandingAmount = outstandingTransactions.reduce((sum, t) => {
      const paid = t.paidAmount || 0
      return sum + (t.amount - paid)
    }, 0)
    
    // Collection rate
    const totalDue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    const totalPaid = transactions.reduce((sum, t) => sum + (t.paidAmount || t.amount || 0), 0)
    const collectionRate = totalDue > 0 ? (totalPaid / totalDue) * 100 : 0
    
    // Utilization rate
    const utilizationRate = totalVehicles > 0 ? (rentedVehicles / totalVehicles) * 100 : 0
    
    const kpiData: DashboardKPI = {
      totalRevenue,
      totalTransactions,
      averageTransaction,
      monthlyGrowth,
      totalVehicles,
      availableVehicles,
      rentedVehicles,
      maintenanceVehicles,
      totalDrivers,
      activeDrivers,
      totalCustomers,
      activeRentals,
      outstandingAmount,
      collectionRate,
      utilizationRate
    }
    
    return c.json({ success: true, data: kpiData })
  } catch (error) {
    console.log('Error getting dashboard KPI:', error)
    return c.json({ success: false, error: 'Failed to get dashboard KPI' }, 500)
  }
})

// Profit Loss Chart Data (FR-DAS-002)
dashboardRoutes.get('/profit-loss', async (c) => {
  try {
    const period = c.req.query('period') || 'month'
    
    const transactions = await kv.getByPrefix('transaction_') || []
    const expenses = await kv.getByPrefix('expense_') || []
    const driverExpenses = await kv.getByPrefix('driver_expense_') || []
    
    // Combine all expenses
    const allExpenses = [
      ...expenses,
      ...driverExpenses.filter(e => e.status === 'approved')
    ]
    
    // Generate monthly data for the last 12 months
    const monthlyData: ProfitLossData[] = []
    const now = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.createdAt)
        return date >= month && date < nextMonth
      })
      
      const monthExpenses = allExpenses.filter(e => {
        const date = new Date(e.date || e.submittedAt)
        return date >= month && date < nextMonth
      })
      
      const revenue = monthTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
      const expenseAmount = monthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
      const profit = revenue - expenseAmount
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0
      
      monthlyData.push({
        month: month.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        revenue,
        expenses: expenseAmount,
        profit,
        margin
      })
    }
    
    return c.json({ success: true, data: monthlyData })
  } catch (error) {
    console.log('Error getting profit-loss data:', error)
    return c.json({ success: false, error: 'Failed to get profit-loss data' }, 500)
  }
})

// Vehicle Performance (FR-DAS-003)
dashboardRoutes.get('/vehicle-performance', async (c) => {
  try {
    const period = c.req.query('period') || 'month'
    const { startDate, endDate } = getPeriodDates(period)
    
    const vehicles = await kv.getByPrefix('vehicle_') || []
    const transactions = await kv.getByPrefix('transaction_') || []
    
    const filteredTransactions = filterByDateRange(transactions, startDate, endDate)
    
    const vehiclePerformance: VehiclePerformance[] = vehicles.map(vehicle => {
      const vehicleTransactions = filteredTransactions.filter(t => t.vehicleId === vehicle.id)
      
      const totalRentals = vehicleTransactions.length
      const totalRevenue = vehicleTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
      const averageRentalValue = totalRentals > 0 ? totalRevenue / totalRentals : 0
      
      // Calculate utilization rate (mock calculation)
      const daysInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      const rentalDays = vehicleTransactions.reduce((sum, t) => {
        if (t.startDate && t.endDate) {
          const start = new Date(t.startDate)
          const end = new Date(t.endDate)
          return sum + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        }
        return sum + 1 // Default 1 day if no dates
      }, 0)
      
      const utilizationRate = daysInPeriod > 0 ? (rentalDays / daysInPeriod) * 100 : 0
      
      // Determine status
      let status: 'excellent' | 'good' | 'average' | 'poor' = 'poor'
      if (utilizationRate >= 80) status = 'excellent'
      else if (utilizationRate >= 60) status = 'good'
      else if (utilizationRate >= 30) status = 'average'
      
      const lastTransaction = vehicleTransactions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
      
      return {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        model: vehicle.model || 'Unknown',
        totalRentals,
        totalRevenue,
        utilizationRate: Math.min(utilizationRate, 100),
        averageRentalValue,
        lastRentalDate: lastTransaction?.createdAt || vehicle.createdAt,
        status
      }
    }).sort((a, b) => b.totalRevenue - a.totalRevenue)
    
    return c.json({ success: true, data: vehiclePerformance })
  } catch (error) {
    console.log('Error getting vehicle performance:', error)
    return c.json({ success: false, error: 'Failed to get vehicle performance' }, 500)
  }
})

// Driver Performance (FR-DAS-003)
dashboardRoutes.get('/driver-performance', async (c) => {
  try {
    const period = c.req.query('period') || 'month'
    const { startDate, endDate } = getPeriodDates(period)
    
    const drivers = await kv.getByPrefix('driver_') || []
    const assignments = await kv.getByPrefix('driver_assignment_') || []
    
    const filteredAssignments = filterByDateRange(assignments, startDate, endDate, 'createdAt')
    
    const driverPerformance: DriverPerformance[] = drivers.map(driver => {
      const driverAssignments = filteredAssignments.filter(a => a.driverId === driver.id)
      
      const totalTrips = driverAssignments.length
      const totalRevenue = driverAssignments.reduce((sum, a) => sum + (a.earnings || 0), 0)
      const completedTrips = driverAssignments.filter(a => a.status === 'completed').length
      const completionRate = totalTrips > 0 ? (completedTrips / totalTrips) * 100 : 0
      
      // Mock calculations for satisfaction and efficiency
      const averageRating = driver.rating || 0
      const customerSatisfaction = Math.min(averageRating * 20, 100) // Convert 5-star to percentage
      const efficiency = Math.random() * 30 + 70 // Mock efficiency 70-100%
      
      // Determine status
      let status: 'top' | 'good' | 'average' | 'needs_improvement' = 'needs_improvement'
      const overallScore = (completionRate + customerSatisfaction + efficiency) / 3
      if (overallScore >= 90) status = 'top'
      else if (overallScore >= 75) status = 'good'
      else if (overallScore >= 60) status = 'average'
      
      return {
        driverId: driver.id,
        driverName: driver.name,
        totalTrips,
        totalRevenue,
        averageRating,
        completionRate,
        customerSatisfaction,
        efficiency,
        status
      }
    }).sort((a, b) => b.totalRevenue - a.totalRevenue)
    
    return c.json({ success: true, data: driverPerformance })
  } catch (error) {
    console.log('Error getting driver performance:', error)
    return c.json({ success: false, error: 'Failed to get driver performance' }, 500)
  }
})

// Real-time Metrics (FR-DAS-001)
dashboardRoutes.get('/realtime', async (c) => {
  try {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    const vehicles = await kv.getByPrefix('vehicle_') || []
    const transactions = await kv.getByPrefix('transaction_') || []
    const drivers = await kv.getByPrefix('driver_') || []
    const assignments = await kv.getByPrefix('driver_assignment_') || []
    const customers = await kv.getByPrefix('customer_') || []
    
    // Today's transactions
    const todayTransactions = transactions.filter(t => 
      new Date(t.createdAt) >= startOfDay
    )
    
    // Calculate metrics
    const activeRentals = assignments.filter(a => a.status === 'active').length
    const todayRevenue = todayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    const todayTransactionsCount = todayTransactions.length
    
    const totalVehicles = vehicles.length
    const rentedVehicles = vehicles.filter(v => v.status === 'rented').length
    const vehicleUtilization = totalVehicles > 0 ? Math.round((rentedVehicles / totalVehicles) * 100) : 0
    
    const totalDrivers = drivers.length
    const onDutyDrivers = drivers.filter(d => d.status === 'on_duty' || d.status === 'available').length
    const driverUtilization = totalDrivers > 0 ? Math.round((onDutyDrivers / totalDrivers) * 100) : 0
    
    const pendingMaintenance = vehicles.filter(v => v.status === 'maintenance').length
    
    const overduePayments = transactions.filter(t => {
      if (t.paymentStatus === 'paid') return false
      const dueDate = new Date(t.endDate || t.createdAt)
      return dueDate < today
    }).length
    
    // New customers this week
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const newCustomers = customers.filter(c => 
      new Date(c.createdAt) >= weekAgo
    ).length
    
    const realtimeMetrics: RealtimeMetrics = {
      activeRentals,
      todayRevenue,
      todayTransactions: todayTransactionsCount,
      vehicleUtilization,
      driverUtilization,
      pendingMaintenance,
      overduePayments,
      newCustomers
    }
    
    return c.json({ success: true, data: realtimeMetrics })
  } catch (error) {
    console.log('Error getting realtime metrics:', error)
    return c.json({ success: false, error: 'Failed to get realtime metrics' }, 500)
  }
})

export default dashboardRoutes