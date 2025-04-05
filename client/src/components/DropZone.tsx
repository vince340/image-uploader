import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { CloudUpload } from 'lucide-react';
import { isAcceptableImageType } from '@/lib/imageService';
import { useToast } from '@/hooks/use-toast';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
}

export default function DropZone({ onFilesSelected }: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter out any non-image files
    const imageFiles = acceptedFiles.filter(isAcceptableImageType);
    
    // Check if any files were rejected
    if (imageFiles.length < acceptedFiles.length) {
      toast({
        title: "Unsupported file type",
        description: "Some files were rejected. Only JPEG, PNG, and GIF images are supported.",
        variant: "destructive",
      });
    }
    
    // Check if we have any valid files
    if (imageFiles.length > 0) {
      onFilesSelected(imageFiles);
    } else if (acceptedFiles.length > 0) {
      toast({
        title: "Invalid files",
        description: "None of the selected files are supported. Please upload JPEG, PNG, or GIF images.",
        variant: "destructive",
      });
    }
  }, [onFilesSelected, toast]);

  const {
    getRootProps,
    getInputProps,
    isDragActive: dropzoneIsDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  return (
    <div 
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ease-in-out glass-effect shadow-md ${
        isDragActive || dropzoneIsDragActive 
          ? 'border-primary bg-primary/10 scale-102 shadow-lg' 
          : 'border-purple-200 hover:border-primary/40 hover:bg-purple-50/50'
      }`}
    >
      <div className="max-w-md mx-auto py-8">
        <div className={`rounded-full p-4 inline-block mb-4 transition-all duration-300 ${
          isDragActive || dropzoneIsDragActive ? 'bg-primary/20 animate-pulse' : 'bg-purple-100'
        }`}>
          <CloudUpload className="h-12 w-12 text-primary mx-auto" />
        </div>
        
        <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
          Upload your images
        </h3>
        <p className="text-neutral-600 mb-6">Drag and drop your images here, or click to browse</p>
        
        <Button variant="default" className="mx-auto button-hover px-6 py-2 font-medium shadow-md">
          Select Files
          <input {...getInputProps()} className="hidden" />
        </Button>
        
        <div className="mt-6 text-sm text-neutral-500 flex justify-center gap-4">
          <span className="px-2 py-1 rounded-full bg-purple-100 text-primary">JPEG</span>
          <span className="px-2 py-1 rounded-full bg-purple-100 text-primary">PNG</span>
          <span className="px-2 py-1 rounded-full bg-purple-100 text-primary">GIF</span>
        </div>
      </div>
    </div>
  );
}
