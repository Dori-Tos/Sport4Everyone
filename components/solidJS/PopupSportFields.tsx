import { For, createSignal, Show } from "solid-js"
import { ReservationSaveItem, SportFieldsItem } from "~/components/Items"
import { addReservationAction } from "~/lib/reservations" 
import { createAsync, useSubmission } from "@solidjs/router"
import { getUser } from "~/lib/users"

type PopupProps = {
  data: Array<SportFieldsItem>
  centerName: string | undefined
  centerId: number | undefined
  onClose: () => void
  onSave: (reservations: ReservationSaveItem[]) => void
}

export function PopupSportFields(props: PopupProps) {
  const user = createAsync(() => getUser())
  const [selectedDate, setSelectedDate] = createSignal('2025-01-01')
  const [startTime, setStartTime] = createSignal('10:00')
  const [endTime, setEndTime] = createSignal('11:00')
  const [selectedFieldId, setSelectedFieldId] = createSignal<number | null>(null)
  const [selectedFieldPrice, setSelectedFieldPrice] = createSignal<number>(0)
  const submission = useSubmission(addReservationAction)

  // Handle radio button selection
  const handleFieldSelection = (id: number, price: number) => {
    setSelectedFieldId(id)
    setSelectedFieldPrice(price)
  }
  
  // Calculate duration in hours between start and end time
  const calculateDuration = () => {
    if (!startTime() || !endTime()) return 1

    const start = new Date(`1970-01-01T${startTime()}:00`)
    const end = new Date(`1970-01-01T${endTime()}:00`)
    const durationMs = end.getTime() - start.getTime()
    const durationHours = Math.max(1, Math.round(durationMs / (1000 * 60 * 60)))
    
    return durationHours
  }

  const isFormValid = () => {
    return (
      user()?.id !== undefined &&
      props.centerId !== undefined &&
      selectedFieldId() !== null &&
      selectedDate() &&
      startTime() &&
      endTime()
    )
  }

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-4 rounded-md w-1/2">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">
            Sport Fields for {props.centerName}
          </h2>
          <button class="text-red-500" onClick={props.onClose}>
            Close
          </button>
        </div>
        
        <form method="post" action={addReservationAction}>
          <input type="hidden" name="userID" value={user()?.id} />
          <input type="hidden" name="sportsCenterID" value={props.centerId} />
          <input type="hidden" name="startDateTime" value={`${selectedDate()}T${startTime()}:00Z`} />
          <input type="hidden" name="duration" value={calculateDuration()} />
          <input type="hidden" name="price" value={selectedFieldPrice() * calculateDuration()} />
          <input type="hidden" name="sportFieldID" value={selectedFieldId()} />
          
          <div>
            <h3 class="text-lg font-bold mb-2">Reservation</h3>
          </div>
          
          <div class="flex items-center mb-4">
            <label class="block mb-4 font-semibold mr-4 w-100">Select Date:</label>
            <input
              type="date"
              id="datepicker-custom"
              class="form-input w-100"
              value={selectedDate()}
              onInput={(e) => setSelectedDate(e.currentTarget.value)}
            />
          </div>
          <div class="flex items-center mb-4">
            <label class="block mb-4 font-semibold mr-4 w-100">Start Time:</label>
            <input
              type="time"
              id="start-timepicker-custom"
              class="form-input w-full"
              value={startTime()}
              onInput={(e) => setStartTime(e.currentTarget.value)}
            />
            <label class="block mb-4 font-semibold mr-4 w-100">End Time:</label>
            <input
              type="time"
              id="end-timepicker-custom"
              class="form-input w-full"
              value={endTime()}
              onInput={(e) => setEndTime(e.currentTarget.value)}
            />
          </div>
          
          {props.data.length > 0 ? (
            <div class="border border-gray-300 rounded-md p-2">
              <div class="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
                <span class="w-1/12"></span>
                <span class="w-7/12 font-semibold">SportField Name</span>
                <span class="w-4/12 font-semibold">Price</span>
              </div>
              <ul>
                <For each={props.data}>
                  {(field: SportFieldsItem) => (
                    <li class="mb-2">
                      <div class="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
                      <input
                          type="radio"
                          class="mr-2 w-1/12"
                          id={`field-${field.id}`}
                          checked={selectedFieldId() === field.id}
                          onInput={() => handleFieldSelection(field.id, parseFloat(field.price))}
                        />
                        <span class="w-7/12 font-semibold">{field.name}</span>
                        <span class="w-4/12 text-gray-600">{field.price}€/h</span>
                      </div>
                    </li>
                  )}
                </For>
              </ul>
            </div>
          ) : (
            <p>No sport fields available.</p>
          )}

          <Show when={selectedFieldId() !== null}>
            <div class="mt-4 p-3 bg-blue-50 rounded-md">
              <h3 class="font-semibold mb-2">Reservation Summary</h3>
              <p>Date: {selectedDate()}</p>
              <p>Time: {startTime()} to {endTime()} ({calculateDuration()} hour{calculateDuration() > 1 ? 's' : ''})</p>
              <p>Total Price: {(selectedFieldPrice() * calculateDuration()).toFixed(2)}€</p>
            </div>
          </Show>
          
          <div class="flex justify-end mt-4">
            <button 
              type="submit" 
              class="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={!isFormValid() || submission.pending}
            >
              {submission.pending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}