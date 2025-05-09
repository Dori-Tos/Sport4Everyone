import { Show } from "solid-js"
import { getUser, updateUserAction } from "~/lib/users"
import { createAsync, useSubmission } from "@solidjs/router"

export default function EditProfilePopup(props: { onClose: () => void, onSave: () => void }) {
  const user = createAsync(() => getUser())
  const submission = useSubmission(updateUserAction)

  return (
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Edit Profile</h2>
        
        <Show when={submission.error}>
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {JSON.stringify(submission.error)}
          </div>
        </Show>
        
        <form method="post" action={updateUserAction.with(user()?.id || -1)}>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">Name</label>
            <input
              name="name"
              type="text"
              value={user()?.name}
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={user()?.email}
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">New Password (leave blank to keep current)</label>
            <input
              name="password"
              type="password"
              class="w-full p-2 border rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              class="w-full p-2 border rounded"
            />
          </div>
          <div>
            <input 
              name="administrator"
              type="hidden"
              value={JSON.stringify(user()?.administrator)}
            />
          </div>
          <div class="flex justify-end">
            <button 
              type="button" 
              onClick={props.onClose} 
              class="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={submission.pending}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={submission.pending}
            >
              {submission.pending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}