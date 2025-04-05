import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import { UploadingImage } from '@/types';

interface UploadProgressProps {
  uploads: UploadingImage[];
  onRetry: (uploadId: string) => void;
}

export default function UploadProgress({ uploads, onRetry }: UploadProgressProps) {
  // Don't show the progress component if no uploads are in progress
  if (uploads.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 glass-effect border-purple-100 shadow-lg overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-5">
          Uploading Images
        </h3>
        
        <div className="space-y-5">
          {uploads.map((upload) => (
            <div 
              key={upload.id} 
              className={`upload-progress-item p-3 rounded-lg transition-all duration-300 ${
                upload.status === 'success' 
                  ? 'bg-green-50 border border-green-100' 
                  : upload.status === 'error'
                    ? 'bg-red-50 border border-red-100'
                    : 'bg-white/70 border border-purple-100 hover:bg-purple-50/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white shadow-sm mr-1 overflow-hidden border border-purple-100">
                  <img 
                    src={URL.createObjectURL(upload.file)} 
                    alt={`Uploading ${upload.file.name}`}
                    className="w-full h-full object-cover"
                    onLoad={(e) => {
                      URL.revokeObjectURL((e.target as HTMLImageElement).src);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-neutral-800 truncate max-w-xs">
                      {upload.file.name}
                    </span>
                    <div className="flex items-center">
                      {upload.status === 'uploading' && (
                        <span className="inline-block h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                      )}
                      <span className={`text-sm font-medium ${getStatusTextColor(upload.status)}`}>
                        {getStatusText(upload)}
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={upload.progress} 
                    className={`h-2.5 ${
                      upload.status === 'success' 
                        ? 'bg-green-100' 
                        : upload.status === 'error'
                          ? 'bg-red-100'
                          : 'bg-purple-100'
                    }`} 
                  />
                  {upload.error && (
                    <p className="text-xs text-red-500 mt-1">{upload.error}</p>
                  )}
                </div>
                {upload.status === 'error' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2 text-red-500 hover:text-white hover:bg-red-500 border-red-200" 
                    onClick={() => onRetry(upload.id)}
                    title="Retry upload"
                  >
                    <RotateCw className="h-4 w-4 mr-1" /> Retry
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusText(upload: UploadingImage): string {
  switch (upload.status) {
    case 'uploading':
      return `${upload.progress}%`;
    case 'success':
      return 'Completed';
    case 'error':
      return 'Failed';
    default:
      return 'Waiting...';
  }
}

function getStatusTextColor(status: UploadingImage['status']): string {
  switch (status) {
    case 'success':
      return 'text-green-500';
    case 'error':
      return 'text-red-500';
    default:
      return 'text-neutral-500';
  }
}
