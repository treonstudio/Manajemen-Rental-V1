import { Hono } from 'npm:hono'
import * as kv from './kv_store.tsx'

const transactionRoutes = new Hono()

// Data structures
interface TransactionData {
  id: string
  bookingId?: string
  customerName: string
  customerPhone: string
  vehicleName: string
  vehicleId: string
  transactionType: 'rental' | 'r2r' | 'maintenance' | 'other'
  amount: number
  paymentMethod: 'cash' | 'transfer' | 'dp' | 'credit'
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue'
  invoiceNumber: string
  invoiceSent: boolean
  notes?: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  customBranding?: boolean
  payments: PaymentRecord[]
  expenses: ExpenseRecord[]
}

interface PaymentRecord {
  id: string
  transactionId: string
  amount: number
  method: 'cash' | 'transfer' | 'dp'
  reference?: string
  date: string
  verifiedBy?: string
  notes?: string
}

interface ExpenseRecord {
  id: string
  transactionId?: string
  driverId: string
  driverName: string
  type: 'fuel' | 'toll' | 'parking' | 'meal' | 'maintenance' | 'other'
  amount: number
  description: string
  receipt?: string
  location?: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string
  reviewNotes?: string
}

interface R2RTransaction {
  id: string
  supplierName: string
  supplierContact: string
  vehicleName: string
  vehicleId: string
  costPerDay: number
  sellPricePerDay: number
  startDate: string
  endDate: string
  totalCost: number
  totalRevenue: number
  profit: number
  status: 'active' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
}

// Get all transactions
transactionRoutes.get('/', async (c) => {
  try {
    const transactions = await kv.getByPrefix('transaction_') || []
    
    // Sort by creation date, newest first
    const sortedTransactions = transactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return c.json({ 
      success: true, 
      data: sortedTransactions
    })
  } catch (error) {
    console.log('Error fetching transactions:', error)
    return c.json({ success: false, error: 'Failed to fetch transactions' }, 500)
  }
})

// Get transaction by ID
transactionRoutes.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const transaction = await kv.get(`transaction_${id}`)
    
    if (!transaction) {
      return c.json({ success: false, error: 'Transaction not found' }, 404)
    }
    
    return c.json({ 
      success: true, 
      data: transaction
    })
  } catch (error) {
    console.log('Error fetching transaction:', error)
    return c.json({ success: false, error: 'Failed to fetch transaction' }, 500)
  }
})

