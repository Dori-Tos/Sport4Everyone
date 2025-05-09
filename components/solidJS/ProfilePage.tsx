import { createSignal, Show, For, createEffect } from "solid-js"
import { createAsync } from "@solidjs/router"
import { MediumHeader } from "~/components/Header"
import { getUser, updateUserAction } from "~/lib/users"
import EditProfilePopup from "~/components/EditProfilePopup"

export default function ProfilePage() {
  const user = createAsync(() => getUser())
  const [showPopup, setShowPopup] = createSignal(false)

  const handleSave = () => {
    setShowPopup(false)
  }

  return (
    <>
      <Show when={user} fallback={<p>Loading profile data...</p>}>
        <div class="mb-6 bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <div class="mb-6 flex justify-between items-center">
            <MediumHeader string="Personal Information" />
            <button
              onClick={() => setShowPopup(true)}
              class="bg-blue-600 text-white px-3 py-1 rounded-md"
            >
              Modify
            </button>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="text-gray-600">Name:</div>
            <div class="font-medium">{user()?.name}</div>
            
            <div class="text-gray-600">Email:</div>
            <div class="font-medium">{user()?.email}</div>
            
            <div class="text-gray-600">Account Type:</div>
            <div class="font-medium">
              {user()?.administrator ? "Administrator" : "Regular User"}
            </div>
          </div>
        </div>
        <div class="mb-6 bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">                    
          <div>
            <MediumHeader string="Contacts" />
            <Show 
              when={(user()?.contacts ?? []).length > 0}
              fallback={<p class="text-gray-500 italic mt-3">No contacts found.</p>}
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <For each={user()?.contacts}>
                  {(contactRelation) => (
                    <div class="bg-gray-50 p-3 rounded-md">
                      <div class="font-medium">{contactRelation.contact?.name || "Unknown Contact"}</div>
                      <div class="text-gray-600 text-sm">{contactRelation.contact?.email || "No email"}</div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </Show>
      <Show when={showPopup()}>
        <EditProfilePopup 
          onClose={() => setShowPopup(false)} 
          onSave={handleSave} 
        />
      </Show>
    </>
  )
}