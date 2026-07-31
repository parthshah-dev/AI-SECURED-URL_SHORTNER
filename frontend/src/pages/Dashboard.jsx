import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Link2, CheckCircle, Clock, BarChart3, Plus, ArrowUpRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../components/dashboard/StatCard';
import Loader from '../components/common/Loader';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { analyticsService } from '../services/analyticsService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
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
    <div className="space-y-8">
      {/* Welcome + Create */}
      <PageHeader
        title={`Hello, ${user?.name || 'there'}! 👋`}
        subtitle="Here's what's happening with your links today."
      >
        <Link to="/urls">
          <Button icon={Plus} variant="gradient">
            Create New URL
          </Button>
        </Link>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard 
          title="Total URLs" 
          value={stats.totalUrls} 
          icon={Link2} 
          color="primary"
          subtitle="All time"
        />
        <StatCard 
          title="Active URLs" 
          value={stats.activeUrls} 
          icon={CheckCircle} 
          color="success"
          subtitle="Currently active"
        />
        <StatCard 
          title="Expired URLs" 
          value={stats.expiredUrls} 
          icon={Clock} 
          color="danger"
          subtitle="No longer active"
        />
      </div>

      {/* Recent URLs Table */}
      <motion.div
        className="card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-base font-semibold text-neutral-900">Recent URLs</h2>
          <Link to="/urls" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors">
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        {recentAnalytics.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Short Code</th>
                  <th>Original URL</th>
                  <th>Total Clicks</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {recentAnalytics.map((item) => (
                  <tr key={item.urlId}>
                    <td>
                      <span className="text-sm font-semibold text-primary-600">/{item.shortCode}</span>
                    </td>
                    <td>
                      <div className="text-sm text-neutral-600 max-w-xs truncate flex items-center gap-1.5" title={item.originalUrl}>
                        {item.originalUrl}
                        <ExternalLink className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-semibold text-neutral-800">{item.totalClicks}</span>
                    </td>
                    <td>
                      <span className={`badge ${item.active !== false ? 'badge-active' : 'badge-expired'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.active !== false ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {item.active !== false ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-neutral-500">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={BarChart3}
            title="No activity yet"
            description="Create a URL to get started and see your analytics here!"
            action={
              <Link to="/urls">
                <Button icon={Plus}>Create your first URL</Button>
              </Link>
            }
          />
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
