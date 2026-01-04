import { Upload } from 'lucide-react'

export default function Document(): React.JSX.Element {
  return (
    <div className="p-6 rounded-lg bg-white border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Importer des documents</h3>
      <div className="space-y-6">
        <button className="flex py-4 w-full justify-center items-center border-2 border-blue-300 rounded-lg font-semibold text-blue-300 gap-2">
          <Upload size={24} />
          Sélectionner des fichiers
        </button>

        <div className="space-y-2">
          <label htmlFor="tags" className="block text-sm">
            Tags (optionnel)
          </label>

          <input
            id="tags"
            className="border-2 outline-none transition-all duration-300 border-border-primary focus:border-blue-300 w-full p-2 rounded-md"
            placeholder="Séparez par des virgules: 2024, important, fiscal"
            type="text"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="categorie" className="block text-sm">
            Catégorie (optionnel)
          </label>

          <select
            name="pets"
            id="categorie"
            className="w-full border-2 transition-all duration-300 border-border-primary rounded-md p-2.5 mt-1 outline-none focus:border-blue-300"
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="impôt">Impôt</option>
            <option value="marcher">Marcher</option>
          </select>
        </div>

        <button className="w-full text-white bg-blue-400 py-3 rounded-lg cursor-not-allowed">
          Importer les documents
        </button>
      </div>
    </div>
  )
}
