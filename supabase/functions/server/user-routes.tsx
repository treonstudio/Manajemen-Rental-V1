import { Hono } from 'npm:hono'
import * as kv from './kv_store.tsx'

const userRoutes = new Hono()

// Mock data untuk development
const mockUsers = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'owner@demo.com',
    role: 'owner',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-08-11T08:00:00Z',
    permissions: ['all_access']
  },
  {
    id: '2',
    name: 'Admin Utama',
    email: 'admin@demo.com',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-08-10T15:30:00Z',
    permissions: ['dashboard', 'vehicle_management', 'schedule_management']
  },
  {
    id: '3',
    name: 'Kasir Satu',
    email: 'kasir@demo.com',
    role: 'cashier',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: '2024-08-09T09:15:00Z',
    permissions: ['dashboard', 'transaction_management', 'financial_reports']
  },
  {
    id: '4',
    name: 'CS Support',
    email: 'cs@demo.com',
    role: 'customer_service',
    isActive: true,
    createdAt: '2024-02-15T00:00:00Z',
    lastLogin: '2024-08-08T14:20:00Z',
    permissions: ['dashboard', 'customer_management', 'schedule_management']
  },
  {
    id: '5',
    name: 'Manajer Operasional',
    email: 'manager@demo.com',
    role: 'manager',
    isActive: false,
    createdAt: '2024-03-01T00:00:00Z',
    lastLogin: '2024-08-05T11:45:00Z',
    permissions: ['dashboard', 'vehicle_management', 'driver_management']
  }
]

const mockPermissions = [
  { id: '1', name: 'dashboard', description: 'Akses dashboard utama', category: 'general' },
  { id: '2', name: 'vehicle_management', description: 'Kelola kendaraan dan inventaris', category: 'vehicle' },
  { id: '3', name: 'schedule_management', description: 'Kelola jadwal sewa', category: 'schedule' },
  { id: '4', name: 'transaction_management', description: 'Kelola transaksi', category: 'transaction' },
  { id: '5', name: 'customer_management', description: 'Kelola data pelanggan', category: 'customer' },
  { id: '6', name: 'driver_management', description: 'Kelola data sopir', category: 'driver' },
  { id: '7', name: 'financial_reports', description: 'Akses laporan keuangan', category: 'reports' },
  { id: '8', name: 'user_management', description: 'Kelola pengguna sistem', category: 'admin' },
  { id: '9', name: 'system_settings', description: 'Pengaturan sistem', category: 'admin' },
  { id: '10', name: 'communication_settings', description: 'Pengaturan komunikasi', category: 'communication' }
]

// Get all users
userRoutes.get('/', async (c) => {
  try {
    let users = await kv.get('users')
    
    if (!users) {
      users = mockUsers
      await kv.set('users', users)
    }

    return c.json({ users, success: true })
  } catch (error) {
    console.log('Error fetching users:', error)
    return c.json({ users: mockUsers, success: true })
  }
})

// Get permissions
userRoutes.get('/permissions', async (c) => {
  try {
    let permissions = await kv.get('permissions')
    
    if (!permissions) {
      permissions = mockPermissions
      await kv.set('permissions', permissions)
    }

    return c.json({ permissions, success: true })
  } catch (error) {
    console.log('Error fetching permissions:', error)
    return c.json({ permissions: mockPermissions, success: true })
  }
})

// Create new user
userRoutes.post('/', async (c) => {
  try {
    const userData = await c.req.json()
    let users = await kv.get('users') || mockUsers
    
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      isActive: true,
      createdAt: new Date().toISOString(),
      permissions: userData.permissions || []
    }

    users.push(newUser)
    await kv.set('users', users)

    return c.json({ user: newUser, success: true })
  } catch (error) {
    console.log('Error creating user:', error)
    return c.json({ error: 'Failed to create user', success: false }, 500)
  }
})

// Update user
userRoutes.put('/:id', async (c) => {
  try {
    const userId = c.req.param('id')
    const userData = await c.req.json()
    let users = await kv.get('users') || mockUsers
    
    const userIndex = users.findIndex((u: any) => u.id === userId)
    if (userIndex === -1) {
      return c.json({ error: 'User not found', success: false }, 404)
    }

    users[userIndex] = {
      ...users[userIndex],
      name: userData.name,
      email: userData.email,
      role: userData.role,
      permissions: userData.permissions
    }

    await kv.set('users', users)

    return c.json({ user: users[userIndex], success: true })
  } catch (error) {
    console.log('Error updating user:', error)
    return c.json({ error: 'Failed to update user', success: false }, 500)
  }
})

// Update user status
userRoutes.patch('/:id/status', async (c) => {
  try {
    const userId = c.req.param('id')
    const { isActive } = await c.req.json()
    let users = await kv.get('users') || mockUsers
    
    const userIndex = users.findIndex((u: any) => u.id === userId)
    if (userIndex === -1) {
      return c.json({ error: 'User not found', success: false }, 404)
    }

    users[userIndex].isActive = isActive
    await kv.set('users', users)

    return c.json({ user: users[userIndex], success: true })
  } catch (error) {
    console.log('Error updating user status:', error)
    return c.json({ error: 'Failed to update user status', success: false }, 500)
  }
})

// Delete user
userRoutes.delete('/:id', async (c) => {
  try {
    const userId = c.req.param('id')
    let users = await kv.get('users') || mockUsers
    
    const filteredUsers = users.filter((u: any) => u.id !== userId)
    await kv.set('users', filteredUsers)

    return c.json({ success: true })
  } catch (error) {
    console.log('Error deleting user:', error)
    return c.json({ error: 'Failed to delete user', success: false }, 500)
  }
})

export default userRoutes