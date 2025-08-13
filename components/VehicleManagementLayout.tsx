import { useState } from "react"
import { useAuth } from "./AuthContext"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { ApiStatusIndicator } from "./ApiStatusIndicator"
import {
  BarChart3,
  Car,
  Calendar,
  Users,
  DollarSign,
  Settings,
  FileText,
  MapPin,
  Wrench,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  HelpCircle,
  LogOut,
  User,
  Globe,
  Search
} from "lucide-react"

interface VehicleManagementLayoutProps {
  children: React.ReactNode
  activeSection: string
  onSectionChange: (section: string) => void
  onPublicSearch?: () => void
}

export function VehicleManagementLayout({
  children,
  activeSection,
  onSectionChange,
  onPublicSearch
}: VehicleManagementLayoutProps) {
  const { user, logout, hasPermission } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      permission: null
    },
    {
      id: "inventory",
      label: "Inventaris Kendaraan",
      icon: Car,
      permission: "vehicle_management"
    },
    {
      id: "monitoring",
      label: "Monitoring Real-time",
      icon: MapPin,
      permission: "vehicle_management"
    },
    {
      id: "condition",
      label: "Kondisi Unit",
      icon: Wrench,
      permission: "vehicle_management"
    },
    {
      id: "priority",
      label: "Manajemen Prioritas",
      icon: AlertTriangle,
      permission: "vehicle_management"
    },
    {
      id: "schedule",
      label: "Jadwal Sewa",
      icon: Calendar,
      permission: "schedule_management"
    },
    {
      id: "transactions",
      label: "Transaksi Digital",
      icon: DollarSign,
      permission: "transaction_management"
    },
    {
      id: "customers",
      label: "Manajemen Pelanggan",
      icon: Users,
      permission: "customer_management"
    },
    {
      id: "drivers",
      label: "Manajemen Sopir",
      icon: User,
      permission: "driver_management"
    },
    {
      id: "reports",
      label: "Laporan Performa",
      icon: FileText,
      permission: "reports_view"
    },
    {
      id: "financial",
      label: "Laporan Keuangan",
      icon: DollarSign,
      permission: "financial_reports"
    },
    {
      id: "communication",
      label: "Komunikasi WhatsApp",
      icon: MessageSquare,
      permission: "communication_settings"
    },
    {
      id: "users",
      label: "Manajemen Pengguna",
      icon: ShieldCheck,
      permission: "user_management"
    },
    {
      id: "support",
      label: "Dukungan & Bantuan",
      icon: HelpCircle,
      permission: null
    },
    {
      id: "settings",
      label: "Pengaturan Sistem",
      icon: Settings,
      permission: "system_settings"
    }
  ]

  const visibleMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  )

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, { label: string; color: string }> = {
      owner: { label: "Owner", color: "bg-red-100 text-red-800" },
      manager: { label: "Manajer", color: "bg-blue-100 text-blue-800" },
      admin: { label: "Admin", color: "bg-green-100 text-green-800" },
      cashier: { label: "Kasir", color: "bg-yellow-100 text-yellow-800" },
      customer_service: { label: "Customer Service", color: "bg-purple-100 text-purple-800" },
      finance_staff: { label: "Staff Keuangan", color: "bg-orange-100 text-orange-800" }
    }
    return roleMap[role] || { label: role, color: "bg-gray-100 text-gray-800" }
  }

  const userRole = getRoleDisplay(user?.role || "")

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-3 py-2">
              <Car className="h-6 w-6 text-primary" />
              <span className="text-lg">RentalCar Pro</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <div className="p-3">
              <ApiStatusIndicator />
            </div>
            
            <SidebarMenu>
              {visibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <Separator className="my-2" />
              
              {onPublicSearch && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={onPublicSearch}
                    className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Halaman Publik</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="h-4 w-4" />
                  <div className="flex-1 text-left min-w-0">
                    <div className="truncate">{user?.name}</div>
                    <Badge className={`text-xs ${userRole.color}`}>
                      {userRole.label}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Pengaturan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-w-0">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger />
              <div className="flex-1" />
              {onPublicSearch && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPublicSearch}
                  className="hidden md:flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Lihat Halaman Publik
                </Button>
              )}
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}