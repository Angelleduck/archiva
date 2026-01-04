import { Recent } from '@renderer/components/home/recent'
import { StatsCard } from '@renderer/components/home/stats-card'

export default function Home(): React.JSX.Element {
  return (
    <>
      <StatsCard />
      <Recent />
    </>
  )
}
