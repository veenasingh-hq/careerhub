import React from 'react';
import { MapPin, Calendar, FileText, Edit2, Trash2, Building2 } from 'lucide-react';

export default function ApplicationCard({ app, onEdit, onDelete }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Offer Received':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Selected':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Interview Scheduled':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-base">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-snug">{app.company_name}</h3>
              <p className="text-sm font-medium text-slate-600">{app.role}</p>
            </div>
          </div>

          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(
              app.status
            )}`}
          >
            {app.status}
          </span>
        </div>

        {/* Metadata Details */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 border-t border-slate-50 pt-3">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{app.location || 'Remote'}</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{app.application_date}</span>
          </div>

          <div className="flex items-center space-x-1.5 col-span-2">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Resume: <strong className="text-slate-700">{app.resume_version}</strong></span>
          </div>
        </div>

        {/* Notes */}
        {app.notes && (
          <div className="mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600 italic">
            "{app.notes}"
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
        <button
          onClick={() => onEdit(app)}
          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
          title="Edit Application"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete(app.id)}
          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          title="Delete Application"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}