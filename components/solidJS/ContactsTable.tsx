import { For } from "solid-js";
import { Show } from "solid-js/web";
import { MainCentered } from "./Main";
import { TableCentered } from "./MainTable";
import { removeContactAction } from "~/lib/contacts";
import { createAsync, useSubmission } from "@solidjs/router";
import { getUser } from "~/lib/users";

export default function ContactsTable() {
  const user = createAsync(() => getUser());

  const removeSubmission = useSubmission(removeContactAction);

  return (
    <>
      <MainCentered>
        <div class="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <h2 class="text-xl font-bold mb-4">Your Contacts</h2>
          <TableCentered>
            <Show
              when={user()?.contacts?.length > 0}
              fallback={<p>No contacts found.</p>}
            >
              <table class="min-w-full bg-white">
                <thead>
                  <tr>
                    <th class="py-2 px-4 border-b">Contact Name</th>
                    <th class="py-2 px-4 border-b">Email</th>
                    <th class="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={user()?.contacts}>
                    {(contact) => (
                      <tr class="border-t hover:bg-gray-100">
                        <td class="py-2 px-4 border-b">
                          {contact.contact?.name || "Unknown Contact"}
                        </td>
                        <td class="py-2 px-4 border-b">
                          {contact.contact?.email || "No email"}
                        </td>
                        <td class="py-2 px-4 border-b">
                          <form method="post" action={removeContactAction}>
                            <input
                              type="hidden"
                              name="userId"
                              value={user()?.id}
                            />
                            <input
                              type="hidden"
                              name="contactId"
                              value={contact.contactId}
                            />
                            <button
                              type="submit"
                              disabled={removeSubmission.pending}
                              class="text-red-600 hover:text-red-800"
                            >
                              {removeSubmission.pending
                                ? "Removing..."
                                : "Remove"}
                            </button>
                          </form>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </Show>
          </TableCentered>
        </div>
      </MainCentered>
    </>
  );
}
