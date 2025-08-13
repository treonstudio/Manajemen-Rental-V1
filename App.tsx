import { useState } from "react"
import { AuthProvider, useAuth } from "./components/AuthContext"
import { LoginForm } from "./components/LoginForm"
import { VehicleManagementLayout } from "./components/VehicleManagementLayout"
import { VehicleInventory } from "./components/VehicleInventory"
import { RealTimeMonitoring } from "./components/RealTimeMonitoring"
import { UnitCondition } from "./components/UnitCondition"
import { PriorityManagement } from "./components/PriorityManagement"
import { PerformanceReports } from "./components/PerformanceReports"
import { ScheduleManagement } from "./components/ScheduleManagement"
import { TransactionManagement } from "./components/TransactionManagement"
import { CustomerManagement } from "./components/CustomerManagement"
import { DriverManagement } from "./components/DriverManagement"
import { FinancialReports } from "./components/FinancialReports"
import { Dashboard } from "./components/Dashboard"
import { CommunicationSettings } from "./components/CommunicationSettings"
import { UserManagement } from "./components/UserManagement"
import { SupportHelp } from "./components/SupportHelp"
import { PublicVehicleSearch } from "./components/PublicVehicleSearch"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Settings, Shield, Car, Users, BarChart3 } from "lucide-react"

function AppContent() {
  const { user, isLoading, hasPermission } = useAuth()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [showPublicSearch, setShowPublicSearch] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show public search if user requested it or not logged in
  if (showPublicSearch || !user) {
    return (
      <div>
        {/* Navigation Bar for Public/Admin Toggle */}
        <div className="bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Car className="h-6 w-6 text-blue-600" />
              <span className="text-xl">RentalCar Pro</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showPublicSearch ? "default" : "outline"}
                onClick={() => setShowPublicSearch(true)}
                className="flex items-center gap-2"
              >
                <Car className="h-4 w-4" />
                Sewa Mobil
              </Button>
              <Button
                variant={!showPublicSearch ? "default" : "outline"}
                onClick={() => setShowPublicSearch(false)}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Admin Login
              </Button>
            </div>
          </div>
        </div>

        {showPublicSearch ? (
          <PublicVehicleSearch />
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <h1 className="text-2xl">Admin Panel</h1>
                </div>
                <p className="text-gray-600">
                  Masuk untuk mengakses sistem manajemen armada
                </p>
              </div>
              <LoginForm />
              <div className="mt-6 text-center">
                <Button
                  variant="link"
                  onClick={() => setShowPublicSearch(true)}
                  className="text-blue-600"
                >
                  ← Kembali ke halaman sewa mobil
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />
      case "inventory":
        return hasPermission("vehicle_management") ? <VehicleInventory /> : <AccessDenied />
      case "monitoring":
        return hasPermission("vehicle_management") ? <RealTimeMonitoring /> : <AccessDenied />
      case "condition":
        return hasPermission("vehicle_management") ? <UnitCondition /> : <AccessDenied />
      case "priority":
        return hasPermission("vehicle_management") ? <PriorityManagement /> : <AccessDenied />
      case "reports":
        return hasPermission("reports_view") ? <PerformanceReports /> : <AccessDenied />
      case "schedule":
        return hasPermission("schedule_management") ? <ScheduleManagement /> : <AccessDenied />
      case "transactions":
        return hasPermission("transaction_management") ? <TransactionManagement /> : <AccessDenied />
      case "customers":
        return hasPermission("customer_management") ? <CustomerManagement /> : <AccessDenied />
      case "drivers":
        return hasPermission("driver_management") ? <DriverManagement /> : <AccessDenied />
      case "financial":
        return hasPermission("financial_reports") ? <FinancialReports /> : <AccessDenied />
      case "communication":
        return hasPermission("communication_settings") ? <CommunicationSettings /> : <AccessDenied />
      case "users":
        return hasPermission("user_management") ? <UserManagement /> : <AccessDenied />
      case "support":
        return <SupportHelp />
      case "settings":
        return hasPermission("system_settings") ? <SystemSettings /> : <AccessDenied />
      case "public_search":
        return <PublicVehicleSearch />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <VehicleManagementLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onPublicSearch={() => setShowPublicSearch(true)}
      >
        {renderContent()}
      </VehicleManagementLayout>
    </div>
  )
}

function AccessDenied() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Shield className="h-5 w-5" />
          Akses Ditolak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg mb-2">Tidak Memiliki Izin</h3>
          <p className="text-muted-foreground">
            Anda tidak memiliki izin untuk mengakses halaman ini.
            Hubungi administrator untuk mendapatkan akses.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function SystemSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Pengaturan Sistem
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p>Halaman pengaturan sistem akan tersedia di sini:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Konfigurasi GPS</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pengaturan tracking GPS kendaraan
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notifikasi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Konfigurasi sistem notifikasi
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Integrasi API</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pengaturan integrasi API eksternal
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Backup & Restore</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manajemen backup dan restore data
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}