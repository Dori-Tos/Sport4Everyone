import { For, createSignal } from "solid-js"
import { createAsyncStore } from "@solidjs/router"
import { MainCentered } from "./Main"
import { getSportFieldsBySportsCenter } from "~/lib/sportFields"
import { PopupSportFields } from "./PopupSportFields"
import { SportsCenterItem } from "~/components/Items"

const SportTableColumn = [
  "Sports Center",
  "Location",
  "Opening Time",
  "Attendance",
]

type SportTableProps = {
  data: Array<SportsCenterItem>
}

export default function SportTable(props: SportTableProps) {
  const [selectedCenterId, setSelectedCenterId] = createSignal<number | undefined>(undefined)
  const [selectedCenterName, setSelectedCenterName] = createSignal<string | undefined>(undefined)

  const sportFieldsData = createAsyncStore(async () => {
    const sportFields = await getSportFieldsBySportsCenter(selectedCenterId())
    return sportFields.map((sportField: any) => ({
      id: sportField.id,
      name: sportField.name,
      price: sportField.price,
    }))
  }, { initialValue: [] })

  const handleSave = (reservation: any) => {
    console.log(reservation)
  }

  return (
    <>
      <MainCentered>
        <div class="mb-4 flex border border-gray-500 rounded-md items-center">
          <table class="table-auto w-full">
            <thead>
              <tr>
                <For each={SportTableColumn}>
                  {(column) => (
                    <th class="px-4 py-2 text-center">{column}</th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={props.data} fallback={
                <tr>
                  <td colSpan={SportTableColumn.length || 1} class="px-4 py-2 text-center">
                    No data available.
                  </td>
                </tr>
              }>
                {(row) => (
                  <tr class="border-t cursor-pointer hover:bg-gray-100" 
                  onClick={() => {
                    setSelectedCenterId(row.id)
                    setSelectedCenterName(row["Sports Center"])
                  }}>
                    <For each={SportTableColumn}>
                      {(column) => (
                        <td class="px-4 py-2">{row[column as keyof SportsCenterItem]}</td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </MainCentered>

      {selectedCenterId() && (
        <PopupSportFields
          data={sportFieldsData()}
          centerName={selectedCenterName()}
          centerId={selectedCenterId()}
          onClose={() => {
            setSelectedCenterId(undefined)
            setSelectedCenterName(undefined)
          }}
          onSave={handleSave}
        />
      )}
    </>
  )
}
