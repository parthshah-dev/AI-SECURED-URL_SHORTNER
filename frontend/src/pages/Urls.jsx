import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faCopy, faQrcode, faEdit, faTrash, faBan, faCheckCircle, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/ui/Button';
import Loader from '../components/common/Loader';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My URLs</h1>
          <p className="text-neutral-500 mt-1">Manage all your shortened links.</p>
        </div>
        <Button 
          icon={faPlus} 
          onClick={() => { setEditingUrl(null); setIsFormOpen(true); }}
        >
          Create New URL
        </Button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search by alias, original URL..."
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
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Short Link</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Original URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Clicks</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {urls.map((url) => (
                  <tr key={url.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:underline">
                          /{url.shortCode}
                        </a>
                        <button onClick={() => handleCopy(url.shortUrl)} className="text-neutral-400 hover:text-neutral-700" title="Copy">
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                      </div>
                      {url.title && <div className="text-xs text-neutral-500 mt-1">{url.title}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900 max-w-xs truncate" title={url.originalUrl}>
                        {url.originalUrl}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${url.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {url.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {url.clickCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button onClick={() => openQRModal(url.shortCode)} className="text-neutral-500 hover:text-primary-600" title="QR Code">
                        <FontAwesomeIcon icon={faQrcode} />
                      </button>
                      <button onClick={() => openEditModal(url)} className="text-neutral-500 hover:text-blue-600" title="Edit">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => handleToggleStatus(url.id, url.isActive)} className="text-neutral-500 hover:text-orange-600" title={url.isActive ? "Deactivate" : "Activate"}>
                        <FontAwesomeIcon icon={url.isActive ? faBan : faCheckCircle} />
                      </button>
                      <button onClick={() => handleDelete(url.id)} className="text-neutral-500 hover:text-red-600" title="Delete">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-neutral-500">
            <p>No URLs found.</p>
            {!searchQuery && (
              <Button className="mt-4" onClick={() => { setEditingUrl(null); setIsFormOpen(true); }}>
                Create your first URL
              </Button>
            )}
          </div>
        )}
      </div>

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
