import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/forms/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Welcome Back! 👋</h1>
        <p className="text-white/50 mt-2 text-sm">Login to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full h-11 rounded-lg bg-white/5 border border-white/10 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-white/70">
              Password
            </label>
            <span className="text-xs text-primary-400 hover:text-primary-300 cursor-pointer">
              Forgot password?
            </span>
          </div>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full h-11 rounded-lg bg-white/5 border border-white/10 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
          />
          <label htmlFor="remember" className="text-sm text-white/50">Remember me</label>
        </div>

        <Button type="submit" variant="gradient" className="w-full h-11 rounded-xl" isLoading={isLoading}>
          Login
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-white/40">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
