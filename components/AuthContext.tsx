import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { apiClient } from "../utils/api-client"

interface User {
  id: string
  name: string
  email: string
  role: 'owner' | 'manager' | 'admin' | 'cashier' | 'customer_service' | 'financial_staff'
  permissions: string[]
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
  hasRole: (roles: string | string[]) => boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const rolePermissions = {
  owner: [
    'all_access', 'user_management', 'system_settings', 'financial_reports',
    'vehicle_management', 'transaction_management', 'customer_management',
    'driver_management', 'schedule_management', 'communication_settings',
    'dashboard', 'vehicle_view', 'schedule_view', 'customer_view', 'transaction_view', 'reports_view'
  ],
  manager: [
    'dashboard', 'vehicle_management', 'schedule_management', 'customer_management',
    'driver_management', 'transaction_view', 'reports_view', 'communication_view',
    'vehicle_view', 'schedule_view', 'customer_view'
  ],
  admin: [
    'dashboard', 'vehicle_management', 'schedule_management', 'customer_management',
    'driver_management', 'transaction_management', 'reports_view',
    'vehicle_view', 'schedule_view', 'customer_view', 'transaction_view'
  ],
  cashier: [
    'dashboard', 'transaction_management', 'financial_reports', 'customer_view',
    'schedule_view', 'transaction_view', 'reports_view'
  ],
  customer_service: [
    'dashboard', 'customer_management', 'schedule_management', 'communication_settings',
    'vehicle_view', 'customer_view', 'schedule_view'
  ],
  financial_staff: [
    'dashboard', 'financial_reports', 'transaction_view', 'reports_view',
    'customer_view', 'schedule_view'
  ]
}

// Demo users that match the credentials shown in LoginForm
const mockUsers = [
  {
    id: "1",
    name: "Owner User",
    email: "owner@demo.com",
    role: "owner" as const,
    isActive: true,
    password: "password123"
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@demo.com",
    role: "admin" as const,
    isActive: true,
    password: "password123"
  },
  {
    id: "3",
    name: "Kasir User",
    email: "kasir@demo.com",
    role: "cashier" as const,
    isActive: true,
    password: "password123"
  }
]

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (token) {
          const mockUser = mockUsers.find(u => u.email === localStorage.getItem('userEmail'))
          if (mockUser) {
            setUser({
              ...mockUser,
              permissions: rolePermissions[mockUser.role] || []
            })
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('userEmail')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = mockUsers.find(u => u.email === email && u.password === password)
      
      if (user) {
        localStorage.setItem('authToken', 'mock-token-' + user.id)
        localStorage.setItem('userEmail', user.email)
        setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          permissions: rolePermissions[user.role] || []
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userEmail')
    setUser(null)
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (user.role === 'owner') return true
    return user.permissions.includes(permission) || user.permissions.includes('all_access')
  }

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    hasPermission,
    hasRole,
    isLoading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}