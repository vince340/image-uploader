import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, Trash2, ChevronLeft, ChevronRight, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageFile } from '@/types';
import { formatDate, getShareableImageUrl } from '@/lib/imageService';

interface ImageViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: ImageFile | null;
  images: ImageFile[];
  onDelete: (imageId: number) => void;
}

export default function ImageViewerModal({
  open,
  onOpenChange,
  image,
  images,
  onDelete
}: ImageViewerModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    if (image && open) {
      const index = images.findIndex(img => img.id === image.id);
      if (index !== -1) {
        setCurrentImageIndex(index);
      }
    }
  }, [image, images, open]);
  
  const handleDownload = () => {
    if (!currentImage || !currentImage.data) return;
    
    // Create a Blob from the base64 data
    const byteString = atob(currentImage.data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: currentImage.mimetype });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = currentImage.originalname;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handlePrevious = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };
  
  const handleNext = () => {
    setCurrentImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };
  
  const handleCopyLink = () => {
    if (!currentImage) return;
    
    const shareableUrl = getShareableImageUrl(currentImage);
    navigator.clipboard.writeText(shareableUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Image link has been copied to your clipboard",
        duration: 3000,
      });
    }).catch(() => {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
        duration: 3000,
      });
    });
  };
  
  const currentImage = images[currentImageIndex];
  
  if (!open || !currentImage) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0 border-purple-100 shadow-xl overflow-hidden" aria-describedby="image-viewer-description">
        <DialogTitle className="sr-only">
          Image Viewer - {currentImage.originalname}
        </DialogTitle>
        <div className="sr-only" id="image-viewer-description">
          Image viewer modal that allows you to view the full-size image, download it, copy its link, or delete it.
        </div>
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-4 top-4 z-10 rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors duration-200"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="relative h-[70vh] bg-gradient-to-br from-purple-900/10 to-purple-100/20 flex items-center justify-center">
            <img 
              src={currentImage.data ? `data:${currentImage.mimetype};base64,${currentImage.data}` : ''} 
              alt={currentImage.originalname} 
              className="max-w-full max-h-full object-contain shadow-lg"
            />
            
            {images.length > 1 && (
              <>
                <Button 
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors duration-200"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition-colors duration-200"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
          
          <div className="p-5 border-t border-purple-100 bg-white/90 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  {currentImage.originalname}
                </h3>
                <p className="text-sm text-neutral-600">Uploaded on {formatDate(currentImage.uploadDate)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-purple-200 hover:bg-purple-50 hover:text-primary transition-colors"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-blue-200 text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={handleCopyLink}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  onClick={() => {
                    onDelete(currentImage.id);
                    onOpenChange(false);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
