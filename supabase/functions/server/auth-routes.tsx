import { Hono } from 'npm:hono'
import * as kv from './kv_store.tsx'

const authRoutes = new Hono()

// Mock users for authentication
const mockAuthUsers = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'owner@demo.com',
    password: 'password123',
    role: 'owner',
    isActive: true
  },
  {
    id: '2',
    name: 'Admin Utama',
    email: 'admin@demo.com',
    password: 'password123',
    role: 'admin',
    isActive: true
  },
  {
    id: '3',
    name: 'Kasir Satu',
    email: 'kasir@demo.com',
    password: 'password123',
    role: 'cashier',
    isActive: true
  },
  {
    id: '4',
    name: 'CS Support',
    email: 'cs@demo.com',
    password: 'password123',
    role: 'customer_service',
    isActive: true
  },
  {
    id: '5',
    name: 'Manajer Operasional',
    email: 'manager@demo.com',
    password: 'password123',
    role: 'manager',
    isActive: true
  },
  {
    id: '6',
    name: 'Staff Keuangan',
    email: 'finance@demo.com',
    password: 'password123',
    role: 'financial_staff',
    isActive: true
  }
]

// Generate a simple token (in production, use proper JWT)
function generateToken(userId: string): string {
  return `token_${userId}_${Date.now()}`
}

// Login endpoint
authRoutes.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    // Find user by email and password
    const user = mockAuthUsers.find(u => 
      u.email === email && u.password === password && u.isActive
    )

    if (!user) {
      return c.json({ 
        error: 'Invalid email or password', 
        success: false 
      }, 401)
    }

    // Generate token
    const token = generateToken(user.id)
    
    // Store session
    await kv.set(`session_${token}`, {
      userId: user.id,
      email: user.email,
      role: user.role,
      loginTime: new Date().toISOString()
    })

    // Update last login
    let users = await kv.get('users') || []
    const userIndex = users.findIndex((u: any) => u.email === email)
    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date().toISOString()
      await kv.set('users', users)
    }

    return c.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      },
      success: true
    })
  } catch (error) {
    console.log('Login error:', error)
    return c.json({ 
      error: 'Internal server error', 
      success: false 
    }, 500)
  }
})

// Get current user info
authRoutes.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided', success: false }, 401)
    }

    const token = authHeader.split(' ')[1]
    const session = await kv.get(`session_${token}`)

    if (!session) {
      return c.json({ error: 'Invalid token', success: false }, 401)
    }

    // Find user details
    const user = mockAuthUsers.find(u => u.id === session.userId)
    if (!user || !user.isActive) {
      return c.json({ error: 'User not found or inactive', success: false }, 401)
    }

    return c.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      },
      success: true
    })
  } catch (error) {
    console.log('Get user error:', error)
    return c.json({ 
      error: 'Internal server error', 
      success: false 
    }, 500)
  }
})

// Logout endpoint
authRoutes.post('/logout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      await kv.del(`session_${token}`)
    }

    return c.json({ success: true })
  } catch (error) {
    console.log('Logout error:', error)
    return c.json({ 
      error: 'Internal server error', 
      success: false 
    }, 500)
  }
})

export default authRoutes