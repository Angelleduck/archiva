import { Glass } from '@renderer/components/svg/glass'

export default function Search(): React.JSX.Element {
  return (
    <>
      <div className="p-5 border border-border-primary rounded-lg bg-white space-y-4">
        <div
          className="px-3 border-2 border-border-primary rounded-lg bg-white relative 
          flex items-center gap-3 focus-within:border-blue-300"
        >
          <Glass className="w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Rechercher par nom, tags" className="w-full py-3" />
        </div>

        <div className="flex gap-3">
          <select
            name="pets"
            id="categorie"
            className="border transition-all duration-300 border-border-primary
             rounded-lg px-3 py-2 outline-none focus:border-blue-300 text-sm text-primary"
          >
            <option value="">Toutes les catégories</option>
            <option value="impôt">Impôt</option>
            <option value="marcher">Marcher</option>
          </select>

          <label className="flex items-center gap-2 px-3 py-2 border border-border-primary rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="checkbox" className="accent-blue-300" />
            <span className="text-sm text-text-primary">Favoris uniquement</span>
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </label>
        </div>
      </div>
    </>
  )
}
