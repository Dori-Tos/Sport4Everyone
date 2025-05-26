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
  try {
    contact = contactSchema.parse(contact)

    const res = await fetch('http://localhost:3000/api/contacts/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId: contact.userId,
        contactId: contact.contactId
      }),
    })
    if (res.ok){
      return (await res.json()) as Contact
    }
    else {
      const errorText = await res.text();
      throw new Error(`Bad response: ${res.status} ${res.statusText} - ${errorText}`);
    }
  } catch (error) {
    console.error("Error while creating new contact:", error);
    throw error;
  }
}

export async function removeContact(userId: number, contactId: number) {
  try {
    const res = await fetch(`http://localhost:3000/api/contacts/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, contactId }),
    })
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Bad response: ${res.status} ${res.statusText} - ${errorText}`);
    }
    
    // Check content type before parsing as JSON
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json() as Contact;
    } else {
      const text = await res.text();
      console.log('Received non-JSON response:', text.substring(0, 100) + '...');
      return { userId, contactId } as Contact; // Return a placeholder with the ids
    }
  } catch (error) {
    console.error("Error while deleting contact:", error)
    throw error
  }
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

export async function searchContacts(query: string, userId: number): Promise<Contact[]> {
  try {
    
    const res = await fetch(`http://localhost:3000/api/users/searchContacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query, userId: userId }),
    })

    return (await res.json()) as Contact[]
  } catch (error) {
    console.error("Error searching contacts:", error)
    throw error
  }
}