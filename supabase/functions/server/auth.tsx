import { Hono } from 'npm:hono'
import { createClient } from 'npm:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

export async function verifyUser(accessToken: string | undefined) {
  if (!accessToken) {
    return { user: null, error: 'No access token provided' }
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken)
  
  if (!user?.id) {
    return { user: null, error: 'Invalid or expired token' }
  }

  return { user, error: null }
}

export async function signupUser(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { name },
    // Automatically confirm the user's email since an email server hasn't been configured.
    email_confirm: true
  })

  return { data, error }
}

// Auth routes
const authRoutes = new Hono()

// Sign up route
authRoutes.post('/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()
    
    if (!email || !password || !name) {
      return c.json({ 
        success: false, 
        error: 'Email, password, and name are required' 
      }, 400)
    }

    const { data, error } = await signupUser(email, password, name)
    
    if (error) {
      console.log('Signup error:', error)
      return c.json({ 
        success: false, 
        error: error.message || 'Failed to create user' 
      }, 400)
    }

    return c.json({ 
      success: true, 
      data: { 
        user: data.user,
        message: 'User created successfully' 
      }
    })
  } catch (error) {
    console.log('Signup route error:', error)
    return c.json({ 
      success: false, 
      error: 'Internal server error' 
    }, 500)
  }
})

// Verify user route
authRoutes.get('/verify', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { user, error } = await verifyUser(accessToken)
    
    if (error) {
      return c.json({ 
        success: false, 
        error 
      }, 401)
    }

    return c.json({ 
      success: true, 
      data: { user }
    })
  } catch (error) {
    console.log('Verify route error:', error)
    return c.json({ 
      success: false, 
      error: 'Internal server error' 
    }, 500)
  }
})

// Get user profile route
authRoutes.get('/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { user, error } = await verifyUser(accessToken)
    
    if (error) {
      return c.json({ 
        success: false, 
        error 
      }, 401)
    }

    return c.json({ 
      success: true, 
      data: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        created_at: user.created_at
      }
    })
  } catch (error) {
    console.log('Profile route error:', error)
    return c.json({ 
      success: false, 
      error: 'Internal server error' 
    }, 500)
  }
})

export { authRoutes }