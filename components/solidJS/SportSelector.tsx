import { For } from "solid-js"

type SportSelectorProps = {
    data: Array<Record<string, any>>
    selectedSport: string
    setSelectedSport: (field: string) => void
}

export default function SportSelector(props: SportSelectorProps) {
    return (
        <div class="mb-4 flex justify-end items-center">
            <div class="flex-grow">
                <p class="text-lg font-bold">Sports Centers List</p>
            </div>
            <div class="border border-gray-500 rounded-md p-2 flex items-center">
                <label for="sport-selector" class="block text-sm font-medium text-gray-700 mr-2 whitespace-nowrap">Select Sport:</label>
                <select
                    id="sport-selector"
                    class="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md w-48"
                    value={props.selectedSport}
                    onChange={(e) => props.setSelectedSport(e.currentTarget.value)}
                >
                    <For each={props.data}>
                        {(item) => (
                            <option value={item.name}>{item.name}</option>
                        )}
                    </For>
                </select>
            </div>
        </div>
    )
}