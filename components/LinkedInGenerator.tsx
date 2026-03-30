'use client';

import { useState } from 'react';
import { Loader2, ExternalLink, Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkedInContent } from '@/types';

interface LinkedInGeneratorProps {
  resumeText: string;
}

export default function LinkedInGenerator({ resumeText }: LinkedInGeneratorProps) {
  const [content, setContent] = useState<LinkedInContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<'headline' | 'summary' | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setContent(data.linkedin);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (type: 'headline' | 'summary', text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">

      {!content && (
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full h-11"
          style={{ background: 'var(--green)' }}
        >
          {isLoading
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating LinkedIn content...</>
            : <><ExternalLink className="w-4 h-4 mr-2" />Generate LinkedIn Content</>
          }
        </Button>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {content && (
        <>
          {/* Headline */}
          <div className="bg-white border border-slate-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-800">Headline</p>
              <button
                onClick={() => handleCopy('headline', content.headline)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                style={copied === 'headline'
                  ? { background: 'var(--green-light)', color: 'var(--green-dark)' }
                  : { background: '#F1EFE8', color: '#5F5E5A' }
                }
              >
                {copied === 'headline'
                  ? <><Check size={12} />Copied!</>
                  : <><Copy size={12} />Copy</>
                }
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed p-3 rounded-lg bg-slate-50">
              {content.headline}
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              {content.headline.length} / 220 characters
            </p>
          </div>

          {/* Summary */}
          <div className="bg-white border border-slate-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-800">About Summary</p>
              <button
                onClick={() => handleCopy('summary', content.summary)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                style={copied === 'summary'
                  ? { background: 'var(--green-light)', color: 'var(--green-dark)' }
                  : { background: '#F1EFE8', color: '#5F5E5A' }
                }
              >
                {copied === 'summary'
                  ? <><Check size={12} />Copied!</>
                  : <><Copy size={12} />Copy</>
                }
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed p-3 rounded-lg bg-slate-50 whitespace-pre-line">
              {content.summary}
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              {content.summary.length} / 2000 characters
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setContent(null)}
            className="w-full"
          >
            Regenerate
          </Button>
        </>
      )}

    </div>
  );
}