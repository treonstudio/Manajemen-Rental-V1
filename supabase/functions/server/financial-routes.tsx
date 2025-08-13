import { Hono } from 'npm:hono'
import * as kv from './kv_store.tsx'

const financialRoutes = new Hono()

interface FinancialSummary {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  totalRentals: number
  averageRentalValue: number
  outstandingAmount: number
  cashFlow: number
  period: string
}

interface RentalSalesReport {
  id: string
  date: string
  customerName: string
  vehicleName: string
  amount: number
  paymentStatus: 'paid' | 'partial' | 'unpaid'
  driverName?: string
  orderSource: string
  profit: number
  expenses: number
}

interface ExpenseReport {
  id: string
  date: string
  category: 'fuel' | 'maintenance' | 'insurance' | 'driver_expense' | 'operational' | 'other'
  description: string
  amount: number
  vehicleName?: string
  driverName?: string
  approvedBy?: string
}

interface OutstandingRental {
  id: string
  customerName: string
  vehicleName: string
  startDate: string
  endDate: string
  totalAmount: number
  paidAmount: number
  outstandingAmount: number
  overdueDays: number
  contactInfo: string
  status: 'overdue' | 'due_soon' | 'pending'
}

interface DriverReport {
  driverId: string
  driverName: string
  totalTrips: number
  totalEarnings: number
  totalExpenses: number
  netEarnings: number
  averageRating: number
  totalDistance: number
  fuelCost: number
  maintenanceCost: number
}

interface CustomerReport {
  customerId: string
  customerName: string
  totalRentals: number
  totalSpent: number
  averageRentalValue: number
  lastRentalDate: string
  preferredVehicles: string[]
  paymentReliability: number
  customerValue: 'vip' | 'premium' | 'loyal' | 'regular' | 'new'
}

interface OrderSourceReport {
  source: string
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  conversionRate: number
  customerAcquisitionCost: number
  profitability: number
}

// Helper function to filter by date range
const filterByDateRange = (items: any[], startDate?: string, endDate?: string, dateField = 'date') => {
  if (!startDate && !endDate) return items
  
  return items.filter(item => {
    const itemDate = new Date(item[dateField])
    const start = startDate ? new Date(startDate) : new Date('2000-01-01')
    const end = endDate ? new Date(endDate) : new Date('2099-12-31')
    return itemDate >= start && itemDate <= end
  })
}

