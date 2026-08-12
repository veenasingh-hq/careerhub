import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import ApplicationCard from './components/ApplicationCard';
import ApplicationModal from './components/ApplicationModal';
import FilterBar from './components/FilterBar';
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

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

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

  // Filtered and Sorted Applications
  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesSearch =
          app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.role.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.application_date) - new Date(a.application_date);
        }
        if (sortBy === 'oldest') {
          return new Date(a.application_date) - new Date(b.application_date);
        }
        if (sortBy === 'company_asc') {
          return a.company_name.localeCompare(b.company_name);
        }
        if (sortBy === 'company_desc') {
          return b.company_name.localeCompare(a.company_name);
        }
        return 0;
      });
  }, [applications, searchTerm, statusFilter, sortBy]);

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

  const handleExportCSV = () => {
    if (filteredApplications.length === 0) return;

    const headers = ['Company Name', 'Role', 'Location', 'Application Date', 'Status', 'Resume Version', 'Notes'];

    const csvRows = [
      headers.join(','),
      ...filteredApplications.map((app) =>
        [
          `"${app.company_name.replace(/"/g, '""')}"`,
          `"${app.role.replace(/"/g, '""')}"`,
          `"${app.location.replace(/"/g, '""')}"`,
          `"${app.application_date}"`,
          `"${app.status}"`,
          `"${app.resume_version}"`,
          `"${(app.notes || '').replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `CareerHub_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar onOpenAddModal={handleOpenAddModal} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Stats */}
        <StatsCards stats={stats} />

        {/* Filter & Search Bar */}
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onExportCSV={handleExportCSV}
          totalItems={filteredApplications.length}
        />

        {/* Applications List Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Your Applications ({filteredApplications.length})
            </h2>
          </div>

          {loading ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
              Loading applications... ⏳
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center">
              <p className="text-slate-600 font-semibold text-lg">No matching applications found!</p>
              <p className="text-slate-400 text-sm mt-1">Try resetting search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((app) => (
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