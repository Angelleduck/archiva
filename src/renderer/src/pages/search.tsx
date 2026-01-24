import { Glass } from '@renderer/components/svg/glass'
import { debounce } from '@renderer/helper/utils'
import { File } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function Search(): React.JSX.Element {
  const [category, setCategory] = useState('')
  const [isFavory, setisFavory] = useState(false)
  const [documents, setDocuments] = useState<Record<string, any>[]>([])

  const handleSearch = async (value: string): Promise<void> => {
    if (value.length < 2) {
      setDocuments([])
      return
    }
    const searchObject = {}
    searchObject.q = value
    if (category) searchObject.category = category
    if (isFavory) searchObject.isFavory = isFavory

    const result = await window.api.search.query(searchObject)
    setDocuments(result)
  }
  const debouncedHandleSearch = useMemo(() => debounce(handleSearch, 600), [])

  const handleOpenDocument = async (filePath: string): Promise<void> => {
    await window.api.document.open(filePath)
  }
  return (
    <>
      <div className="p-5 border border-border-primary rounded-lg bg-white space-y-4 mb-8">
        <div
          className="px-3 border-2 border-border-primary rounded-lg bg-white relative 
          flex items-center gap-3 focus-within:border-blue-300"
        >
          <Glass className="w-5 h-5 text-gray-400" />
          <input
            onChange={(e) => debouncedHandleSearch(e.target.value)}
            type="text"
            placeholder="Rechercher par nom, tags"
            className="w-full py-3"
          />
        </div>

        <div className="flex gap-3">
          <select
            name="pets"
            id="categorie"
            className="border transition-all duration-300 border-border-primary
            rounded-lg px-3 py-2 outline-none focus:border-blue-300 text-sm text-primary"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            <option value="impôt">Impôt</option>
            <option value="marcher">Marcher</option>
          </select>

          <label className="flex items-center gap-2 px-3 py-2 border border-border-primary rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              checked={isFavory}
              onChange={(e) => setisFavory(e.target.checked)}
              type="checkbox"
              className="accent-blue-300"
            />
            <span className="text-sm text-text-primary">Favoris uniquement</span>
          </label>
        </div>
      </div>
      <div className="border border-border-primary rounded-lg bg-white">
        <h3 className="p-4 font-semibold text-lg">{documents.length} résultat(s)</h3>

        {documents.length < 1 ? (
          <div className="py-16 border-t border-border-primary">
            <div className="flex flex-col items-center">
              <Glass className="w-16 h-16 text-gray-300" />
              <div>
                <p className="text text-secondary">Commencez à taper pour rechercher</p>
              </div>
            </div>
          </div>
        ) : (
          documents.map((doc, idx) => (
            <div
              onClick={() => handleOpenDocument(doc.path)}
              key={idx}
              className="flex items-center justify-between p-4 hover:bg-gray-50
            border-t border-border-primary cursor-pointer"
            >
              <div className="flex gap-4 w-full">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-md gap-2">
                  <File size={20} className="fill-blue-600 stroke-blue-600 shrink-0" />
                </div>
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <p className="font-semibold">{doc.filename}</p>
                    <p className="text-xs space-x-1">
                      <span>2 MB</span>
                      <span>•</span>
                      <span>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
