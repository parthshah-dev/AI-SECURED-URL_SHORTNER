import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Loader from '../components/common/Loader';
import Button from '../components/ui/Button';
import { analyticsService } from '../services/analyticsService';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await analyticsService.getDashboardAnalytics(page, size, 'createdAt,desc');
        setAnalytics(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>
        <p className="text-neutral-500 mt-1">Detailed performance metrics for your links.</p>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex items-center">
          <FontAwesomeIcon icon={faChartBar} className="text-primary-600 mr-2" />
          <h2 className="font-semibold text-neutral-800">All Links Performance</h2>
        </div>
        
        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : analytics.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Short Link</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Original URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Today's Clicks</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {analytics.map((item) => (
                    <tr key={item.urlId} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-primary-600">/{item.shortCode}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-900 max-w-xs truncate" title={item.originalUrl}>
                          {item.originalUrl}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-700">
                        {item.totalClicks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-700">
                        {item.todayClicks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-sm text-neutral-500">
                  Page {page + 1} of {totalPages}
                </span>
                <div className="space-x-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-1" /> Prev
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                  >
                    Next <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center text-neutral-500">
            <p>No analytics data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
