'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle, Star, TrendingUp } from 'lucide-react';
import { AnalysisResult } from '@/types';

interface ResumeAnalysisProps {
  resumeText: string;
  fileName?: string;
}

export default function ResumeAnalysis({ resumeText, fileName }: ResumeAnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyse = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setAnalysis(data.analysis);

// Auto-save to Supabase
try {
  const token = localStorage.getItem('token');
await fetch('/api/save-analysis', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    fileName: fileName || 'resume.pdf',
    resumeText,
    analysis: data.analysis,
    roles: null,
  }),
});
} catch (saveErr: unknown) {
  console.error('Save failed:', saveErr instanceof Error ? saveErr.message : saveErr);
}

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-4">
      {/* Analyse Button */}
      {!analysis && (
        <Button
          onClick={handleAnalyse}
          disabled={isLoading}
          className="w-full h-12 text-base"
          style={{ background: 'var(--green)' }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analysing your resume...
            </>
          ) : (
            <>
              <Star className="w-4 h-4 mr-2" />
              Analyse My Resume
            </>
          )}
        </Button>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Results */}
      {analysis && (
        <div className="space-y-4">

          {/* Score Card */}
          <Card className={`border ${getScoreBg(analysis.overallScore)}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Overall Resume Score</p>
                  <p className={`text-5xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}
                    <span className="text-2xl text-slate-400">/100</span>
                  </p>
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-current flex items-center justify-center"
                  style={{ borderColor: analysis.overallScore >= 80 ? '#16a34a' : analysis.overallScore >= 60 ? '#ca8a04' : '#dc2626' }}>
                  <TrendingUp className={`w-8 h-8 ${getScoreColor(analysis.overallScore)}`} />
                </div>
              </div>
              <p className="text-slate-600 mt-4 text-sm leading-relaxed">
                {analysis.summary}
              </p>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.strengths.map((strength, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <p className="text-sm text-slate-700">{strength}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.improvements.map((improvement, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-500 mt-0.5">→</span>
                  <p className="text-sm text-slate-700">{improvement}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Top Keywords in Your Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword, i) => (
                  <Badge key={i} variant="secondary" className="text-sm">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Re-analyse button */}
          <Button
            variant="outline"
            onClick={handleAnalyse}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Re-analysing...</>
            ) : (
              'Re-analyse Resume'
            )}
          </Button>

        </div>
      )}
    </div>
  );
}