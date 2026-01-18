import React from 'react';
import { Link } from 'wouter';
import { Smartphone, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl shadow-2xl shadow-amber-500/30 flex items-center justify-center transform rotate-3">
            <span className="text-4xl font-bold text-white">SCG</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
            SCG Wallet System
          </h1>
          <p className="text-xl text-slate-400">
            Luxury Point Trading • Admin Dashboard • Real-time Sync
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Mobile App Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/app/login">
              <div className="group bg-slate-900/50 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-8 hover:border-amber-500/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-amber-500/10 hover:scale-105 duration-300">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <Smartphone className="text-amber-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-amber-400">Mobile Wallet</h2>
                <p className="text-slate-400 mb-4">
                  Trade points, view news feed, chat with support
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Username + PIN Login</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>3D Animated Globe</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Real-time Updates</span>
                  </div>
                </div>
                <div className="flex items-center text-amber-400 group-hover:translate-x-2 transition-transform">
                  <span className="font-medium">Access Wallet</span>
                  <ArrowRight className="ml-2" size={20} />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Admin Panel Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/admin/login">
              <div className="group bg-slate-900/50 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-105 duration-300">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Shield className="text-blue-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-blue-400">Admin Panel</h2>
                <p className="text-slate-400 mb-4">
                  Manage users, approve transactions, create content
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>User Management</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Data Center Control</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Customer Service</span>
                  </div>
                </div>
                <div className="flex items-center text-blue-400 group-hover:translate-x-2 transition-transform">
                  <span className="font-medium">Admin Login</span>
                  <ArrowRight className="ml-2" size={20} />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900/30 border border-slate-800 rounded-xl p-6"
        >
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick Test Credentials
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-amber-400 font-medium mb-2">Mobile User:</p>
              <p className="text-slate-400">Username: <span className="text-white font-mono">testuser</span></p>
              <p className="text-slate-400">PIN: <span className="text-white font-mono">123456</span></p>
            </div>
            <div>
              <p className="text-blue-400 font-medium mb-2">Admin Access:</p>
              <p className="text-slate-400">Email: <span className="text-white font-mono text-xs">mawsisocial@gmail.com</span></p>
              <p className="text-slate-400">Code: <span className="text-white font-mono">ADMIN</span> / PIN: <span className="text-white font-mono">888999</span></p>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-slate-600 text-xs mt-8">
          Backend Status: Check the health indicator after logging in
        </p>
      </div>
    </div>
  );
}
