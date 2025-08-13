import { Hono } from 'npm:hono'
import * as kv from './kv_store.tsx'
import { verifyUser } from './auth.tsx'
import { uploadPhoto } from './storage.tsx'

const conditionRoutes = new Hono()

async function getConditionChecks(c) {
  try {
    const checks = await kv.getByPrefix('condition_check:')
    return c.json({ success: true, data: checks })
  } catch (error) {
    console.log('Error fetching condition checks:', error)
    return c.json({ success: false, error: 'Failed to fetch condition checks' }, 500)
  }
}

async function createConditionCheck(c) {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { user, error: authError } = await verifyUser(accessToken)
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const checkData = await c.req.json()
    const checkId = crypto.randomUUID()
    
    const conditionCheck = {
      id: checkId,
      ...checkData,
      date: new Date().toISOString(),
      inspector: user.email || 'Unknown',
      createdBy: user.id
    }
    
    await kv.set(`condition_check:${checkId}`, conditionCheck)
    return c.json({ success: true, data: conditionCheck })
  } catch (error) {
    console.log('Error creating condition check:', error)
    return c.json({ success: false, error: 'Failed to create condition check' }, 500)
  }
}

async function uploadConditionPhoto(c) {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { user, error: authError } = await verifyUser(accessToken)
    
    if (!user) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const checkId = c.req.param('id')
    const formData = await c.req.formData()
    const file = formData.get('photo') as File
    
    if (!file) {
      return c.json({ success: false, error: 'No file provided' }, 400)
    }
    
    const { data, error } = await uploadPhoto(file, checkId)
    
    if (error) {
      console.log('Photo upload error:', error)
      return c.json({ success: false, error: 'Failed to upload photo' }, 500)
    }
    
    return c.json({ success: true, data })
  } catch (error) {
    console.log('Error uploading photo:', error)
    return c.json({ success: false, error: 'Failed to upload photo' }, 500)
  }
}

// Routes
conditionRoutes.get('/', getConditionChecks)
conditionRoutes.post('/', createConditionCheck)
conditionRoutes.post('/:id/upload', uploadConditionPhoto)

export default conditionRoutes