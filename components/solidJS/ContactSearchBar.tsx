import { createSignal, Show } from "solid-js"
import { createAsync, useSubmission } from "@solidjs/router"
import { addContactAction } from "~/lib/contacts"
import { getUser } from "~/lib/users"

type ContactSearchBarProps = {
    onContactAdded: () => void
}

export default function ContactSearchBar(props: ContactSearchBarProps) {
  const user = createAsync(() => getUser())
  const [searchTerm, setSearchTerm] = createSignal("")
  const [searchResults, setSearchResults] = createSignal<any[]>([])
  const [isSearching, setIsSearching] = createSignal(false)
  const [error, setError] = createSignal("")
  const addSubmission = useSubmission(addContactAction)
  
  // Search users with debounce
  let debounceTimeout: number | undefined

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  
    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    if (value.length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Set new timeout for 300ms to reduce API calls while typing
    debounceTimeout = setTimeout(async () => {
      try {
        // Use the contacts API endpoint instead of users/search
        const response = await fetch(`/api/contacts?term=${encodeURIComponent(value)}`)

        if (!response.ok) {
            throw new Error('Search failed')
        }

        const data = await response.json()

        // Filter out the current user and existing contacts
        setSearchResults(data.filter(currentUser => 
          currentUser.id !== user()?.id && 
          !user()?.contacts?.some(contact => contact.contactId === currentUser.id)
        ))
      } catch (err) {
        console.error("Search error:", err)
        setError("Failed to search users")
      } finally {
        setIsSearching(false)
      }
    }, 300) as unknown as number
  }

  return (
    <div class="mb-6">
      <div class="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm()}
          onInput={(e) => handleSearch(e.currentTarget.value)}
          class="w-full p-2 border rounded"
        />
      </div>
      
      <Show when={error()}>
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error()}
        </div>
      </Show>
      
      <Show when={isSearching()}>
        <div class="text-gray-500 mb-4">Searching...</div>
      </Show>
      
      <Show when={searchResults().length > 0}>
        <div class="border rounded overflow-hidden">
          <ul class="divide-y divide-gray-200">
            {searchResults().map(contact => (
              <li class="p-3 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p class="font-medium">{contact.name}</p>
                  <p class="text-sm text-gray-600">{contact.email}</p>
                </div>
                <form method="post" action={addContactAction.toString()}>
                  <input type="hidden" name="userId" value={user()?.id}/>
                  <input type="hidden" name="contactId" value={contact.id}/>
                  <button
                    type="submit"
                    disabled={addSubmission.pending}
                    class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    {addSubmission.pending ? 'Adding...' : 'Add'}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      </Show>
      
      <Show when={searchTerm().length >= 2 && searchResults().length === 0 && !isSearching()}>
        <div class="text-gray-500 mb-4">No users found matching your search.</div>
      </Show>
    </div>
  )
}