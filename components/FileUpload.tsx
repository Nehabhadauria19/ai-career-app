'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResumeData } from '@/types';

interface FileUploadProps {
  onUploadSuccess: (data: ResumeData) => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFile = async (file: File) => {
    // Reset states
    setError(null);
    setIsSuccess(false);

    // Client side validation
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setIsSuccess(true);
      onUploadSuccess({
        text: data.text,
        wordCount: data.wordCount,
        fileName: file.name,
        uploadedAt: new Date(),
      });

    }  catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
    setError(errorMessage);
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setError(null);
    setIsSuccess(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Area */}
      {!uploadedFile && !isSuccess && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center
            transition-all duration-200 cursor-pointer
            ${isDragging
              ? 'border-blue-500 bg-blue-50 scale-[1.02]'
              : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
            }
          `}
          onClick={() => document.getElementById('resume-input')?.click()}
        >
          <input
            id="resume-input"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleInputChange}
          />

          <div className="flex flex-col items-center gap-4">
            <div className={`
              p-4 rounded-full transition-colors duration-200
              ${isDragging ? 'bg-blue-100' : 'bg-white shadow-sm'}
            `}>
              <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-slate-400'}`} />
            </div>

            <div>
              <p className="text-lg font-semibold text-slate-700">
                {isDragging ? 'Drop your resume here' : 'Upload your resume'}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Drag & drop or click to browse
              </p>
            </div>

            <div className="flex gap-2">
              <Badge variant="secondary">PDF only</Badge>
              <Badge variant="secondary">Max 5MB</Badge>
            </div>
          </div>
        </div>
      )}

      {/* Uploading State */}
      {isUploading && uploadedFile && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-700 truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Extracting text from your resume...
                </p>
              </div>
              <Badge variant="secondary">
                {formatFileSize(uploadedFile.size)}
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1.5 bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/4" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {isSuccess && uploadedFile && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-700 truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Resume uploaded successfully ✓
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {formatFileSize(uploadedFile.size)}
                </Badge>
                <button
                  onClick={handleReset}
                  className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Helper text */}
      {!uploadedFile && !error && (
        <p className="text-center text-xs text-slate-400 mt-3">
          Your resume is processed securely and never stored without your permission
        </p>
      )}
    </div>
  );
}