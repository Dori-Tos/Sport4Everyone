import { z } from 'zod'

export const usersSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(), // Make password optional for updates
  confirmPassword: z.string().optional(), // For confirmation during updates
  administrator: z.coerce.boolean(),
  reservations: z.array(z.any()).optional(),
  contacts: z.array(z.any()).optional(),
  contactOf: z.array(z.any()).optional(),
  sportsCenters: z.array(z.any()).optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  administrator: z.coerce.boolean().default(false),
})

export const updateUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(), 
  confirmPassword: z.string().optional(),
})

export type User = z.infer<typeof usersSchema>
export type Login = z.infer<typeof loginSchema>
export type Register = z.infer<typeof registerSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>

export async function getUsers() {
  const res = await fetch('http://localhost:3000/api/users')
  return (await res.json()) as User[]
}

export async function loginUser(credentials: Login) {
  try {
    // Validate credentials
    const validatedCredentials = loginSchema.parse(credentials);
      
    // Create form data
    const formData = new URLSearchParams();
    formData.append("email", validatedCredentials.email);
    formData.append("password", validatedCredentials.password);
    
    // Send login request
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      credentials: "include" // Important for cookies
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to login");
    }

    const data = await res.json();
    const sessionId = await data.mobileToken;
    if (!sessionId) {
      throw new Error('Session ID not found in response');
    }
    
    const userData = await getUser();
    return [userData, sessionId];
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

export async function getUser() {
  try {
    const res = await fetch(`http://localhost:3000/api/users/getUser`, {
      method: 'GET',
      credentials: 'include',
    })
    if (!res.ok) {
      throw new Error('Failed to fetch user')
    }
    return (await res.json()) as User
  }
  catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function addUser(user: Register) {
  user = registerSchema.parse(user)

  const formData = new URLSearchParams()
  formData.append('name', user.name)
  formData.append('email', user.email)
  formData.append('password', user.password)
  formData.append('administrator', String(user.administrator))

  const res = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    body: formData,
  })
  return (await res.json()) as User
}

export async function removeUser(id: string) {
  const res = await fetch(`http://localhost:3000/api/users/${id}`, {
    method: 'DELETE',
  })
  return (await res.json()) as User
}

export async function updateUser(user: UpdateUser, sessionId: string) {
  try {
    user = updateUserSchema.parse(user)

    const res = await fetch(`http://localhost:3000/api/users/updateUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-mobile-token': sessionId,
      },
      body: JSON.stringify(user),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to update user')
    }

    return (await res.json()) as User
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}
