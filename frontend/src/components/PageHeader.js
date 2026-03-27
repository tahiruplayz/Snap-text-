import React from 'react';

export default function PageHeader({ icon: Icon, title, description, badge, action, iconColor = 'text-blue-400', iconBg = 'bg-blue-500/10' }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-2xl ${iconBg} border border-white/10 flex items-center justify-center flex-shrink-0 ${iconColor}`}>
          <Icon size={22} />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
            {badge && <span className="badge-blue text-xs">{badge}</span>}
          </div>
          {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