// Helper function to get period dates
const getPeriodDates = (period: string) => {
  const now = new Date()
  let startDate: Date
  let endDate = new Date()

  switch (period) {
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

// Financial Summary Report (FR-LAP-001)
financialRoutes.get('/financial-summary', async (c) => {
  try {
    const period = c.req.query('period') || 'month'
    const customStart = c.req.query('start')
    const customEnd = c.req.query('end')

    const { startDate, endDate } = customStart && customEnd ? 
      { startDate: new Date(customStart), endDate: new Date(customEnd) } :
      getPeriodDates(period)

    // Get all transactions and expenses
    const transactions = await kv.getByPrefix('transaction_') || []
    const expenses = await kv.getByPrefix('expense_') || []
    const driverExpenses = await kv.getByPrefix('driver_expense_') || []
    
    // Filter by date range
    const filteredTransactions = filterByDateRange(transactions, startDate.toISOString(), endDate.toISOString(), 'createdAt')
    const filteredExpenses = filterByDateRange([...expenses, ...driverExpenses], startDate.toISOString(), endDate.toISOString(), 'date')

    // Calculate financial metrics
    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
    const netProfit = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
    const totalRentals = filteredTransactions.length
    const averageRentalValue = totalRentals > 0 ? totalRevenue / totalRentals : 0
    
    // Calculate outstanding amounts
    const outstandingTransactions = transactions.filter(t => t.paymentStatus !== 'paid')
    const outstandingAmount = outstandingTransactions.reduce((sum, t) => {
      const paid = t.paidAmount || 0
      return sum + (t.amount - paid)
    }, 0)

    const summary: FinancialSummary = {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      totalRentals,
      averageRentalValue,
      outstandingAmount,
      cashFlow: totalRevenue - totalExpenses,
      period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`
    }

    return c.json({ success: true, data: summary })
  } catch (error) {
    console.log('Error generating financial summary:', error)
    return c.json({ success: false, error: 'Failed to generate financial summary' }, 500)
  }
})

// Rental Sales Report (FR-LAP-001)
financialRoutes.get('/rental-sales', async (c) => {
  try {
    const period = c.req.query('period') || 'month'
    const customStart = c.req.query('start')
    const customEnd = c.req.query('end')

    const { startDate, endDate } = customStart && customEnd ? 
      { startDate: new Date(customStart), endDate: new Date(customEnd) } :
      getPeriodDates(period)

    const transactions = await kv.getByPrefix('transaction_') || []
    const expenses = await kv.getByPrefix('expense_') || []
    
    const filteredTransactions = filterByDateRange(transactions, startDate.toISOString(), endDate.toISOString(), 'createdAt')

    const salesReports: RentalSalesReport[] = filteredTransactions.map(transaction => {
      // Calculate related expenses for this transaction
      const relatedExpenses = expenses.filter(e => 
        e.transactionId === transaction.id || 
        e.vehicleId === transaction.vehicleId
      ).reduce((sum, e) => sum + (e.amount || 0), 0)

      return {
        id: transaction.id,
        date: transaction.createdAt,
        customerName: transaction.customerName || 'Unknown',
        vehicleName: transaction.vehicleName || 'Unknown',
        amount: transaction.amount || 0,
        paymentStatus: transaction.paymentStatus || 'unpaid',
        driverName: transaction.driverName,
        orderSource: transaction.orderSource || 'Direct',
        profit: (transaction.amount || 0) - relatedExpenses,
        expenses: relatedExpenses
      }
    })

    return c.json({ success: true, data: salesReports })
  } catch (error) {
    console.log('Error generating rental sales report:', error)
    return c.json({ success: false, error: 'Failed to generate rental sales report' }, 500)
  }
})

// Expenses Report (FR-LAP-001)
financialRoutes.get('/expenses', async (c) => {
  try {
    const period = c.req.query('period') || 'month'
    const customStart = c.req.query('start')
    const customEnd = c.req.query('end')

    const { startDate, endDate } = customStart && customEnd ? 
      { startDate: new Date(customStart), endDate: new Date(customEnd) } :
      getPeriodDates(period)

    const expenses = await kv.getByPrefix('expense_') || []
    const driverExpenses = await kv.getByPrefix('driver_expense_') || []
    
    // Combine all expenses
    const allExpenses = [
      ...expenses.map(e => ({ ...e, category: e.type || 'operational' })),
      ...driverExpenses.filter(e => e.status === 'approved').map(e => ({ 
        ...e, 
        category: 'driver_expense',
        approvedBy: e.reviewedBy 
      }))
    ]

    const filteredExpenses = filterByDateRange(allExpenses, startDate.toISOString(), endDate.toISOString(), 'date')

    const expenseReports: ExpenseReport[] = filteredExpenses.map(expense => ({
      id: expense.id,
      date: expense.date || expense.submittedAt,
      category: expense.category || 'other',
      description: expense.description || expense.type || 'No description',
      amount: expense.amount || 0,
      vehicleName: expense.vehicleName,
      driverName: expense.driverName,
      approvedBy: expense.approvedBy || 'System'
    }))

    return c.json({ success: true, data: expenseReports })
  } catch (error) {
    console.log('Error generating expenses report:', error)
    return c.json({ success: false, error: 'Failed to generate expenses report' }, 500)
  }
})

// Outstanding Rentals Report (FR-LAP-002)
financialRoutes.get('/outstanding-rentals', async (c) => {
  try {
    const transactions = await kv.getByPrefix('transaction_') || []
    const customers = await kv.getByPrefix('customer_') || []
    
    const outstandingTransactions = transactions.filter(t => t.paymentStatus !== 'paid')
    
    const outstandingReports: OutstandingRental[] = outstandingTransactions.map(transaction => {
      const customer = customers.find(c => c.name === transaction.customerName)
      const paidAmount = transaction.paidAmount || 0
      const outstandingAmount = (transaction.amount || 0) - paidAmount
      const endDate = new Date(transaction.endDate || transaction.createdAt)
      const now = new Date()
      const overdueDays = Math.max(0, Math.ceil((now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)))
      
      let status: 'overdue' | 'due_soon' | 'pending' = 'pending'
      if (overdueDays > 0) {
        status = 'overdue'
      } else if (overdueDays >= -7) {
        status = 'due_soon'
      }

      return {
        id: transaction.id,
        customerName: transaction.customerName || 'Unknown',
        vehicleName: transaction.vehicleName || 'Unknown',
        startDate: transaction.startDate || transaction.createdAt,
        endDate: transaction.endDate || transaction.createdAt,
        totalAmount: transaction.amount || 0,
        paidAmount,
        outstandingAmount,
        overdueDays,
        contactInfo: customer?.phone || customer?.email || 'No contact',
        status
      }
    })

    return c.json({ success: true, data: outstandingReports })
  } catch (error) {
    console.log('Error generating outstanding rentals report:', error)
    return c.json({ success: false, error: 'Failed to generate outstanding rentals report' }, 500)
  }
})

// Driver Performance Report (FR-LAP-003)
financialRoutes.get('/driver-performance', async (c) => {
  try {
    const period = c.req.query('period') || 'month'
    const { startDate, endDate } = getPeriodDates(period)

    const drivers = await kv.getByPrefix('driver_') || []
    const assignments = await kv.getByPrefix('driver_assignment_') || []
    const expenses = await kv.getByPrefix('driver_expense_') || []
    
    const filteredAssignments = filterByDateRange(assignments, startDate.toISOString(), endDate.toISOString(), 'startTime')
    const filteredExpenses = expenses.filter(e => e.status === 'approved')

    const driverReports: DriverReport[] = drivers.map(driver => {
      const driverAssignments = filteredAssignments.filter(a => a.driverId === driver.id)
      const driverExpenses = filteredExpenses.filter(e => e.driverId === driver.id)
      const fuelExpenses = driverExpenses.filter(e => e.type === 'fuel')
      const maintenanceExpenses = driverExpenses.filter(e => e.type === 'maintenance')

      const totalEarnings = driverAssignments.reduce((sum, a) => sum + (a.earnings || 0), 0)
      const totalExpenses = driverExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
      const totalDistance = driverAssignments.reduce((sum, a) => sum + (a.distance || 0), 0)
      const fuelCost = fuelExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
      const maintenanceCost = maintenanceExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)

      return {
        driverId: driver.id,
        driverName: driver.name,
        totalTrips: driverAssignments.length,
        totalEarnings,
        totalExpenses,
        netEarnings: totalEarnings - totalExpenses,
        averageRating: driver.rating || 0,
        totalDistance,
        fuelCost,
        maintenanceCost
      }
    })

    return c.json({ success: true, data: driverReports })
  } catch (error) {
    console.log('Error generating driver performance report:', error)
    return c.json({ success: false, error: 'Failed to generate driver performance report' }, 500)
  }
})

// Customer Analysis Report (FR-LAP-003)
financialRoutes.get('/customer-analysis', async (c) => {
  try {
    const period = c.req.query('period') || 'month'
    const { startDate, endDate } = getPeriodDates(period)

    const customers = await kv.getByPrefix('customer_') || []
    const transactions = await kv.getByPrefix('transaction_') || []
    
    const filteredTransactions = filterByDateRange(transactions, startDate.toISOString(), endDate.toISOString(), 'createdAt')

    const customerReports: CustomerReport[] = customers.map(customer => {
      const customerTransactions = filteredTransactions.filter(t => t.customerName === customer.name)
      const totalSpent = customerTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
      const totalRentals = customerTransactions.length
      const averageRentalValue = totalRentals > 0 ? totalSpent / totalRentals : 0
      
      // Get preferred vehicles
      const vehicleCounts: { [key: string]: number } = {}
      customerTransactions.forEach(t => {
        if (t.vehicleName) {
          vehicleCounts[t.vehicleName] = (vehicleCounts[t.vehicleName] || 0) + 1
        }
      })
      const preferredVehicles = Object.entries(vehicleCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([vehicle]) => vehicle)

      // Calculate payment reliability
      const paidTransactions = customerTransactions.filter(t => t.paymentStatus === 'paid')
      const paymentReliability = totalRentals > 0 ? paidTransactions.length / totalRentals : 0

      // Determine customer value
      let customerValue: 'vip' | 'premium' | 'loyal' | 'regular' | 'new' = 'new'
      if (totalSpent > 5000000) customerValue = 'vip'
      else if (totalSpent > 2000000) customerValue = 'premium'
      else if (totalRentals > 5) customerValue = 'loyal'
      else if (totalRentals > 0) customerValue = 'regular'

      const lastTransaction = customerTransactions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

      return {
        customerId: customer.id,
        customerName: customer.name,
        totalRentals,
        totalSpent,
        averageRentalValue,
        lastRentalDate: lastTransaction?.createdAt || customer.createdAt,
        preferredVehicles,
        paymentReliability,
        customerValue
      }
    })

    return c.json({ success: true, data: customerReports })
  } catch (error) {
    console.log('Error generating customer analysis report:', error)
    return c.json({ success: false, error: 'Failed to generate customer analysis report' }, 500)
  }
})

// Order Sources Report (FR-LAP-004)
financialRoutes.get('/order-sources', async (c) => {
  try {
    const period = c.req.query('period') || 'month'
    const { startDate, endDate } = getPeriodDates(period)

    const transactions = await kv.getByPrefix('transaction_') || []
    const filteredTransactions = filterByDateRange(transactions, startDate.toISOString(), endDate.toISOString(), 'createdAt')
    
    // Group by order source
    const sourceGroups: { [key: string]: typeof transactions } = {}
    filteredTransactions.forEach(transaction => {
      const source = transaction.orderSource || 'Direct'
      if (!sourceGroups[source]) {
        sourceGroups[source] = []
      }
      sourceGroups[source].push(transaction)
    })

    // Calculate metrics for each source
    const orderSourceReports: OrderSourceReport[] = Object.entries(sourceGroups).map(([source, transactions]) => {
      const totalOrders = transactions.length
      const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      
      // Mock metrics for demonstration
      const conversionRate = Math.random() * 0.3 + 0.1 // 10-40%
      const customerAcquisitionCost = averageOrderValue * 0.15 // 15% of AOV
      const profitability = (totalRevenue * 0.3) - (totalOrders * customerAcquisitionCost) // 30% margin

      return {
        source,
        totalOrders,
        totalRevenue,
        averageOrderValue,
        conversionRate,
        customerAcquisitionCost,
        profitability
      }
    })

    return c.json({ success: true, data: orderSourceReports })
  } catch (error) {
    console.log('Error generating order sources report:', error)
    return c.json({ success: false, error: 'Failed to generate order sources report' }, 500)
  }
})

// Export to PDF (FR-LAP-005)
financialRoutes.post('/export/pdf', async (c) => {
  try {
    const { reportType, period, startDate, endDate, filters } = await c.req.json()
    
    // In a real implementation, you would generate a PDF here
    // For demo purposes, we'll simulate the process
    const filename = `${reportType}_${period}_${Date.now()}.pdf`
    const downloadUrl = `https://example.com/reports/${filename}`
    
    // Log export activity
    const exportLog = {
      id: `export_${Date.now()}`,
      reportType,
      format: 'pdf',
      period,
      startDate,
      endDate,
      filters,
      filename,
      exportedAt: new Date().toISOString(),
      downloadUrl
    }
    
    await kv.set(`report_export_${exportLog.id}`, exportLog)
    
    return c.json({ 
      success: true, 
      data: { downloadUrl, filename },
      message: 'PDF report generated successfully' 
    })
  } catch (error) {
    console.log('Error exporting PDF:', error)
    return c.json({ success: false, error: 'Failed to export PDF' }, 500)
  }
})

// Export to Excel (FR-LAP-005)
financialRoutes.post('/export/excel', async (c) => {
  try {
    const { reportType, period, startDate, endDate, filters } = await c.req.json()
    
    // In a real implementation, you would generate an Excel file here
    // For demo purposes, we'll simulate the process
    const filename = `${reportType}_${period}_${Date.now()}.xlsx`
    const downloadUrl = `https://example.com/reports/${filename}`
    
    // Log export activity
    const exportLog = {
      id: `export_${Date.now()}`,
      reportType,
      format: 'excel',
      period,
      startDate,
      endDate,
      filters,
      filename,
      exportedAt: new Date().toISOString(),
      downloadUrl
    }
    
    await kv.set(`report_export_${exportLog.id}`, exportLog)
    
    return c.json({ 
      success: true, 
      data: { downloadUrl, filename },
      message: 'Excel report generated successfully' 
    })
  } catch (error) {
    console.log('Error exporting Excel:', error)
    return c.json({ success: false, error: 'Failed to export Excel' }, 500)
  }
})

// Get export history
financialRoutes.get('/exports', async (c) => {
  try {
    const exports = await kv.getByPrefix('report_export_') || []
    
    // Sort by export date, newest first
    const sortedExports = exports.sort((a, b) => 
      new Date(b.exportedAt).getTime() - new Date(a.exportedAt).getTime()
    )
    
    return c.json({ success: true, data: sortedExports })
  } catch (error) {
    console.log('Error fetching export history:', error)
    return c.json({ success: false, error: 'Failed to fetch export history' }, 500)
  }
})

export default financialRoutes