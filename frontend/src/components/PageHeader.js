import React from 'react';

export default function PageHeader({ icon: Icon, title, description, badge, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-blue/15 border border-brand-blue/25 flex items-center justify-center flex-shrink-0">
          <Icon size={20} className="text-brand-blue" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-white">{title}</h1>
            {badge && <span className="badge-blue">{badge}</span>}
          </div>
          {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
