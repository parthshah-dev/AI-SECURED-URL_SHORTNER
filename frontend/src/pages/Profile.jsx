import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import Input from '../components/forms/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loadingName, setLoadingName] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const { register: regName, handleSubmit: handleNameSubmit, formState: { errors: nameErrors } } = useForm({
    defaultValues: { name: user?.name || '' }
  });

  const { register: regEmail, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors }, reset: resetEmail } = useForm();
  
  const { register: regPass, handleSubmit: handlePassSubmit, formState: { errors: passErrors }, watch: watchPass, reset: resetPass } = useForm();
  const newPassword = watchPass('newPassword');

  const onUpdateName = async (data) => {
    setLoadingName(true);
    try {
      const updatedProfile = await profileService.updateName(data);
      setUser(updatedProfile);
      toast.success('Name updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update name');
    } finally {
      setLoadingName(false);
    }
  };

  const onRequestEmailUpdate = async (data) => {
    setLoadingEmail(true);
    try {
      await profileService.requestEmailUpdate(data);
      toast.success('Verification email sent to your new address.');
      resetEmail();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request email update');
    } finally {
      setLoadingEmail(false);
    }
  };

  const onChangePassword = async (data) => {
    setLoadingPassword(true);
    try {
      await profileService.changePassword(data);
      toast.success('Password updated successfully');
      resetPass();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Profile Settings</h1>
        <p className="text-neutral-500 mt-1">Manage your account details and security.</p>
      </div>

      {/* Name Update */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center">
          <FontAwesomeIcon icon={faUser} className="text-primary-600 mr-2" />
          <h2 className="font-semibold text-neutral-800">Personal Information</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleNameSubmit(onUpdateName)} className="flex items-start space-x-4">
            <div className="flex-1">
              <Input
                id="name"
                label="Full Name"
                {...regName('name', { required: 'Name is required' })}
                error={nameErrors.name?.message}
              />
            </div>
            <div className="pt-6">
              <Button type="submit" isLoading={loadingName}>Save</Button>
            </div>
          </form>
        </div>
      </div>

      {/* Email Update */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faEnvelope} className="text-primary-600 mr-2" />
            <h2 className="font-semibold text-neutral-800">Email Address</h2>
          </div>
          <span className="text-xs bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full font-medium">
            Current: {user?.email}
          </span>
        </div>
        <div className="p-6">
          <p className="text-sm text-neutral-500 mb-4">To change your email, you must verify it with your current password.</p>
          <form onSubmit={handleEmailSubmit(onRequestEmailUpdate)} className="space-y-4 max-w-md">
            <Input
              id="newEmail"
              label="New Email Address"
              type="email"
              {...regEmail('email', { 
                required: 'New email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
              })}
              error={emailErrors.email?.message}
            />
            <Input
              id="emailPassword"
              label="Current Password"
              type="password"
              {...regEmail('password', { required: 'Password is required to change email' })}
              error={emailErrors.password?.message}
            />
            <Button type="submit" isLoading={loadingEmail}>Request Update</Button>
          </form>
        </div>
      </div>

      {/* Password Update */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 flex items-center">
          <FontAwesomeIcon icon={faLock} className="text-primary-600 mr-2" />
          <h2 className="font-semibold text-neutral-800">Change Password</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-4 max-w-md">
            <Input
              id="currentPassword"
              label="Current Password"
              type="password"
              {...regPass('currentPassword', { required: 'Current password is required' })}
              error={passErrors.currentPassword?.message}
            />
            <Input
              id="newPassword"
              label="New Password"
              type="password"
              {...regPass('newPassword', { 
                required: 'New password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' }
              })}
              error={passErrors.newPassword?.message}
            />
            <Input
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              {...regPass('confirmPassword', { 
                required: 'Please confirm password',
                validate: val => val === newPassword || 'Passwords do not match'
              })}
              error={passErrors.confirmPassword?.message}
            />
            <Button type="submit" isLoading={loadingPassword}>Update Password</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
