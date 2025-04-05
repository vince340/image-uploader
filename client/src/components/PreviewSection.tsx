import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Trash2 } from 'lucide-react';
import { generatePreviewUrl, formatFileSize } from '@/lib/imageService';

interface PreviewFile extends File {
  preview?: string;
}

interface PreviewSectionProps {
  files: File[];
  onUpload: () => void;
  onClear: () => void;
  onRemoveFile: (file: File) => void;
}

export default function PreviewSection({ 
  files, 
  onUpload, 
  onClear, 
  onRemoveFile 
}: PreviewSectionProps) {
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);

  useEffect(() => {
    // Generate preview URLs for all files
    const loadPreviews = async () => {
      const filesWithPreviews = await Promise.all(
        files.map(async (file) => {
          const previewFile = file as PreviewFile;
          try {
            previewFile.preview = await generatePreviewUrl(file);
          } catch (error) {
            console.error('Error generating preview for file:', file.name, error);
            previewFile.preview = '';
          }
          return previewFile;
        })
      );
      setPreviewFiles(filesWithPreviews);
    };

    loadPreviews();

    // Cleanup function to revoke object URLs to avoid memory leaks
    return () => {
      previewFiles.forEach((file) => {
        if (file.preview && file.preview.startsWith('blob:')) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  if (files.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 glass-effect border-purple-100 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-3 sm:mb-0">
            Selected Images
          </h3>
          <div className="flex gap-3">
            <Button 
              className="button-hover shadow-md" 
              onClick={onUpload}
              disabled={previewFiles.length === 0}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
            <Button 
              variant="outline" 
              className="border-purple-200 hover:bg-purple-50 hover:text-primary transition-colors" 
              onClick={onClear}
              disabled={previewFiles.length === 0}
            >
              <X className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
        
        {previewFiles.length === 0 ? (
          <div className="py-8 text-center border-2 border-dashed border-purple-100 rounded-lg">
            <p className="text-neutral-500">No images selected yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previewFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="preview-item relative group card-hover">
                <div className="aspect-square rounded-lg overflow-hidden bg-neutral-200 shadow-sm">
                  {file.preview ? (
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="w-full h-full object-cover transform transition-transform group-hover:scale-105 duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <span className="bg-white/80 px-3 py-1 rounded-md text-sm">No preview</span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex items-end justify-center">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="rounded-full h-9 w-9 mb-3 shadow-md"
                    onClick={() => onRemoveFile(file)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 px-1">
                  <div className="text-sm font-medium text-neutral-700 truncate">{file.name}</div>
                  <div className="text-xs text-neutral-500 truncate">
                    {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
