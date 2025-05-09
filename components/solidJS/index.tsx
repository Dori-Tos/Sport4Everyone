import { createAsync, createAsyncStore, type RouteDefinition, useNavigate } from "@solidjs/router"
import { createSignal, createEffect } from "solid-js"
import { MainCentered } from "~/components/Main"
import { MainHeader, MediumHeader } from "~/components/Header"
import { TableCentered } from "~/components/MainTable"
import SportTable from "~/components/SportTable"
import SportSelector from "~/components/SportSelector"
import { getSports } from "~/lib/sports"
import { getSportFields } from "~/lib/sportFields"
import { getSportsCentersBySport } from "~/lib/sportsCenters"
import { getReservationsByUser } from "~/lib/reservations"
import ReservationsTable from "~/components/ReservationsTable"
import { getUser } from "~/lib/users"
import Layout from "~/components/Layout"

export const route = {
  preload() {
    getSports()
  },
} satisfies RouteDefinition

export default function Home() {
  const user = createAsync(() => getUser())
  const [selectedSport, setSelectedSport] = createSignal("football")
  const navigate = useNavigate()

  // createEffect(() => {
  //   if (user() == undefined && user() == null) {
  //     // Redirect unauthenticated users to login (which will show the login popup)
  //     navigate('/login', { replace: true })
  //   }
  // })

  const sports = createAsyncStore(() => getSports(), { initialValue: [] })

  const sportsTableData = createAsyncStore(async () => {
    const centers = await getSportsCentersBySport(selectedSport())
    return centers.map((center: any) => ({
      id: center.id,
      "Sports Center": center.name,
      "Location": center.location,
      "Opening Time": center.openingTime,
      "Attendance": center.attendance,
    }))
  }, { initialValue: [
    {
      id: "id-unavailable",
      "Sports Center": "Name Unavailable",
      "Location": "Location Unavailable",
      "Opening Time": "Opening Time Unavailable",
      "Attendance": "Attendance Unavailable",
    }
  ]})

  const userReservations = createAsyncStore(async () => {
    if (!user()?.id) return []
    
    return await getReservationsByUser(user()?.id)
  }, { initialValue: [] })
  
  return (
    <Layout protected={true}>
      <MainCentered>
        <MainHeader string="Sports Centers"/>
        <TableCentered>
          <SportSelector 
            data={sports()} 
            selectedSport={selectedSport()} 
            setSelectedSport={setSelectedSport} 
          />
          <SportTable 
            data={sportsTableData() || []} 
          />
        </TableCentered>
        <MediumHeader string="Reservations"/>
        <ReservationsTable userReservations={userReservations}
          />
      </MainCentered>
    </Layout>
  )
}