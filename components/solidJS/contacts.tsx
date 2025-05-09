import { createAsyncStore, createAsync, useNavigate } from "@solidjs/router"
import { MainCentered } from "~/components/Main"
import { MainHeader } from "~/components/Header"
import ContactsTable from "~/components/ContactsTable"
import { getContactsByUser } from "~/lib/contacts"
import ContactSearchBar from "~/components/ContactSearchBar"
import Layout from "~/components/Layout"
import { getUser } from "~/lib/users"

export default function Contacts() {
  const user = createAsync(() => getUser())

  let userContacts = createAsyncStore(async () => {
    if (!user()?.id) return []
    
    return await getContactsByUser(user()?.id)
  }, { initialValue: [] })

  const refreshContacts = async () => {
    if (!user()?.id) return

    try {
      const contacts = await getContactsByUser(user()?.id)
      userContacts = contacts
    } catch (error) {
      console.error("Failed to refresh contacts:", error)
    }
  }
  
  return (
    <Layout protected={true}>
      <MainCentered>
        <MainHeader string="Contacts Page"/>
    
        <div class="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mb-6">
          <h2 class="text-xl font-bold mb-4">Add New Contact</h2>
          <ContactSearchBar onContactAdded={refreshContacts} />
        </div>
    
        <ContactsTable userContacts={userContacts} onContactDeleted={refreshContacts}/>
      </MainCentered>
    </Layout>
  )
}
