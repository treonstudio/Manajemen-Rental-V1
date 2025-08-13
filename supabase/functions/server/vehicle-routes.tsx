import { Hono } from 'npm:hono'
import * as kv from './kv_store.tsx'
import { verifyUser } from './auth.tsx'

const vehicleRoutes = new Hono()

// Mock vehicle data
const mockVehicles = [
  {
    id: '1',
    name: 'Toyota Avanza',
    licensePlate: 'B 1234 CD',
    category: 'MPV',
    status: 'booked',
    dailyRate: 300000,
    location: 'Jakarta',
    fuel: 85,
    mileage: 45230,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Honda City',
    licensePlate: 'B 5678 EF',
    category: 'City Car',
    status: 'available',
    dailyRate: 250000,
    location: 'Jakarta',
    fuel: 92,
    mileage: 23450,
    createdAt: '2024-02-20T14:30:00Z'
  }
]

// Get all vehicles
vehicleRoutes.get('/', async (c) => {
  try {
    let vehicles = await kv.get('vehicles')
    
    if (!vehicles) {
      vehicles = mockVehicles
      await kv.set('vehicles', vehicles)
    }

    return c.json({ success: true, data: vehicles })
  } catch (error) {
    console.log('Error fetching vehicles:', error)
    return c.json({ success: true, data: mockVehicles })
  }
})

// Create new vehicle
vehicleRoutes.post('/', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { user, error: authError } = await verifyUser(accessToken)
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const vehicleData = await c.req.json()
    let vehicles = await kv.get('vehicles') || mockVehicles
    
    const newVehicle = {
      id: (vehicles.length + 1).toString(),
      ...vehicleData,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      status: 'available',
      priority: false
    }
    
    vehicles.push(newVehicle)
    await kv.set('vehicles', vehicles)
    
    return c.json({ success: true, data: newVehicle, message: 'Vehicle created successfully' })
  } catch (error) {
    console.log('Error creating vehicle:', error)
    return c.json({ success: false, error: 'Failed to create vehicle' }, 500)
  }
})

// Update vehicle
vehicleRoutes.put('/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { user, error: authError } = await verifyUser(accessToken)
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const vehicleId = c.req.param('id')
    const updates = await c.req.json()
    
    let vehicles = await kv.get('vehicles') || mockVehicles
    const vehicleIndex = vehicles.findIndex((v: any) => v.id === vehicleId)
    
    if (vehicleIndex === -1) {
      return c.json({ success: false, error: 'Vehicle not found' }, 404)
    }
    
    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    }
    
    await kv.set('vehicles', vehicles)
    return c.json({ success: true, data: vehicles[vehicleIndex], message: 'Vehicle updated successfully' })
  } catch (error) {
    console.log('Error updating vehicle:', error)
    return c.json({ success: false, error: 'Failed to update vehicle' }, 500)
  }
})

// Get vehicle statuses (for real-time monitoring)
vehicleRoutes.get('/statuses', async (c) => {
  try {
    let vehicles = await kv.get('vehicles') || mockVehicles
    let statuses = await kv.get('vehicle_statuses') || []
    
    const vehicleStatuses = vehicles.map((vehicle: any) => {
      const status = statuses.find((s: any) => s.vehicleId === vehicle.id)
      return {
        ...vehicle,
        location: status?.location || 'Jakarta',
        battery: status?.battery || Math.floor(Math.random() * 100),
        signal: status?.signal || Math.floor(Math.random() * 100),
        lastUpdate: status?.lastUpdate || new Date().toISOString(),
        gpsCoordinates: status?.gpsCoordinates || { 
          lat: -6.2088 + (Math.random() - 0.5) * 0.1, 
          lng: 106.8456 + (Math.random() - 0.5) * 0.1 
        },
        driver: status?.driver || null,
        eta: status?.eta || null
      }
    })
    
    return c.json({ success: true, data: vehicleStatuses })
  } catch (error) {
    console.log('Error fetching vehicle statuses:', error)
    const mockStatuses = mockVehicles.map(vehicle => ({
      ...vehicle,
      location: 'Jakarta',
      battery: Math.floor(Math.random() * 100),
      signal: Math.floor(Math.random() * 100),
      lastUpdate: new Date().toISOString(),
      gpsCoordinates: { 
        lat: -6.2088 + (Math.random() - 0.5) * 0.1, 
        lng: 106.8456 + (Math.random() - 0.5) * 0.1 
      },
      driver: null,
      eta: null
    }))
    return c.json({ success: true, data: mockStatuses })
  }
})

// Update vehicle status
vehicleRoutes.patch('/:id/status', async (c) => {
  try {
    const vehicleId = c.req.param('id')
    const statusData = await c.req.json()
    
    let statuses = await kv.get('vehicle_statuses') || []
    const statusIndex = statuses.findIndex((s: any) => s.vehicleId === vehicleId)
    
    const newStatus = {
      vehicleId,
      ...statusData,
      lastUpdate: new Date().toISOString()
    }
    
    if (statusIndex !== -1) {
      statuses[statusIndex] = newStatus
    } else {
      statuses.push(newStatus)
    }
    
    await kv.set('vehicle_statuses', statuses)
    return c.json({ success: true, data: newStatus, message: 'Vehicle status updated successfully' })
  } catch (error) {
    console.log('Error updating vehicle status:', error)
    return c.json({ success: false, error: 'Failed to update vehicle status' }, 500)
  }
})

export default vehicleRoutes