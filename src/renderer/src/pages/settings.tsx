import { useEffect, useState } from 'react'

export default function Settings(): React.JSX.Element {
  const [path, setPath] = useState('')
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const res = await window.api.store.get()
      if (res.success) {
        setPath(res.data)
      }
    }
    fetchData()
  }, [trigger])

  const handleUpdateLocation = async (): Promise<void> => {
    await window.api.store.update()
    setTrigger((prev) => prev + 1)
  }
  return (
    <div className="bg-white rounded-md border border-gray-200">
      <div className="border-b border-gray-200 flex gap-2">
        <p className="px-10 py-2.5 border-b-2 border-blue-400 ">Document</p>
      </div>
      <div className="p-5">
        <h2 className="text-lg font-medium text-black-primary mb-2">Emplacement</h2>
        <div className="bg-gray-100 p-5 flex justify-between rounded-md">
          <div>
            <h3 className="font-medium text-black-primary">
              Changer l&apos;emplacement des documents
            </h3>
            <p className="text-sm text-gray-secondary">Emplacement actuelle:{path}</p>
          </div>
          <button
            onClick={handleUpdateLocation}
            className="bg-blue-300 hover:bg-blue-400 transition px-4
            py-2 rounded-md text-white cursor-pointer"
          >
            Changer
          </button>
        </div>
      </div>
    </div>
  )
}
