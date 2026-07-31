import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Link2, Zap, BarChart3, QrCode, Settings, ArrowRight,
  Shield, MousePointerClick, Globe, ChevronRight
} from 'lucide-react';
import backgroundImage from '../assets/background.png';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: Link2,
      title: 'Custom Aliases',
      description: 'Create branded short links that are easy to remember and share.',
    },
    {
      icon: QrCode,
      title: 'QR Code Generation',
      description: 'Instantly generate and download QR codes for any shortened link.',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Get detailed insights into your link performance and audience.',
    },
    {
      icon: Settings,
      title: 'Link Management',
      description: 'Edit, activate, deactivate or delete your links with full control.',
    },
  ];

  const steps = [
    { step: '01', title: 'Paste Your URL', description: 'Enter any long URL you want to shorten.' },
    { step: '02', title: 'Customize', description: 'Add a custom alias or let us generate one.' },
    { step: '03', title: 'Share & Track', description: 'Share your link and monitor performance.' },
  ];

  const stats = [
    { value: '10M+', label: 'Links Created' },
    { value: '50M+', label: 'Clicks Tracked' },
    { value: '99.9%', label: 'Uptime' },
    { value: '150+', label: 'Countries' },
  ];

  return (
    <div className="min-h-screen bg-landing-bg text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-landing-bg/75 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <Link2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">Linkly</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How It Works</a>
              <a href="#stats" className="text-sm text-white/60 hover:text-white transition-colors">Stats</a>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors px-4 py-2">
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-gradient px-5 py-2 text-sm rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-landing-bg via-landing-bg/95 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary-300">
                <Zap className="w-3 h-3" />
                Fast • Secure • Reliable
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white"
            >
              Shorten Links,{' '}
              <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-primary-500 bg-clip-text text-transparent">
                Share Everywhere
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-white/80 leading-relaxed max-w-lg"
            >
              Transform long, messy URLs into short, powerful links.
              Track clicks, analyze performance, and grow your reach.
            </motion.p>

            {/* CTA URL Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg"
            >
              <div className="flex-1 relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Paste your long URL here..."
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  onFocus={() => navigate('/register')}
                />
              </div>
              <Link
                to="/register"
                className="btn btn-gradient h-12 px-6 rounded-xl text-sm font-semibold whitespace-nowrap flex items-center gap-2"
              >
                Shorten It <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-6"
            >
              {[
                { icon: Zap, text: 'Lightning Fast' },
                { icon: BarChart3, text: 'Smart Analytics' },
                { icon: Shield, text: 'Secure & Private' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-sm text-white/70">
                  <item.icon className="w-4 h-4 text-primary-400" />
                  {item.text}
                </div>
              ))}
            </motion.div>

            {/* Trusted By */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 pt-8 border-t border-white/5"
            >
              <p className="text-xs text-white/50 uppercase tracking-widest mb-4">Trusted by creators, developers and businesses</p>
              <div className="flex flex-wrap items-center gap-8">
                {['Google', 'Microsoft', 'Amazon', 'Spotify', 'Airbnb'].map((company) => (
                  <span key={company} className="text-lg font-semibold text-white/35">{company}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-landing-bg via-[#0a0f2e] to-landing-bg" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Powerful Features for Everyone
            </h2>
            <p className="mt-4 text-white/70 text-lg max-w-2xl mx-auto">
              Everything you need to shorten, share and analyze your links.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                {...stagger}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-5 group-hover:bg-primary-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">How It Works</h2>
            <p className="mt-4 text-white/70 text-lg">Three simple steps to get started.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                {...stagger}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center p-8"
              >
                <div className="text-6xl font-extrabold text-primary-500/10 mb-4 text-white">{step.step}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                <p className="text-white/70 text-sm">{step.description}</p>
                {index < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 text-white/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/20 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                {...stagger}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-extrabold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="relative rounded-3xl p-12 md:p-16 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(139,92,246,0.1))',
              border: '1px solid rgba(139,92,246,0.2)',
            }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Ready to shorten your first link?
            </h2>
            <p className="text-white/70 text-lg max-w-lg mx-auto mb-8">
              Join thousands of users who trust Linkly to manage their links.
            </p>
            <Link
              to="/register"
              className="btn btn-gradient px-8 py-3.5 text-base rounded-xl font-semibold inline-flex items-center gap-2"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <Link2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold tracking-tight">Linkly</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            </div>
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} Linkly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
