import { useState, useEffect } from "react"
import { FileText, Download, Calendar, DollarSign, TrendingUp, TrendingDown, AlertCircle, Users, Car, MapPin, Filter, Eye, Search, Printer, FileSpreadsheet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Separator } from "./ui/separator"
import { Progress } from "./ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import { apiClient } from "../utils/api-client"

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

export function FinancialReports() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Data states
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null)
  const [rentalSales, setRentalSales] = useState<RentalSalesReport[]>([])
  const [expenses, setExpenses] = useState<ExpenseReport[]>([])
  const [outstandingRentals, setOutstandingRentals] = useState<OutstandingRental[]>([])
  const [driverReports, setDriverReports] = useState<DriverReport[]>([])
  const [customerReports, setCustomerReports] = useState<CustomerReport[]>([])
  const [orderSourceReports, setOrderSourceReports] = useState<OrderSourceReport[]>([])

  useEffect(() => {
    loadFinancialData()
  }, [selectedPeriod, startDate, endDate])

  const loadFinancialData = async () => {
    setIsLoading(true)
    try {
      const [summaryRes, salesRes, expensesRes, outstandingRes, driverRes, customerRes, orderSourceRes] = await Promise.all([
        apiClient.get(`/reports/financial-summary?period=${selectedPeriod}&start=${startDate}&end=${endDate}`),
        apiClient.get(`/reports/rental-sales?period=${selectedPeriod}&start=${startDate}&end=${endDate}`),
        apiClient.get(`/reports/expenses?period=${selectedPeriod}&start=${startDate}&end=${endDate}`),
        apiClient.get(`/reports/outstanding-rentals`),
        apiClient.get(`/reports/driver-performance?period=${selectedPeriod}`),
        apiClient.get(`/reports/customer-analysis?period=${selectedPeriod}`),
        apiClient.get(`/reports/order-sources?period=${selectedPeriod}`)
      ])

      setFinancialSummary(summaryRes.data)
      setRentalSales(salesRes.data || [])
      setExpenses(expensesRes.data || [])
      setOutstandingRentals(outstandingRes.data || [])
      setDriverReports(driverRes.data || [])
      setCustomerReports(customerRes.data || [])
      setOrderSourceReports(orderSourceRes.data || [])
    } catch (error) {
      console.error('Error loading financial data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportPDF = async (reportType: string) => {
    try {
      const response = await apiClient.post('/reports/export/pdf', {
        reportType,
        period: selectedPeriod,
        startDate,
        endDate,
        filters: { category: selectedCategory, search: searchTerm }
      })
      
      if (response.success && response.data.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank')
      }
    } catch (error) {
      console.error('Error exporting PDF:', error)
    }
  }

  const handleExportExcel = async (reportType: string) => {
    try {
      const response = await apiClient.post('/reports/export/excel', {
        reportType,
        period: selectedPeriod,
        startDate,
        endDate,
        filters: { category: selectedCategory, search: searchTerm }
      })
      
      if (response.success && response.data.downloadUrl) {
        window.open(response.data.downloadUrl, '_blank')
      }
    } catch (error) {
      console.error('Error exporting Excel:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'Lunas', variant: 'default' as const },
      partial: { label: 'Sebagian', variant: 'secondary' as const },
      unpaid: { label: 'Belum Lunas', variant: 'destructive' as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unpaid
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getOutstandingStatusBadge = (status: string) => {
    const statusConfig = {
      overdue: { label: 'Terlambat', variant: 'destructive' as const },
      due_soon: { label: 'Jatuh Tempo', variant: 'secondary' as const },
      pending: { label: 'Pending', variant: 'secondary' as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      fuel: 'Bahan Bakar',
      maintenance: 'Perawatan',
      insurance: 'Asuransi',
      driver_expense: 'Expense Sopir',
      operational: 'Operasional',
      other: 'Lainnya'
    }
    return labels[category as keyof typeof labels] || category
  }

  const getCustomerValueBadge = (value: string) => {
    const valueConfig = {
      vip: { label: 'VIP', variant: 'default' as const },
      premium: { label: 'Premium', variant: 'secondary' as const },
      loyal: { label: 'Loyal', variant: 'secondary' as const },
      regular: { label: 'Regular', variant: 'outline' as const },
      new: { label: 'Baru', variant: 'outline' as const }
    }
    
    const config = valueConfig[value as keyof typeof valueConfig] || valueConfig.regular
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  // Filter data based on search and category
  const filteredRentalSales = rentalSales.filter(sale => {
    const matchesSearch = sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sale.driverName && sale.driverName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || sale.paymentStatus === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (expense.vehicleName && expense.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (expense.driverName && expense.driverName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredOutstanding = outstandingRentals.filter(rental => {
    const matchesSearch = rental.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rental.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || rental.status === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Chart data
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 45000000, expenses: 28000000, profit: 17000000 },
    { month: 'Feb', revenue: 38000000, expenses: 25000000, profit: 13000000 },
    { month: 'Mar', revenue: 52000000, expenses: 31000000, profit: 21000000 },
    { month: 'Apr', revenue: 48000000, expenses: 29000000, profit: 19000000 },
    { month: 'May', revenue: 61000000, expenses: 35000000, profit: 26000000 },
    { month: 'Jun', revenue: 55000000, expenses: 33000000, profit: 22000000 }
  ]

  const expenseBreakdownData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.category === expense.category)
    if (existing) {
      existing.amount += expense.amount
    } else {
      acc.push({
        category: getCategoryLabel(expense.category),
        amount: expense.amount
      })
    }
    return acc
  }, [] as any[])

  const orderSourceData = orderSourceReports.map(source => ({
    name: source.source,
    orders: source.totalOrders,
    revenue: source.totalRevenue,
    value: source.averageOrderValue
  }))

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="grid gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Laporan & Keuangan</h1>
          <p className="text-muted-foreground">
            Laporan keuangan lengkap dan analisis bisnis
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="quarter">Kuartal Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          
          {selectedPeriod === "custom" && (
            <>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </>
          )}
        </div>
      </div>

      {/* Financial Summary Cards */}
      {financialSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {formatCurrency(financialSummary.totalRevenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {financialSummary.totalRentals} sewa
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
                  <p className="text-2xl font-semibold text-red-600">
                    {formatCurrency(financialSummary.totalExpenses)}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Laba Bersih</p>
                  <p className="text-2xl font-semibold text-blue-600">
                    {formatCurrency(financialSummary.netProfit)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Margin: {financialSummary.profitMargin.toFixed(1)}%
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Piutang</p>
                  <p className="text-2xl font-semibold text-orange-600">
                    {formatCurrency(financialSummary.outstandingAmount)}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Penjualan</TabsTrigger>
          <TabsTrigger value="expenses">Pengeluaran</TabsTrigger>
          <TabsTrigger value="outstanding">Piutang</TabsTrigger>
          <TabsTrigger value="drivers">Per Sopir</TabsTrigger>
          <TabsTrigger value="customers">Per Customer</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tren Pendapatan & Laba</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExportPDF('revenue-trend')}>
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExportExcel('revenue-trend')}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(value), '']}
                    labelFormatter={(label) => `Bulan ${label}`}
                  />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Pendapatan" />
                  <Area type="monotone" dataKey="profit" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.8} name="Laba" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Breakdown Pengeluaran</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {expenseBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Order Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Sumber Order</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={orderSourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'revenue' ? formatCurrency(value) : value,
                        name === 'revenue' ? 'Revenue' : name === 'orders' ? 'Orders' : 'Avg Value'
                      ]}
                    />
                    <Bar dataKey="orders" fill="#3b82f6" name="orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Cari customer, kendaraan, atau sopir..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status Bayar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="paid">Lunas</SelectItem>
                    <SelectItem value="partial">Sebagian</SelectItem>
                    <SelectItem value="unpaid">Belum Lunas</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => handleExportPDF('rental-sales')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={() => handleExportExcel('rental-sales')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sales Table */}
          <Card>
            <CardHeader>
              <CardTitle>Laporan Penjualan Sewa</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Sopir</TableHead>
                    <TableHead>Sumber Order</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRentalSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{new Date(sale.date).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell className="font-medium">{sale.customerName}</TableCell>
                      <TableCell>{sale.vehicleName}</TableCell>
                      <TableCell>{sale.driverName || 'Self Drive'}</TableCell>
                      <TableCell>{sale.orderSource}</TableCell>
                      <TableCell>{formatCurrency(sale.amount)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(sale.paymentStatus)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(sale.profit)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Cari deskripsi, kendaraan, atau sopir..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="fuel">Bahan Bakar</SelectItem>
                    <SelectItem value="maintenance">Perawatan</SelectItem>
                    <SelectItem value="insurance">Asuransi</SelectItem>
                    <SelectItem value="driver_expense">Expense Sopir</SelectItem>
                    <SelectItem value="operational">Operasional</SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => handleExportPDF('expenses')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={() => handleExportExcel('expenses')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Expenses Table */}
          <Card>
            <CardHeader>
              <CardTitle>Laporan Kas & Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Sopir</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Approved By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.date).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getCategoryLabel(expense.category)}</Badge>
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.vehicleName || '-'}</TableCell>
                      <TableCell>{expense.driverName || '-'}</TableCell>
                      <TableCell className="text-red-600">{formatCurrency(expense.amount)}</TableCell>
                      <TableCell>{expense.approvedBy || 'System'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outstanding" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Cari customer atau kendaraan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="overdue">Terlambat</SelectItem>
                    <SelectItem value="due_soon">Jatuh Tempo</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => handleExportPDF('outstanding')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={() => handleExportExcel('outstanding')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Outstanding Rentals Table */}
          <Card>
            <CardHeader>
              <CardTitle>Laporan Sewa Belum Lunas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Periode Sewa</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Dibayar</TableHead>
                    <TableHead>Piutang</TableHead>
                    <TableHead>Overdue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Kontak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOutstanding.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell className="font-medium">{rental.customerName}</TableCell>
                      <TableCell>{rental.vehicleName}</TableCell>
                      <TableCell>
                        {new Date(rental.startDate).toLocaleDateString('id-ID')} - {new Date(rental.endDate).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>{formatCurrency(rental.totalAmount)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(rental.paidAmount)}</TableCell>
                      <TableCell className="text-red-600 font-medium">{formatCurrency(rental.outstandingAmount)}</TableCell>
                      <TableCell>
                        {rental.overdueDays > 0 ? (
                          <span className="text-red-600 font-medium">{rental.overdueDays} hari</span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{getOutstandingStatusBadge(rental.status)}</TableCell>
                      <TableCell className="text-sm">{rental.contactInfo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Laporan Per Sopir</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExportPDF('driver-reports')}>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExportExcel('driver-reports')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {driverReports.map((driver) => (
              <Card key={driver.driverId}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{driver.driverName}</h4>
                      <p className="text-sm text-muted-foreground">
                        ⭐ {driver.averageRating.toFixed(1)} • {driver.totalTrips} trips • {driver.totalDistance} km
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">{formatCurrency(driver.netEarnings)}</p>
                      <p className="text-sm text-muted-foreground">Net Earnings</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Earnings</p>
                      <p className="font-medium">{formatCurrency(driver.totalEarnings)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Expenses</p>
                      <p className="font-medium text-red-600">{formatCurrency(driver.totalExpenses)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fuel Cost</p>
                      <p className="font-medium">{formatCurrency(driver.fuelCost)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Maintenance</p>
                      <p className="font-medium">{formatCurrency(driver.maintenanceCost)}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profitability</span>
                      <span>{((driver.netEarnings / driver.totalEarnings) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(driver.netEarnings / driver.totalEarnings) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Laporan Per Customer</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExportPDF('customer-reports')}>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExportExcel('customer-reports')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {customerReports.map((customer) => (
              <Card key={customer.customerId}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-medium">{customer.customerName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {customer.totalRentals} sewa • Last: {new Date(customer.lastRentalDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      {getCustomerValueBadge(customer.customerValue)}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{formatCurrency(customer.totalSpent)}</p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Avg Rental Value</p>
                      <p className="font-medium">{formatCurrency(customer.averageRentalValue)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment Reliability</p>
                      <p className="font-medium">{(customer.paymentReliability * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Preferred Vehicles</p>
                      <p className="font-medium">{customer.preferredVehicles.slice(0, 2).join(', ')}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Customer Loyalty Score</span>
                      <span>{(customer.paymentReliability * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={customer.paymentReliability * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}