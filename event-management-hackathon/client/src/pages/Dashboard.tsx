import React, { useEffect, useState } from 'react';
import DashboardUI, {
  StatCard,
  RecentEventsTable,
  UpcomingEventCard,
  NotificationsPanel,
  ProfileCard,
  ChartsPlaceholder,
  Sidebar,
  Navbar,
} from '../components/ui/DashboardUI';
import { dashboardApi } from '../services/dashboardApi';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    dashboardApi.fetchOverview().then((d) => {
      if (mounted) setData(d);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Use the small Navbar/Sidebar components directly for simplicity */}
      <div className="lg:flex">
        <Sidebar collapsed={false} onToggleCollapsed={() => {}} mobileOpen={false} onCloseMobile={() => {}} />

        <div className="flex-1">
          <Navbar onToggleMobileMenu={() => {}} onToggleCollapsed={() => {}} />

          <main className="p-6 lg:p-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Events" value={data.stats.totalEvents} delta="+12% this month" color="bg-white" icon={<div className="text-blue-600">📅</div>} />
              <StatCard title="Upcoming Events" value={data.stats.upcomingEvents} delta="+8%" color="bg-white" icon={<div className="text-violet-600">⏳</div>} />
              <StatCard title="Volunteers" value={data.stats.volunteers} delta="+4%" color="bg-white" icon={<div className="text-green-600">👥</div>} />
              <StatCard title="Registrations" value={data.stats.registrations} delta="+22%" color="bg-white" icon={<div className="text-blue-500">🎟️</div>} />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <RecentEventsTable events={data.recentEvents} />

                <div className="grid gap-4 md:grid-cols-2">
                  {data.upcoming.map((ev: any) => (
                    <UpcomingEventCard key={ev.id} event={ev} />
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <ChartsPlaceholder title="Monthly Registrations" />
                  <ChartsPlaceholder title="Event Analytics" />
                </div>
              </div>

              <aside className="space-y-6">
                <NotificationsPanel items={data.notifications} />
                <ProfileCard />
                <ChartsPlaceholder title="Volunteer Distribution" />
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
