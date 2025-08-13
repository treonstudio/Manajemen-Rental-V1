import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Users, UserPlus, Edit, Trash2, Shield, Eye, EyeOff } from "lucide-react"
import { Switch } from "./ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { apiClient } from "../utils/api-client"

interface User {
  id: string
  name: string
  email: string
  role: 'owner' | 'manager' | 'admin' | 'cashier' | 'customer_service' | 'financial_staff'
  isActive: boolean
  createdAt: string
  lastLogin?: string
  permissions: string[]
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

const roleLabels = {
  owner: "Owner",
  manager: "Manajer",
  admin: "Admin",
  cashier: "Kasir",
  customer_service: "Customer Service",
  financial_staff: "Staff Keuangan"
}

const roleColors = {
  owner: "bg-purple-100 text-purple-800",
  manager: "bg-blue-100 text-blue-800",
  admin: "bg-green-100 text-green-800",
  cashier: "bg-yellow-100 text-yellow-800",
  customer_service: "bg-pink-100 text-pink-800",
  financial_staff: "bg-orange-100 text-orange-800"
}

const defaultPermissions = {
  owner: [
    'all_access', 'user_management', 'system_settings', 'financial_reports',
    'vehicle_management', 'transaction_management', 'customer_management',
    'driver_management', 'schedule_management', 'communication_settings'
  ],
  manager: [
    'dashboard', 'vehicle_management', 'schedule_management', 'customer_management',
    'driver_management', 'transaction_view', 'reports_view', 'communication_view'
  ],
  admin: [
    'dashboard', 'vehicle_management', 'schedule_management', 'customer_management',
    'driver_management', 'transaction_management', 'reports_view'
  ],
  cashier: [
    'dashboard', 'transaction_management', 'financial_reports', 'customer_view',
    'schedule_view'
  ],
  customer_service: [
    'dashboard', 'customer_management', 'schedule_management', 'communication_settings',
    'vehicle_view'
  ],
  financial_staff: [
    'dashboard', 'financial_reports', 'transaction_view', 'reports_view'
  ]
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin" as User['role'],
    password: "",
    permissions: [] as string[]
  })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    loadUsers()
    loadPermissions()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await apiClient.getUsers()
      // Handle different response formats and ensure it's an array
      let usersData: User[] = []
      if (Array.isArray(response)) {
        usersData = response
      } else if (response && typeof response === 'object' && Array.isArray(response.data)) {
        usersData = response.data
      } else if (response && typeof response === 'object' && response !== null) {
        // If response is an object but not an array, try to extract user data
        usersData = []
      } else {
        console.warn('Unexpected response format:', response)
        usersData = []
      }
      
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
      // Use mock data on error
      const mockUsers: User[] = [
        {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
          lastLogin: "2024-01-22T10:30:00Z",
          permissions: defaultPermissions.admin
        },
        {
          id: "2", 
          name: "Manager User",
          email: "manager@example.com",
          role: "manager",
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
          lastLogin: "2024-01-21T15:45:00Z",
          permissions: defaultPermissions.manager
        },
        {
          id: "3",
          name: "Owner User", 
          email: "owner@example.com",
          role: "owner",
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
          lastLogin: "2024-01-22T09:15:00Z",
          permissions: defaultPermissions.owner
        }
      ]
      setUsers(mockUsers)
    } finally {
      setLoading(false)
    }
  }

  const loadPermissions = async () => {
    try {
      // Mock permissions data
      const mockPermissions: Permission[] = [
        { id: "1", name: "dashboard", description: "Access to dashboard", category: "general" },
        { id: "2", name: "vehicle_management", description: "Manage vehicles", category: "vehicles" },
        { id: "3", name: "user_management", description: "Manage users", category: "admin" },
        { id: "4", name: "financial_reports", description: "View financial reports", category: "reports" }
      ]
      setPermissions(mockPermissions)
    } catch (error) {
      console.error('Error loading permissions:', error)
    }
  }

  const handleSaveUser = async () => {
    try {
      const userData = {
        ...formData,
        permissions: formData.permissions.length > 0 ? formData.permissions : defaultPermissions[formData.role]
      }

      if (editingUser) {
        await apiClient.updateUser(editingUser.id, userData)
      } else {
        await apiClient.createUser(userData)
      }

      await loadUsers()
      setDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Gagal menyimpan pengguna')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await apiClient.deleteUser(userId)
      await loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Gagal menghapus pengguna')
    }
  }

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      await apiClient.updateUser(userId, { isActive })
      await loadUsers()
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('Gagal mengupdate status pengguna')
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "admin",
      password: "",
      permissions: []
    })
    setEditingUser(null)
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
      permissions: user.permissions
    })
    setDialogOpen(true)
  }

  const handleRoleChange = (role: User['role']) => {
    setFormData({
      ...formData,
      role,
      permissions: defaultPermissions[role]
    })
  }

  const roleStats = Array.isArray(users) ? users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {} as Record<string, number>) : {}

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Manajemen Pengguna & Hak Akses
          </h1>
          <p className="text-muted-foreground">
            Kelola pengguna sistem dan atur hak akses berdasarkan peran
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <UserPlus className="h-4 w-4 mr-2" />
              Tambah Pengguna
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList>
                <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
                <TabsTrigger value="permissions">Hak Akses</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="user@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="role">Peran</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="password">
                    {editingUser ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder={editingUser ? "Masukkan password baru" : "Masukkan password"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="permissions" className="space-y-4">
                <div>
                  <Label>Hak Akses Berdasarkan Peran</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Hak akses default untuk peran {roleLabels[formData.role]}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {defaultPermissions[formData.role]?.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{permission.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleSaveUser}>
                {editingUser ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(roleLabels).map(([role, label]) => (
          <Card key={role}>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl mb-1">{roleStats[role] || 0}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Login Terakhir</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(users) ? users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]}>
                      {roleLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={(checked) => handleToggleActive(user.id, checked)}
                      />
                      <span className="text-sm">
                        {user.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('id-ID') : 'Belum pernah'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Pengguna</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus pengguna {user.name}? 
                              Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Tidak ada data pengguna
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}