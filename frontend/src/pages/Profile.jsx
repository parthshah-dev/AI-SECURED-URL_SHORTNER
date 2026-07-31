import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import Input from '../components/forms/Input';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Shield, Calendar } from 'lucide-react';

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
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Profile" subtitle="Manage your account settings." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-500/20">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">{user?.name}</h3>
              <p className="text-sm text-neutral-500 mt-0.5">{user?.email}</p>
              
              <div className="mt-4 flex items-center gap-1.5">
                <span className="badge badge-active">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Verified
                </span>
              </div>

              <div className="mt-6 w-full pt-4 border-t border-neutral-100 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-600 truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-600">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Member'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-600">{user?.emailVerified ? 'Email Verified' : 'Email Not Verified'}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Forms Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details */}
          <motion.div
            className="card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-neutral-800">Profile Details</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleNameSubmit(onUpdateName)} className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex-1 w-full">
                  <Input
                    id="name"
                    label="Full Name"
                    placeholder="Enter your name"
                    {...regName('name', { required: 'Name is required' })}
                    error={nameErrors.name?.message}
                  />
                </div>
                <div className="pt-0 sm:pt-[26px]">
                  <Button type="submit" isLoading={loadingName}>Save</Button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Change Password */}
          <motion.div
            className="card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-neutral-800">Change Password</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handlePassSubmit(onChangePassword)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="currentPassword"
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                    {...regPass('currentPassword', { required: 'Current password is required' })}
                    error={passErrors.currentPassword?.message}
                  />
                  <div></div>
                  <Input
                    id="newPassword"
                    label="New Password"
                    type="password"
                    placeholder="Minimum 8 characters"
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
                    placeholder="Repeat new password"
                    {...regPass('confirmPassword', { 
                      required: 'Please confirm password',
                      validate: val => val === newPassword || 'Passwords do not match'
                    })}
                    error={passErrors.confirmPassword?.message}
                  />
                </div>
                <Button type="submit" isLoading={loadingPassword}>Update Password</Button>
              </form>
            </div>
          </motion.div>

          {/* Change Email */}
          <motion.div
            className="card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary-600" />
                <h2 className="font-semibold text-neutral-800">Change Email Address</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-neutral-500 mb-4">A verification link will be sent to your new email address.</p>
              <form onSubmit={handleEmailSubmit(onRequestEmailUpdate)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="newEmail"
                    label="New Email Address"
                    type="email"
                    placeholder="Enter new email"
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
                    placeholder="Enter your current password"
                    {...regEmail('password', { required: 'Password is required to change email' })}
                    error={emailErrors.password?.message}
                  />
                </div>
                <Button type="submit" variant="outline" isLoading={loadingEmail}>Send Verification Link</Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
