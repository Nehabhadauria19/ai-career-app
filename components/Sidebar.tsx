'use client';

import { FileText, Star, Briefcase, MessageSquare, ExternalLink } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  fileName: string | null;
}

const navItems = [
  { id: 'upload', label: 'Upload Resume', icon: FileText },
  { id: 'analysis', label: 'AI Analysis', icon: Star },
  { id: 'roles', label: 'Role Matches', icon: Briefcase },
  { id: 'interview', label: 'Interview Prep', icon: MessageSquare },
  { id: 'linkedin', label: 'LinkedIn Gen', icon: ExternalLink   },
];

export default function Sidebar({ activeTab, setActiveTab, fileName }: SidebarProps) {
  return (
    <aside className="w-56 min-h-screen bg-white border-r border-slate-100 flex flex-col py-6 px-4 shrink-0">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-2 h-2 rounded-full bg-[--green]" style={{ background: 'var(--green)' }} />
        <span className="font-display text-lg text-slate-800">Career Coach</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 px-3 mb-2">Menu</p>
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            disabled={id !== 'upload' && !fileName}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left
              transition-all duration-150 w-full
              ${activeTab === id
                ? 'bg-slate-100 text-slate-900 font-medium'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }
              ${id !== 'upload' && !fileName ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <Icon size={15} strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </nav>

      {/* File Badge */}
      {fileName && (
        <div className="mt-auto mx-1 p-3 rounded-lg" style={{ background: 'var(--green-light)' }}>
          <p className="text-[11px] font-medium" style={{ color: 'var(--green-dark)' }}>
            Resume ready
          </p>
          <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--green)' }}>
            {fileName}
          </p>
        </div>
      )}

    </aside>
  );
}