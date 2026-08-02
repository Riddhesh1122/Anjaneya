import { PublicLayout } from '../components/layout/PublicLayout'
import { HomeHeader } from '../features/events/components/HomeHeader'
import { HeroBanner } from '../features/events/components/HeroBanner'
import { EventFeed } from '../features/events/components/EventFeed'
import { useFeaturedEvents } from '../hooks/useFeaturedEvents'

export default function HomePage() {
  const { featuredEvent, recommendedEvents, trendingEvents } = useFeaturedEvents()

  return (
    <PublicLayout>
      <HomeHeader />

      <main className="pt-6 pb-16">
        <HeroBanner event={featuredEvent} />

        <div className="max-w-7xl mx-auto px-4 mt-6">
          <EventFeed title="Recommended For You" events={recommendedEvents} />
          <EventFeed title="Trending Near You" events={trendingEvents} />
        </div>
      </main>
    </PublicLayout>
  )
}