// Create new transaction
transactionRoutes.post('/', async (c) => {
  try {
    const transactionData = await c.req.json()
    const transactionId = `transaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newTransaction: TransactionData = {
      id: transactionId.replace('transaction_', ''),
      ...transactionData,
      payments: [],
      expenses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(transactionId, newTransaction)
    
    return c.json({ 
      success: true, 
      data: newTransaction,
      message: 'Transaction created successfully'
    })
  } catch (error) {
    console.log('Error creating transaction:', error)
    return c.json({ success: false, error: 'Failed to create transaction' }, 500)
  }
})

// Update transaction
transactionRoutes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const updates = await c.req.json()
    const transactionKey = `transaction_${id}`
    
    const existingTransaction = await kv.get(transactionKey)
    if (!existingTransaction) {
      return c.json({ success: false, error: 'Transaction not found' }, 404)
    }
    
    const updatedTransaction = {
      ...existingTransaction,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(transactionKey, updatedTransaction)
    
    return c.json({ 
      success: true, 
      data: updatedTransaction,
      message: 'Transaction updated successfully'
    })
  } catch (error) {
    console.log('Error updating transaction:', error)
    return c.json({ success: false, error: 'Failed to update transaction' }, 500)
  }
})

// Add payment to transaction
transactionRoutes.post('/:id/payments', async (c) => {
  try {
    const transactionId = c.req.param('id')
    const paymentData = await c.req.json()
    const transactionKey = `transaction_${transactionId}`
    
    const transaction = await kv.get(transactionKey)
    if (!transaction) {
      return c.json({ success: false, error: 'Transaction not found' }, 404)
    }
    
    const newPayment: PaymentRecord = {
      id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      transactionId,
      ...paymentData,
      date: new Date().toISOString(),
      verifiedBy: 'Current User'
    }
    
    const updatedPayments = [...(transaction.payments || []), newPayment]
    const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0)
    
    // Update payment status based on total paid
    let paymentStatus: TransactionData['paymentStatus'] = 'pending'
    if (totalPaid >= transaction.amount) {
      paymentStatus = 'paid'
    } else if (totalPaid > 0) {
      paymentStatus = 'partial'
    }
    
    const updatedTransaction = {
      ...transaction,
      payments: updatedPayments,
      paymentStatus,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(transactionKey, updatedTransaction)
    
    return c.json({ 
      success: true, 
      data: newPayment,
      message: 'Payment added successfully'
    })
  } catch (error) {
    console.log('Error adding payment:', error)
    return c.json({ success: false, error: 'Failed to add payment' }, 500)
  }
})

// Send invoice via WhatsApp
transactionRoutes.post('/:id/send-invoice', async (c) => {
  try {
    const transactionId = c.req.param('id')
    const { whatsappNumber, customBranding } = await c.req.json()
    const transactionKey = `transaction_${transactionId}`
    
    const transaction = await kv.get(transactionKey)
    if (!transaction) {
      return c.json({ success: false, error: 'Transaction not found' }, 404)
    }
    
    // Generate invoice message
    const invoiceMessage = generateInvoiceMessage(transaction, customBranding)
    
    // In a real implementation, this would integrate with WhatsApp Business API
    // For now, we'll simulate the sending and mark as sent
    console.log(`Sending invoice to ${whatsappNumber}:`, invoiceMessage)
    
    // Update transaction to mark invoice as sent
    const updatedTransaction = {
      ...transaction,
      invoiceSent: true,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(transactionKey, updatedTransaction)
    
    return c.json({ 
      success: true, 
      message: 'Invoice sent successfully via WhatsApp'
    })
  } catch (error) {
    console.log('Error sending invoice:', error)
    return c.json({ success: false, error: 'Failed to send invoice' }, 500)
  }
})

// Get all expenses
transactionRoutes.get('/expenses', async (c) => {
  try {
    const expenses = await kv.getByPrefix('expense_') || []
    
    // Sort by date, newest first
    const sortedExpenses = expenses.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    return c.json({ 
      success: true, 
      data: sortedExpenses
    })
  } catch (error) {
    console.log('Error fetching expenses:', error)
    return c.json({ success: false, error: 'Failed to fetch expenses' }, 500)
  }
})

// Create new expense
transactionRoutes.post('/expenses', async (c) => {
  try {
    const expenseData = await c.req.json()
    const expenseId = `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newExpense: ExpenseRecord = {
      id: expenseId.replace('expense_', ''),
      driverId: expenseData.driverId || `driver_${Date.now()}`,
      ...expenseData,
      status: 'pending'
    }
    
    await kv.set(expenseId, newExpense)
    
    return c.json({ 
      success: true, 
      data: newExpense,
      message: 'Expense recorded successfully'
    })
  } catch (error) {
    console.log('Error creating expense:', error)
    return c.json({ success: false, error: 'Failed to create expense' }, 500)
  }
})

// Update expense (approve/reject)
transactionRoutes.put('/expenses/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const updates = await c.req.json()
    const expenseKey = `expense_${id}`
    
    const existingExpense = await kv.get(expenseKey)
    if (!existingExpense) {
      return c.json({ success: false, error: 'Expense not found' }, 404)
    }
    
    const updatedExpense = {
      ...existingExpense,
      ...updates
    }
    
    await kv.set(expenseKey, updatedExpense)
    
    return c.json({ 
      success: true, 
      data: updatedExpense,
      message: 'Expense updated successfully'
    })
  } catch (error) {
    console.log('Error updating expense:', error)
    return c.json({ success: false, error: 'Failed to update expense' }, 500)
  }
})

// Get all R2R transactions
transactionRoutes.get('/r2r', async (c) => {
  try {
    const r2rTransactions = await kv.getByPrefix('r2r_') || []
    
    // Sort by creation date, newest first
    const sortedR2R = r2rTransactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    
    return c.json({ 
      success: true, 
      data: sortedR2R
    })
  } catch (error) {
    console.log('Error fetching R2R transactions:', error)
    return c.json({ success: false, error: 'Failed to fetch R2R transactions' }, 500)
  }
})

