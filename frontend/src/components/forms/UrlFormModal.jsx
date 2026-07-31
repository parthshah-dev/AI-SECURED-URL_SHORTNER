import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../ui/Modal';
import Input from '../forms/Input';
import Button from '../ui/Button';
import { urlService } from '../../services/urlService';
import toast from 'react-hot-toast';
import { Link2, Tag, FileText, Calendar } from 'lucide-react';

const UrlFormModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const isEditing = !!initialData;
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: isEditing ? {
      originalUrl: initialData.originalUrl,
      title: initialData.title || '',
      description: initialData.description || '',
      expiryDate: initialData.expiryDate ? initialData.expiryDate.substring(0, 16) : ''
    } : {}
  });
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens with new initialData
  React.useEffect(() => {
    if (isOpen) {
      reset(isEditing ? {
        originalUrl: initialData.originalUrl,
        title: initialData.title || '',
        description: initialData.description || '',
        expiryDate: initialData.expiryDate ? initialData.expiryDate.substring(0, 16) : ''
      } : {});
    }
  }, [isOpen, initialData, isEditing, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Format payload
      const payload = { ...data };
      if (!payload.expiryDate) delete payload.expiryDate;
      if (!payload.title) delete payload.title;
      if (!payload.description) delete payload.description;

      if (isEditing) {
        await urlService.updateUrl(initialData.id, payload);
        toast.success('URL updated successfully');
      } else {
        await urlService.createUrl(payload);
        toast.success('URL created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} URL`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit URL' : 'Create Short URL'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="originalUrl"
          label="Destination URL *"
          placeholder="https://example.com/very/long/path"
          icon={Link2}
          {...register('originalUrl', { 
            required: 'Original URL is required',
            pattern: {
              value: /^https?:\/\/\S+$/,
              message: 'Must be a valid HTTP or HTTPS URL'
            }
          })}
          error={errors.originalUrl?.message}
        />

        {!isEditing && (
          <Input
            id="customAlias"
            label="Custom Alias (Optional)"
            placeholder="my-custom-link"
            icon={Tag}
            {...register('customAlias', {
              maxLength: { value: 30, message: 'Max 30 characters' },
              pattern: {
                value: /^[a-zA-Z0-9_-]*$/,
                message: 'Only alphanumeric, hyphens, and underscores allowed'
              }
            })}
            error={errors.customAlias?.message}
          />
        )}

        {isEditing && (
          <>
            <Input
              id="title"
              label="Title (Optional)"
              placeholder="My Link Title"
              icon={FileText}
              {...register('title', {
                maxLength: { value: 255, message: 'Max 255 characters' }
              })}
              error={errors.title?.message}
            />
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows="3"
                className="input-field h-auto py-2.5 resize-none"
                placeholder="Add a description for this link..."
                {...register('description', {
                  maxLength: { value: 1000, message: 'Max 1000 characters' }
                })}
              ></textarea>
              {errors.description && (
                <p className="mt-1.5 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
          </>
        )}

        <Input
          id="expiryDate"
          label="Expiry Date (Optional)"
          type="datetime-local"
          icon={Calendar}
          {...register('expiryDate')}
          error={errors.expiryDate?.message}
        />

        <div className="pt-4 flex justify-end gap-3 border-t border-neutral-100">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient" isLoading={loading}>
            {isEditing ? 'Save Changes' : 'Create URL'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UrlFormModal;
