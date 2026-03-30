'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import FileUpload from '@/components/FileUpload';
import ResumeAnalysis from '@/components/ResumeAnalysis';
import RoleSuggestions from '@/components/RoleSuggestions';
import InterviewQuestions from '@/components/InterviewQuestions';
import LinkedInGenerator from '@/components/LinkedInGenerator';
import { ResumeData } from '@/types';
import { signOut } from '@/app/actions/auth';
import { LogOut } from 'lucide-react';

const tabTitles: Record<string, { title: string; subtitle: string }> = {
  upload: { title: 'Upload your resume', subtitle: 'Get instant AI-powered career analysis' },
  analysis: { title: 'Resume Analysis', subtitle: 'AI-powered feedback on your profile' },
  roles: { title: 'Role Matches', subtitle: 'Best-fit roles based on your skills' },
  interview: { title: 'Interview Prep', subtitle: 'Role-specific questions with tips' },
  linkedin: { title: 'LinkedIn Generator', subtitle: 'AI-crafted headline & summary' },
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleUploadSuccess = (data: ResumeData) => {
    setResumeData(data);
    setActiveTab('analysis');
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setActiveTab('interview');
  };

  const { title, subtitle } = tabTitles[activeTab];

  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fileName={resumeData?.fileName ?? null}
      />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">

          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl text-slate-800 mb-1">{title}</h1>
              <p className="text-slate-500 text-sm">{subtitle}</p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
              >
                <LogOut size={13} />
                Sign out
              </button>
            </form>
          </div>

          {/* Content */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <FileUpload onUploadSuccess={handleUploadSuccess} />
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'AI', label: 'Resume scoring', color: 'var(--green)' },
                  { value: '5+', label: 'Role matches', color: 'var(--blue)' },
                  { value: '8', label: 'Interview Qs', color: 'var(--amber)' },
                ].map(({ value, label, color }) => (
                  <div key={label} className="bg-white border border-slate-100 rounded-xl p-4 text-center">
                    <p className="text-2xl font-medium" style={{ color }}>{value}</p>
                    <p className="text-xs text-slate-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analysis' && resumeData && (
            <ResumeAnalysis resumeText={resumeData.text} />
          )}

          {activeTab === 'roles' && resumeData && (
            <RoleSuggestions
              resumeText={resumeData.text}
              onRoleSelect={handleRoleSelect}
            />
          )}

          {activeTab === 'interview' && resumeData && (
            <InterviewQuestions
              resumeText={resumeData.text}
              selectedRole={selectedRole}
            />
          )}

          {activeTab === 'linkedin' && resumeData && (
            <LinkedInGenerator resumeText={resumeData.text} />
          )}

        </div>
      </main>
    </div>
  );
}