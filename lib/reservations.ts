import { z } from 'zod'


export const reservationSchema = z.object({
  userID: z.coerce.number(),
  sportsCenterID: z.coerce.number(),
  sportFieldID: z.coerce.number(),
  startDateTime: z.string().datetime(),
  duration: z.coerce.number(),
  price: z.coerce.number(),
})

type Reservation = z.infer<typeof reservationSchema>

export async function getReservations() {
  const res = await fetch('http://localhost:3000/api/reservations')
  return (await res.json()) as Reservation[]
}

export async function getReservationByUser(userID: number) {
  const res = await fetch(`http://localhost:3000/api/reservations/${userID}`)
  return (await res.json()) as Reservation[]
}

export async function addReservation(reservation: Reservation) {
  reservation = reservationSchema.parse(reservation)

  const formData = new URLSearchParams()
  formData.append('userID', String(reservation.userID))
  formData.append('sportsCenterID', String(reservation.sportsCenterID))
  formData.append('sportFieldID', String(reservation.sportFieldID))
  formData.append('startDateTime', reservation.startDateTime)
  formData.append('duration', String(reservation.duration))
  formData.append('price', String(reservation.price))

  const res = await fetch('http://localhost:3000/api/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  })
  return (await res.json()) as Reservation
}

export async function removeReservation(id: string) {
  const formData = new URLSearchParams()
  formData.append('id', String(id))

  const res = await fetch(`http://localhost:3000/api/reservations/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  })
  return (await res.json()) as Reservation
}

export async function getReservationsByUser(userId: number) {
  try {
    if (!userId) {
      console.error('Invalid userID:', userId)
      return []
    }
    const res = await fetch(`http://localhost:3000/api/users/getReservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId }),
    })
    
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return []
  }
}