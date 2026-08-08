import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import { getStats } from './services/api';

export default function App() {
  const [stats, setStats] = useState({ total: 0, applied: 0, interviews: 0, offers: 0, rejected: 0 });

  const fetchDashboardStats = async () => {
    try {
      const response = await getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onOpenAddModal={() => alert("Add Modal Coming in Day 4!")} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Stats */}
        <StatsCards stats={stats} />

        {/* Placeholder for Day 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 mt-6 shadow-sm">
          <p className="font-medium text-slate-700 text-lg">Application Cards & Interactive Form Modal</p>
          <p className="text-sm text-slate-400 mt-1">Coming up in Day 4!</p>
        </div>
      </main>
    </div>
  );
}
