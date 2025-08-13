import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'

import vehicleRoutes from './vehicle-routes.tsx'
import dashboardRoutes from './dashboard-routes.tsx'
import conditionRoutes from './condition-routes.tsx'
import scheduleRoutes from './schedule-routes.tsx'
import transactionRoutes from './transaction-routes.tsx'
import customerRoutes from './customer-routes.tsx'
import driverRoutes from './driver-routes.tsx'
import financialRoutes from './financial-routes.tsx'
import reportsRoutes from './reports-routes.tsx'
import communicationRoutes from './communication-routes.tsx'
import userRoutes from './user-routes.tsx'
import authRoutes from './auth-routes.tsx'
import supportRoutes from './support-routes.tsx'
import publicBookingRoutes from './public-booking-routes.tsx'

const app = new Hono()

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))
app.use('*', logger(console.log))

// Health check
app.get('/make-server-8c47b332/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Mount routes
app.route('/make-server-8c47b332/auth', authRoutes)
app.route('/make-server-8c47b332/vehicles', vehicleRoutes)
app.route('/make-server-8c47b332/dashboard', dashboardRoutes)
app.route('/make-server-8c47b332/conditions', conditionRoutes)
app.route('/make-server-8c47b332/schedules', scheduleRoutes)
app.route('/make-server-8c47b332/transactions', transactionRoutes)
app.route('/make-server-8c47b332/customers', customerRoutes)
app.route('/make-server-8c47b332/drivers', driverRoutes)
app.route('/make-server-8c47b332/financial', financialRoutes)
app.route('/make-server-8c47b332/reports', reportsRoutes)
app.route('/make-server-8c47b332/communication', communicationRoutes)
app.route('/make-server-8c47b332/users', userRoutes)
app.route('/make-server-8c47b332/support', supportRoutes)
app.route('/make-server-8c47b332/public-bookings', publicBookingRoutes)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error(`Error: ${err}`)
  return c.json({ error: 'Internal Server Error' }, 500)
})

Deno.serve(app.fetch)