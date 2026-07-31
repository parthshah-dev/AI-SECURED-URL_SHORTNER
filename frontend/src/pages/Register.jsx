import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Backend expects: { name, email, password }
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password
      });
      toast.success('Registration successful. Please check your email to activate your account.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { width: '0%', color: 'bg-neutral-600', label: '' };
    if (pwd.length < 6) return { width: '25%', color: 'bg-red-500', label: 'Weak' };
    if (pwd.length < 8) return { width: '50%', color: 'bg-amber-500', label: 'Fair' };
    if (pwd.length < 12) return { width: '75%', color: 'bg-primary-500', label: 'Good' };
    return { width: '100%', color: 'bg-emerald-500', label: 'Strong' };
  };

  const strength = getPasswordStrength(password);

  const inputClass = 'w-full h-11 rounded-lg bg-white/5 border border-white/10 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all';

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Create an Account ✨</h1>
        <p className="text-white/50 mt-2 text-sm">Join us and start shortening your URLs</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1.5">Full Name</label>
          <input
            id="name"
            placeholder="John Doe"
            className={inputClass}
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="mt-1.5 text-sm text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1.5">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={inputClass}
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Minimum 8 characters"
            className={inputClass}
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long'
              }
            })}
          />
          {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>}
          {password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden mr-3">
                  <div className={`h-full rounded-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }} />
                </div>
                <span className="text-xs text-white/40">{strength.label}</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-1.5">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            className={inputClass}
            {...register('confirmPassword', { 
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
          />
          {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-400">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" variant="gradient" className="w-full h-11 rounded-xl" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-white/40">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
