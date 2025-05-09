import { createAsync, createAsyncStore, useNavigate } from "@solidjs/router"
import { createEffect } from "solid-js"
import { MainCentered } from "~/components/Main"
import { MainHeader } from "~/components/Header"
import { getSportsCentersByUser } from "~/lib/sportsCenters"
import { getSportFieldsBySportsCenter } from "~/lib/sportFields"
import { getSports } from "~/lib/sports"
import SportFieldTable from "~/components/SportFieldsTable"
import { getUser } from "~/lib/users"
import Layout from "~/components/Layout"

export default function SportFields() {
  const user = createAsync(() => getUser())
  const navigate = useNavigate()

  // Redirect if user is not an administrator
  createEffect(() => {
    if (user() == undefined && user() && !user()?.administrator) {
      // Redirect non-admin users to home page
      navigate('/', { replace: true })
    }
    else if (user() == undefined && !user()) {
      // Redirect unauthenticated users to login (which will show the login popup)
      navigate('/login', { replace: true })
    }
  })
  
  // Get only sports centers owned by the current user if they're an admin
  const userSportCenters = createAsyncStore(async () => {
    if (!user()?.id) return []
    
    if (user()?.administrator) {
      return await getSportsCentersByUser(user().id)
    }
    return [] // Non-admin users don't own sports centers
  }, { initialValue: [] })
  
  // Get sport fields associated with the user's sports centers
  const userSportFields = createAsyncStore(async () => {
    if (!user()?.id) return []
  
    const centers = userSportCenters()
    if (!centers.length) return []
  
    const centerIds = centers.map(center => center.id)
  
    // Fetch all sport fields from all centers in parallel
    const sportFieldsPromises = centerIds.map(id => getSportFieldsBySportsCenter(id))
    const sportFieldsArrays = await Promise.all(sportFieldsPromises)
  
    // Flatten the array of arrays into a single array
    const allSportFields = sportFieldsArrays.flat()
  
    // Return all the collected sport fields
    return allSportFields
  }, { initialValue: [] })
  
  const sports = createAsyncStore(() => getSports(), { initialValue: [] })

  const refreshData = async () => {
    // Force refresh of the async stores
    await Promise.all([
      
    ])
  }

  return (
    <Layout protected={true}>
      <MainCentered>
        <MainHeader string="Sports Fields Page"/>
        <SportFieldTable 
          userSportCenters={userSportCenters}
          userSportFields={userSportFields}
          sports={sports}
          onChange={refreshData}
        />
      </MainCentered>
    </Layout>
  )
}