// Create new R2R transaction
transactionRoutes.post('/r2r', async (c) => {
  try {
    const r2rData = await c.req.json()
    const r2rId = `r2r_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newR2R: R2RTransaction = {
      id: r2rId.replace('r2r_', ''),
      ...r2rData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(r2rId, newR2R)
    
    return c.json({ 
      success: true, 
      data: newR2R,
      message: 'R2R transaction created successfully'
    })
  } catch (error) {
    console.log('Error creating R2R transaction:', error)
    return c.json({ success: false, error: 'Failed to create R2R transaction' }, 500)
  }
})

// Update R2R transaction
transactionRoutes.put('/r2r/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const updates = await c.req.json()
    const r2rKey = `r2r_${id}`
    
    const existingR2R = await kv.get(r2rKey)
    if (!existingR2R) {
      return c.json({ success: false, error: 'R2R transaction not found' }, 404)
    }
    
    const updatedR2R = {
      ...existingR2R,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    await kv.set(r2rKey, updatedR2R)
    
    return c.json({ 
      success: true, 
      data: updatedR2R,
      message: 'R2R transaction updated successfully'
    })
  } catch (error) {
    console.log('Error updating R2R transaction:', error)
    return c.json({ success: false, error: 'Failed to update R2R transaction' }, 500)
  }
})

// Get transaction statistics
transactionRoutes.get('/stats', async (c) => {
  try {
    const transactions = await kv.getByPrefix('transaction_') || []
    const expenses = await kv.getByPrefix('expense_') || []
    const r2rTransactions = await kv.getByPrefix('r2r_') || []
    
    const totalRevenue = transactions.reduce((sum, t) => {
      const totalPaid = (t.payments || []).reduce((pSum: number, p: any) => pSum + p.amount, 0)
      return sum + totalPaid
    }, 0)
    
    const totalExpenses = expenses
      .filter((e: any) => e.status === 'approved')
      .reduce((sum: number, e: any) => sum + e.amount, 0)
    
    const r2rProfit = r2rTransactions.reduce((sum: number, r: any) => sum + (r.profit || 0), 0)
    
    const stats = {
      totalTransactions: transactions.length,
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses + r2rProfit,
      pendingPayments: transactions.filter((t: any) => t.paymentStatus !== 'paid').length,
      pendingExpenses: expenses.filter((e: any) => e.status === 'pending').length,
      activeR2R: r2rTransactions.filter((r: any) => r.status === 'active').length,
      r2rProfit
    }
    
    return c.json({ 
      success: true, 
      data: stats
    })
  } catch (error) {
    console.log('Error fetching transaction stats:', error)
    return c.json({ success: false, error: 'Failed to fetch transaction statistics' }, 500)
  }
})

// Helper function to generate invoice message
function generateInvoiceMessage(transaction: TransactionData, customBranding: boolean = false) {
  const branding = customBranding ? 
    "🚗 *PREMIUM RENTAL SERVICES* 🚗" : 
    "🚗 *FLEET MANAGEMENT SYSTEM* 🚗"
  
  const totalPaid = (transaction.payments || []).reduce((sum, p) => sum + p.amount, 0)
  const outstanding = transaction.amount - totalPaid
  
  return `${branding}

📋 *INVOICE: ${transaction.invoiceNumber}*

👤 Pelanggan: ${transaction.customerName}
🚙 Kendaraan: ${transaction.vehicleName}
📅 Tanggal: ${new Date(transaction.createdAt).toLocaleDateString('id-ID')}

💰 *RINCIAN PEMBAYARAN:*
• Total Amount: Rp ${transaction.amount.toLocaleString()}
• Terbayar: Rp ${totalPaid.toLocaleString()}
• Sisa: Rp ${outstanding.toLocaleString()}

${transaction.notes ? `📝 Catatan: ${transaction.notes}` : ''}

Terima kasih atas kepercayaan Anda! 🙏

---
💬 *Hubungi kami untuk pertanyaan lebih lanjut*`
}

export default transactionRoutes