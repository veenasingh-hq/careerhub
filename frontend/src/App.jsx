import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import ApplicationCard from './components/ApplicationCard';
import ApplicationModal from './components/ApplicationModal';
import {
  getApplications,
  getStats,
  createApplication,
  updateApplication,
  deleteApplication,
} from './services/api';

export default function App() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, applied: 0, interviews: 0, offers: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appsRes, statsRes] = await Promise.all([getApplications(), getStats()]);
      setApplications(appsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingApp) {
        await updateApplication(editingApp.id, formData);
      } else {
        await createApplication(formData);
      }
      setIsModalOpen(false);
      setEditingApp(null);
      loadData();
    } catch (error) {
      console.error('Error saving application:', error);
      alert('Failed to save application.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job application?')) return;
    try {
      await deleteApplication(id);
      loadData();
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application.');
    }
  };

  const handleOpenAddModal = () => {
    setEditingApp(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (app) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar onOpenAddModal={handleOpenAddModal} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Stats */}
        <StatsCards stats={stats} />

        {/* Applications List Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Your Applications ({applications.length})</h2>
          </div>

          {loading ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
              Loading applications... ⏳
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center">
              <p className="text-slate-600 font-semibold text-lg">No job applications tracked yet!</p>
              <p className="text-slate-400 text-sm mt-1">Click "+ Add Application" above to add your first job track.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingApp}
      />
    </div>
  );
}
