'use client';

import { useState, useEffect } from 'react';
import { Loader2, FileText, Clock, ChevronRight, AlertCircle } from 'lucide-react';

interface HistoryItem {
  _id: string;
  fileName: string;
  createdAt: string;
  analysis: {
    overallScore: number;
    summary: string;
  } | null;
}

interface HistoryProps {
  onSelect: (id: string, fileName: string) => void;
}

export default function History({ onSelect }: HistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setHistory(data.history);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#1D9E75';
    if (score >= 60) return '#BA7517';
    return '#E24B4A';
  };

 if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
          <p className="text-xs text-slate-400">Loading your analyses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={fetchHistory}
            className="text-xs px-4 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <FileText className="w-7 h-7 text-slate-300" />
        </div>
        <p className="text-sm font-medium text-slate-600 mb-1">No analyses yet</p>
        <p className="text-xs text-slate-400">Upload a resume and analyse it to see your history here</p>
      </div>
    );
  }
return (
    <div className="flex flex-col items-center w-full space-y-3">
{history.map((item) => (
  <div key={item._id} className="w-full">
  <button
    onClick={() => onSelect(item._id, item.fileName)}
   className="w-full bg-white border border-slate-100 rounded-xl p-4 text-left hover:border-[#1D9E75] hover:shadow-sm transition-all group cursor-pointer"
  >

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">
                {item.fileName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-400">
                  {formatDate(item.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {item.analysis && (
                <div className="text-right">
                  <p
                    className="text-lg font-medium"
                    style={{ color: getScoreColor(item.analysis.overallScore) }}
                  >
                    {item.analysis.overallScore}
                  </p>
                  <p className="text-[10px] text-slate-400">score</p>
                </div>
              )}
             <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50 group-hover:bg-[#E1F5EE] transition-all">
  <ChevronRight
    className="w-4 h-4 text-slate-400 group-hover:text-[#1D9E75] transition-colors"
  />
</div>
            </div>
          </div>
       </button>
      </div>
      ))}
    </div>
  );
}