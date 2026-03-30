'use client';

import { useState } from 'react';
import { Loader2, MessageSquare, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InterviewQuestion } from '@/types';

interface InterviewQuestionsProps {
  resumeText: string;
  selectedRole: string | null;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  Behavioural: { bg: 'var(--blue-light)', text: 'var(--blue)' },
  Technical: { bg: 'var(--amber-light)', text: 'var(--amber)' },
  Situational: { bg: 'var(--green-light)', text: 'var(--green-dark)' },
  HR: { bg: '#EEEDFE', text: '#3C3489' },
};

export default function InterviewQuestions({ resumeText, selectedRole }: InterviewQuestionsProps) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Behavioural', 'Technical', 'Situational', 'HR'];

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          role: selectedRole || 'Software Developer',
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setQuestions(data.questions);
      setOpenIndex(0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = activeFilter === 'All'
    ? questions
    : questions.filter(q => q.category === activeFilter);

  return (
    <div className="space-y-4">

      {/* Role indicator */}
      {selectedRole && (
        <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'var(--green-light)' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)' }} />
          <p className="text-sm" style={{ color: 'var(--green-dark)' }}>
            Generating questions for: <span className="font-medium">{selectedRole}</span>
          </p>
        </div>
      )}

      {!questions.length && (
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full h-11"
          style={{ background: 'var(--green)' }}
        >
          {isLoading
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating questions...</>
            : <><MessageSquare className="w-4 h-4 mr-2" />Generate Interview Questions</>
          }
        </Button>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Filter tabs */}
      {questions.length > 0 && (
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`
                flex-1 py-1.5 text-xs rounded-md transition-all
                ${activeFilter === f ? 'bg-white text-slate-800 font-medium shadow-sm' : 'text-slate-500'}
              `}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Questions */}
      {filtered.map((q, i) => {
        const color = categoryColors[q.category] || { bg: '#F1EFE8', text: '#5F5E5A' };
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="bg-white border border-slate-100 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full p-4 text-left flex items-start gap-3"
            >
              <span
                className="text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                style={{ background: color.bg, color: color.text }}
              >
                {q.category}
              </span>
              <span className="text-sm text-slate-700 flex-1 leading-relaxed">
                {q.question}
              </span>
              {isOpen
                ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              }
            </button>
            {isOpen && (
              <div className="px-4 pb-4">
                <div className="p-3 rounded-lg text-xs text-slate-600 leading-relaxed" style={{ background: 'var(--green-light)', color: 'var(--green-dark)' }}>
                  <span className="font-medium">Tip: </span>{q.tips}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {questions.length > 0 && (
        <Button
          variant="outline"
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Regenerating...</> : 'Regenerate Questions'}
        </Button>
      )}

    </div>
  );
}