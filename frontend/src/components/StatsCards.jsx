import React from 'react';
import { Briefcase, Clock, CheckCircle2, XCircle, Award, FileSpreadsheet } from 'lucide-react';

export default function StatsCards({ stats }) {
  const cards = [
    { label: 'Total Applications', value: stats?.total || 0, icon: FileSpreadsheet, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Applied', value: stats?.applied || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Interviews', value: stats?.interviews || 0, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Offers', value: stats?.offers || 0, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Rejected', value: stats?.rejected || 0, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 my-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}