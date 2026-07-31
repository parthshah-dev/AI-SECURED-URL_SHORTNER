import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Copy, QrCode, Pencil, Trash2, Ban, CheckCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Loader from '../components/common/Loader';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';
import UrlFormModal from '../components/forms/UrlFormModal';
import QRCodeModal from '../components/ui/QRCodeModal';
import { urlService } from '../services/urlService';
import toast from 'react-hot-toast';

const Urls = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [editingUrl, setEditingUrl] = useState(null);
  const [selectedShortCode, setSelectedShortCode] = useState(null);

  const fetchUrls = useCallback(async (query = '') => {
    setLoading(true);
    try {
      let data;
      if (query.trim()) {
        data = await urlService.searchUrls(query);
      } else {
        data = await urlService.getMyUrls('?sort=createdAt,desc');
      }
      setUrls(data);
    } catch (error) {
      toast.error('Failed to load URLs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Debounce search
    const handler = setTimeout(() => {
      fetchUrls(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, fetchUrls]);

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;
    try {
      await urlService.deleteUrl(id);
      toast.success('URL deleted');
      fetchUrls(searchQuery);
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      if (currentStatus) {
        await urlService.deactivateUrl(id);
        toast.success('URL deactivated');
      } else {
        await urlService.activateUrl(id);
        toast.success('URL activated');
      }
      fetchUrls(searchQuery);
    } catch (error) {
      toast.error('Failed to update URL status');
    }
  };

  const openEditModal = (url) => {
    setEditingUrl(url);
    setIsFormOpen(true);
  };

  const openQRModal = (shortCode) => {
    setSelectedShortCode(shortCode);
    setIsQROpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My URLs" subtitle="Manage all your shortened links.">
        <Button 
          icon={Plus}
          variant="gradient"
          onClick={() => { setEditingUrl(null); setIsFormOpen(true); }}
        >
          Create New URL
        </Button>
      </PageHeader>

      {/* Table Card */}
      <motion.div
        className="card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Search Bar */}
        <div className="p-4 border-b border-neutral-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by code, title or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12"><Loader /></div>
        ) : urls.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Short Code</th>
                  <th>Title</th>
                  <th>Original URL</th>
                  <th>Total Clicks</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr key={url.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-600 hover:text-primary-700 text-sm transition-colors">
                          /{url.shortCode}
                        </a>
                        <button
                          onClick={() => handleCopy(url.shortUrl)}
                          className="p-1 rounded-md text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                          title="Copy short URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm text-neutral-600">{url.title || '—'}</span>
                    </td>
                    <td>
                      <div className="text-sm text-neutral-600 max-w-[200px] truncate flex items-center gap-1" title={url.originalUrl}>
                        {url.originalUrl}
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-semibold text-neutral-800">{url.clickCount}</span>
                    </td>
                    <td>
                      <Badge variant={url.isActive ? 'active' : 'inactive'}>
                        {url.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openQRModal(url.shortCode)}
                          className="p-2 rounded-lg text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                          title="QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(url)}
                          className="p-2 rounded-lg text-neutral-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(url.id, url.isActive)}
                          className="p-2 rounded-lg text-neutral-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                          title={url.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {url.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(url.id)}
                          className="p-2 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title={searchQuery ? 'No results found' : 'No URLs yet'}
            description={searchQuery ? 'Try a different search term.' : 'Create your first short URL to get started.'}
            action={
              !searchQuery && (
                <Button icon={Plus} onClick={() => { setEditingUrl(null); setIsFormOpen(true); }}>
                  Create your first URL
                </Button>
              )
            }
          />
        )}
      </motion.div>

      <UrlFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={() => fetchUrls(searchQuery)}
        initialData={editingUrl}
      />

      <QRCodeModal 
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        shortCode={selectedShortCode}
      />
    </div>
  );
};

export default Urls;
