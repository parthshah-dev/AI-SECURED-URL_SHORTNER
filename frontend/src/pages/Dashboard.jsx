import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faCheckCircle, faClock, faChartLine, faMousePointer, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import StatCard from '../components/dashboard/StatCard';
import Loader from '../components/common/Loader';
import { dashboardService } from '../services/dashboardService';
import { analyticsService } from '../services/analyticsService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUrls: 0, activeUrls: 0, expiredUrls: 0 });
  const [recentAnalytics, setRecentAnalytics] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, analyticsRes] = await Promise.all([
          dashboardService.getDashboard(),
          analyticsService.getDashboardAnalytics(0, 5, 'createdAt,desc')
        ]);
        
        setStats(dashboardRes);
        setRecentAnalytics(analyticsRes.content || []);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader fullScreen={false} />;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500 mt-1">Overview of your shortened URLs performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total URLs" 
          value={stats.totalUrls} 
          icon={faLink} 
          color="primary" 
        />
        <StatCard 
          title="Active URLs" 
          value={stats.activeUrls} 
          icon={faCheckCircle} 
          color="success" 
        />
        <StatCard 
          title="Expired URLs" 
          value={stats.expiredUrls} 
          icon={faClock} 
          color="warning" 
        />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">Recent URL Activity</h2>
        </div>
        
        <div className="card overflow-hidden">
          {recentAnalytics.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Short URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Original URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      <FontAwesomeIcon icon={faMousePointer} className="mr-1" /> Total Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      <FontAwesomeIcon icon={faCalendarDay} className="mr-1" /> Today
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {recentAnalytics.map((item) => (
                    <tr key={item.urlId} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-primary-600">/{item.shortCode}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-900 max-w-xs truncate" title={item.originalUrl}>
                          {item.originalUrl}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {item.totalClicks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {item.todayClicks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-500">
              <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faChartLine} className="text-2xl text-neutral-400" />
              </div>
              <p>No analytics data available yet. Create a URL to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
