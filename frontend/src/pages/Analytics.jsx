import React, { useEffect, useState } from 'react';
import { BarChart3, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Loader from '../components/common/Loader';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
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

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible);
    
    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Track the performance of your short links."
      />

      <motion.div
        className="card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold text-neutral-800">All Links Performance</h2>
        </div>
        
        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : analytics.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Short Code</th>
                    <th>Original URL</th>
                    <th>Total Clicks</th>
                    <th>Today's Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((item) => (
                    <tr key={item.urlId}>
                      <td>
                        <span className="font-semibold text-primary-600 text-sm">/{item.shortCode}</span>
                      </td>
                      <td>
                        <div className="text-sm text-neutral-600 max-w-xs truncate flex items-center gap-1.5" title={item.originalUrl}>
                          {item.originalUrl}
                          <ExternalLink className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                        </div>
                      </td>
                      <td>
                        <span className="text-sm font-bold text-neutral-800">{item.totalClicks}</span>
                      </td>
                      <td>
                        <span className="text-sm font-bold text-neutral-800">{item.todayClicks}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-sm text-neutral-500">
                  Page {page + 1} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        pageNum === page
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  ))}
                  
                  {totalPages > 5 && page < totalPages - 3 && (
                    <span className="px-1 text-neutral-400">…</span>
                  )}
                  
                  {totalPages > 5 && page < totalPages - 3 && (
                    <button
                      onClick={() => setPage(totalPages - 1)}
                      className="w-9 h-9 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-all"
                    >
                      {totalPages}
                    </button>
                  )}

                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:pointer-events-none transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={BarChart3}
            title="No analytics data"
            description="Start creating and sharing URLs to see analytics here."
          />
        )}
      </motion.div>
    </div>
  );
};

export default Analytics;
