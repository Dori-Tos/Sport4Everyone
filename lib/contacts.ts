import { z } from 'zod'


export const contactSchema = z.object({
  userId: z.number(),
  contactId: z.number(),
  contact: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
  }).optional(),
})

export type Contact = z.infer<typeof contactSchema>

export async function getContacts() {
  const res = await fetch('http://localhost:3000/api/contacts')
  return (await res.json()) as Contact[]
}

export async function addContact(contact: Contact) {
  contact = contactSchema.parse(contact)

  const formData = new URLSearchParams()
  formData.append('userId', String(contact.userId))
  formData.append('contactId', String(contact.contactId))
  formData.append('contact', JSON.stringify(contact.contact))

  const res = await fetch('http://localhost:3000/api/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  })
  return (await res.json()) as Contact
}

export async function removeContact(id: string) {
  const formData = new URLSearchParams()
  formData.append('id', String(id))

  const res = await fetch(`http://localhost:3000/api/contacts/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  })
  return (await res.json()) as Contact
}

export async function getContactsByUser(userId: string): Promise<Contact[]> {
  try {
    const res = await fetch(`http://localhost:3000/api/users/getContacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })

    return (await res.json()) as Contact[]
  } catch (error) {
    console.error("Error fetching contacts:", error)
    throw error
  }
}

export async function searchContacts(query: string): Promise<Contact[]> {
  try {
    
    const res = await fetch(`http://localhost:3000/api/users/searchContacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query }),
    })

    return (await res.json()) as Contact[]
  } catch (error) {
    console.error("Error searching contacts:", error)
    throw error
  }
}