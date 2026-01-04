import { File } from 'lucide-react'

export function Recent(): React.JSX.Element {
  return (
    <div className="p-6 rounded-lg max-w-200 bg-white border border-border-primary">
      <h3 className="text-lg font-semibold mb-4">Documents récents</h3>
      <div className="space-y-2">
        <button
          className="flex items-center gap-3 hover:bg-gray-50 p-3 rounded-lg 
          text-start w-full cursor-pointer transition"
        >
          <div className="w-10 h-10 bg-blue-300 rounded-lg flex items-center justify-center">
            <File size={20} color="#fff" />
          </div>
          <div>
            <p className="text-sm font-medium">Alex Cv.pdf</p>
            <p className="text-xs">30/03/25</p>
          </div>
        </button>
      </div>
    </div>
  )
}
