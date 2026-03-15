import { Skeleton } from '../ui/skeleton'

export default function Loader(): React.JSX.Element {
  return (
    <div>
      <Skeleton className="w-full h-13 mb-2" />
      <div className="grid grid-cols-4 gap-x-6 gap-y-7">
        {Array.from({ length: 16 }).map((_, idx) => (
          <Skeleton key={idx} className="w-[282px] h-[150px]" />
        ))}
      </div>
    </div>
  )
}
