import { For, createSignal, } from "solid-js"
import { useSubmission, createAsync } from "@solidjs/router"
import { Show } from "solid-js/web"
import { MainCentered } from "./Main"
import { TableCentered } from "./MainTable"
import { getUser } from "~/lib/users"
import { addSportFieldToSportsCenterAction } from "~/lib/sportsCenters"
import { removeSportFieldAction } from "~/lib/sportFields"

type SportFieldsTableProps = {
  userSportCenters: () => Array<any>
  userSportFields: () => Array<any>
  sports: () => Array<any>
  onChange: () => void
}

export default function SportFieldTable(props: SportFieldsTableProps) {
  const user = createAsync(() => getUser());
  const addSubmission = useSubmission(addSportFieldToSportsCenterAction)
  const removeSubmission = useSubmission(removeSportFieldAction)

  const [isFormVisible, setIsFormVisible] = createSignal(false)  

  return (
    <MainCentered>
      <div class="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">Sport Fields Management</h2>
          <button
            onClick={() => setIsFormVisible(!isFormVisible())}
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isFormVisible() ? "Cancel" : "Add New Sport Field"}
          </button>
        </div>

        {/* Add Sport Field Form */}
        <Show when={isFormVisible()}>
          <form method="post" action={addSportFieldToSportsCenterAction} class="mb-8 border p-4 rounded-md bg-gray-50">
            <h3 class="font-semibold mb-4">Add New Sport Field</h3>
            
            <Show when={addSubmission.error || removeSubmission.error}>
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {JSON.stringify(addSubmission.error || removeSubmission.error)}
              </div>
            </Show>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Sports Center
                </label>
                <select
                  name="sportsCenterId"
                  class="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select a Sports Center</option>
                  <For each={props.userSportCenters()}>
                    {(center) => (
                      <option value={center.id}>{center.name}</option>
                    )}
                  </For>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Field Name
                </label>
                <input
                  name="sportFieldName"
                  type="text"
                  class="w-full p-2 border rounded"
                  placeholder="e.g. Tennis Court 1"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Price per Hour (€)
                </label>
                <input
                  name="sportFieldPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div class="p-2 border rounded max-h-32 overflow-y-auto">
                  <For each={props.sports()}>
                    {(sport) => (
                      <div class="flex items-center mb-2">
                        <input
                          name="sportFieldSports"
                          type="checkbox"
                          value={sport.id}
                          id={`sport-${sport.id}`}
                          class="mr-2"
                        />
                        <label for={`sport-${sport.id}`}>{sport.name}</label>
                      </div>
                    )}
                </For>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button
                type="submit"
                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={addSubmission.pending}
              >
                {addSubmission.pending ? "Saving Sport Field..." : "Save Sport Field"} 
              </button>
            </div>
          </form>
        </Show>

        {/* Sport Fields Table */}
        <TableCentered>
          <Show when={props.userSportFields().length > 0} fallback={<p>No sport fields found. Create one using the form above.</p>}>
            <div class="space-y-6">
              <For each={props.userSportCenters()}>
                {(center) => {
                  // Filter sport fields for this specific center
                  const centerFields = props.userSportFields().filter(field => 
                    field.sportsCenterId === center.id || field.sportsCenter?.id === center.id
                  );
                  
                  // Only display centers that have fields
                  return (centerFields.length > 0) && (
                    <div class="border rounded-lg overflow-hidden">
                      <div class="bg-gray-100 px-4 py-3 font-semibold border-b">
                        {center.name}
                      </div>
                      <table class="min-w-full bg-white">
                        <thead>
                          <tr>
                            <th class="py-2 px-4 border-b">Field Name</th>
                            <th class="py-2 px-4 border-b">Price/Hour</th>
                            <th class="py-2 px-4 border-b">Sports</th>
                            <th class="py-2 px-4 border-b">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <For each={centerFields}>
                            {(field) => (
                              <tr class="border-t hover:bg-gray-100">
                                <td class="py-2 px-4 border-b">{field.name}</td>
                                <td class="py-2 px-4 border-b">{field.price}€</td>
                                <td class="py-2 px-4 border-b">
                                  <div class="flex flex-wrap gap-1">
                                    <For each={field.sports}>
                                      {(sport) => (
                                        <span class="bg-gray-200 px-2 py-1 text-xs rounded-full">
                                          {sport.name}
                                        </span>
                                      )}
                                    </For>
                                  </div>
                                </td>
                                <td class="py-2 px-4 border-b">
                                  <form method="post" action={removeSportFieldAction}>
                                    <input type="hidden" name="sportFieldId" value={field.id} />
                                    <button
                                      type="submit"
                                      disabled={removeSubmission.pending}
                                      class="text-red-600 hover:text-red-800"
                                    >
                                      {removeSubmission.pending ? "Removing..." : "Remove"}
                                    </button>
                                  </form>
                                </td>
                              </tr>
                            )}
                          </For>
                        </tbody>
                      </table>
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>
        </TableCentered>
      </div>
    </MainCentered>
  )
}