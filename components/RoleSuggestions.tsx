'use client';

import { useState } from 'react';
import { Loader2, Briefcase, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RoleSuggestion } from '@/types';

interface RoleSuggestionsProps {
  resumeText: string;
  onRoleSelect: (role: string) => void;
}

const colors = [
  { bg: 'var(--green-light)', text: 'var(--green-dark)', accent: 'var(--green)' },
  { bg: 'var(--blue-light)', text: 'var(--blue)', accent: 'var(--blue)' },
  { bg: 'var(--amber-light)', text: 'var(--amber)', accent: 'var(--amber)' },
  { bg: '#EEEDFE', text: '#3C3489', accent: '#534AB7' },
  { bg: '#FBEAF0', text: '#72243E', accent: '#993556' },
];

export default function RoleSuggestions({ resumeText, onRoleSelect }: RoleSuggestionsProps) {
  const [roles, setRoles] = useState<RoleSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setRoles(data.roles);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleClick = (role: string) => {
    setSelectedRole(role);
    onRoleSelect(role);
  };

  return (
    <div className="space-y-4">

      {!roles.length && (
        <Button onClick={handleGenerate} disabled={isLoading} className="w-full h-11" style={{ background: 'var(--green)' }}>
          {isLoading
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Finding best roles...</>
            : <><Briefcase className="w-4 h-4 mr-2" />Find My Best Roles</>
          }
        </Button>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {roles.map((role, i) => {
        const color = colors[i % colors.length];
        const isSelected = selectedRole === role.role;
        return (
          <div
            key={i}
            onClick={() => handleRoleClick(role.role)}
            className={`
              p-4 rounded-xl border cursor-pointer transition-all duration-150
              ${isSelected ? 'border-[--green] shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}
            `}
            style={isSelected ? { borderColor: 'var(--green)', background: 'var(--green-light)' } : {}}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-xs font-medium shrink-0"
                style={{ background: color.bg, color: color.text }}
              >
                {role.role.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800 truncate">{role.role}</p>
                  <p className="text-lg font-medium shrink-0" style={{ color: color.accent }}>
                    {role.matchPercentage}%
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{role.reason}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {role.skills.map((skill, j) => (
                    <span key={j} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {roles.length > 0 && (
        <p className="text-xs text-center text-slate-400">
          Click a role to generate interview questions for it
        </p>
      )}

    </div>
  );
}