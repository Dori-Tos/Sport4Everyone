import { For, createSignal } from "solid-js"
import { createAsyncStore } from "@solidjs/router"
import { Show } from "solid-js/web"
import { MainCentered } from "./Main"
import { TableCentered } from "./MainTable"
import { ReservationItem } from "~/components/Items"

type ReservationsTableProps = {
    userReservations: () => Array<any>
}

export default function ReservationsTable(props: ReservationsTableProps) {
          
    // Format the date for display
    const formatDate = (dateString) => {
      if (!dateString) return "N/A"
      const date = new Date(dateString)
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    

    return (
        <>
            <MainCentered>
                <TableCentered>
                    <Show when={props.userReservations().length > 0} fallback={<p>No reservations found.</p>}>
                      <table class="min-w-full bg-white">
                        <thead>
                          <tr>
                            <th class="py-2 px-4 border-b">Date</th>
                            <th class="py-2 px-4 border-b">Duration</th>
                            <th class="py-2 px-4 border-b">Sports Center</th>
                            <th class="py-2 px-4 border-b">Sport Field</th>
                            <th class="py-2 px-4 border-b">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          <For each={props.userReservations()}>
                            {(reservation) => (
                              <tr class="border-t hover:bg-gray-100">
                                <td class="py-2 px-4 border-b">{formatDate(reservation.date)}</td>
                                <td class="py-2 px-4 border-b">{reservation.duration} hour(s)</td>
                                <td class="py-2 px-4 border-b">{reservation.sportsCenter?.name || "N/A"}</td>
                                <td class="py-2 px-4 border-b">{reservation.sportField?.name || "N/A"}</td>
                                <td class="py-2 px-4 border-b">{reservation.price}€</td>
                              </tr>
                            )}
                          </For>
                        </tbody>
                      </table>
                    </Show>
                </TableCentered>
            </MainCentered>
        </>
    )
}
