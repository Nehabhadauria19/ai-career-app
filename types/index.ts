export interface ResumeData {
  text: string;
  wordCount: number;
  fileName: string;
  uploadedAt: Date;
}

export interface AnalysisResult {
  strengths: string[];
  improvements: string[];
  overallScore: number;
  summary: string;
  keywords: string[]
}

export interface RoleSuggestion {
  role: string;
  matchPercentage: number;
  reason: string;
  skills: string[];
}

export interface InterviewQuestion {
  question: string;
  category: string;
  tips: string;
}

export interface LinkedInContent {
  headline: string;
  summary: string;
}