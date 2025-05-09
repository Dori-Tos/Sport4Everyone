export type SportsCenterItem = ({
  id: number,
  "Sports Center": string
  "Location": string
  "Opening Time": string
  "Attendance": string
})

export type SportFieldsItem = {
id: number
name: string
price: string
}

export type ReservationSaveItem = {
startDateTime: string
duration: string
price: number
sportFieldId: number
sportsCenterId: number
userId: number
}

export type ReservationItem = {
id: number
date: string
duration: string
price: number
sportFieldId: number
sportsCenterId: number
userId: number
}

export type RealSportsCenterItem = {
id: number
name: string
location: string
attendance: number
openingTime: string
sportFields: SportFieldsItem[]
}

export type ContactItem = {
id: number
userId: number
}

export type UserItem = {
id: number
username: string
password: string
email: string
administator: boolean
reservations: ReservationItem[]
sportsCenters: RealSportsCenterItem[]
contacts: ContactItem[]
}