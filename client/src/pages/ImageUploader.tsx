import { useState, useEffect, useCallback, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { generateId } from '@/lib/imageService';
import { ImageFile, UploadingImage, Notification } from '@/types';

import DropZone from '@/components/DropZone';
import PreviewSection from '@/components/PreviewSection';
import UploadProgress from '@/components/UploadProgress';
import GallerySection from '@/components/GallerySection';
import ImageViewerModal from '@/components/ImageViewerModal';
import Notifications from '@/components/Notifications';
import BackgroundElements from '@/components/BackgroundElements';

export default function ImageUploader() {
  // State for selected files before uploading
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // State for currently uploading files
  const [uploadingFiles, setUploadingFiles] = useState<UploadingImage[]>([]);
  
  // State for notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // State for image viewer modal
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);

  // Fetch all images
  const { data: images = [] } = useQuery<ImageFile[]>({
    queryKey: ['/api/images'],
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Create a custom fetch request for FormData
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      
      // Invalidate images query to fetch updated list
      queryClient.invalidateQueries({ queryKey: ['/api/images'] });
      
      // Add success notification
      addNotification({
        type: 'success',
        title: 'Upload Successful',
        message: `${data.images.length} image(s) have been uploaded`,
        autoClose: true,
      });
      
      // Clear selected files
      setSelectedFiles([]);
      
      // Mark uploads as complete
      setUploadingFiles(prev => 
        prev.map(upload => ({
          ...upload,
          status: 'success',
          progress: 100,
        }))
      );
      
      // Clear the uploads after a delay
      setTimeout(() => {
        setUploadingFiles([]);
      }, 2000);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: error instanceof Error 
          ? error.message 
          : 'Failed to upload images. Please try again.',
        autoClose: true,
      });
      
      // Mark uploads as failed
      setUploadingFiles(prev => 
        prev.map(upload => ({
          ...upload,
          status: 'error',
          progress: 0,
          error: 'Upload failed',
        }))
      );
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (imageId: number) => {
      return apiRequest({
        method: 'DELETE', 
        url: `/api/images/${imageId}`,
        on401: 'throw'
      });
    },
    onSuccess: () => {
      // Invalidate images query to fetch updated list
      queryClient.invalidateQueries({ queryKey: ['/api/images'] });
      
      // Add success notification
      addNotification({
        type: 'success',
        title: 'Image Deleted',
        message: 'Image has been deleted successfully',
        autoClose: true,
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: error instanceof Error 
          ? error.message 
          : 'Failed to delete image. Please try again.',
        autoClose: true,
      });
    },
  });
  
  // Handler for when files are selected via DropZone
  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };
  
  // Handler for removing a file from the selection
  const handleRemoveFile = (file: File) => {
    setSelectedFiles(prev => prev.filter(f => f !== file));
  };
  
  // Handler for clearing all selected files
  const handleClearFiles = () => {
    setSelectedFiles([]);
  };
  
  // Handler for starting the upload process
  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    
    // Create upload objects with progress tracking
    const uploads = selectedFiles.map(file => ({
      id: generateId(),
      file,
      progress: 0,
      status: 'uploading' as const,
    }));
    
    setUploadingFiles(uploads);
    
    // Start the upload
    uploadMutation.mutate(selectedFiles);
    
    // Simulate progress updates
    simulateProgressUpdates(uploads.map(u => u.id));
  };
  
  // Handler for retrying a failed upload
  const handleRetryUpload = (uploadId: string) => {
    const upload = uploadingFiles.find(u => u.id === uploadId);
    if (!upload) return;
    
    // Reset the upload status
    setUploadingFiles(prev => 
      prev.map(u => 
        u.id === uploadId 
          ? { ...u, status: 'uploading', progress: 0, error: undefined } 
          : u
      )
    );
    
    // Start a new upload for just this file
    uploadMutation.mutate([upload.file]);
    
    // Simulate progress updates for this file
    simulateProgressUpdates([uploadId]);
  };
  
  // Function to simulate progress updates during upload
  const simulateProgressUpdates = (uploadIds: string[]) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress > 95) {
        clearInterval(interval);
      }
      
      setUploadingFiles(prev => 
        prev.map(upload => 
          uploadIds.includes(upload.id) && upload.status === 'uploading'
            ? { ...upload, progress }
            : upload
        )
      );
    }, 200);
  };
  
  // Handler for viewing an image in the modal
  const handleViewImage = (image: ImageFile) => {
    setSelectedImage(image);
    setViewerOpen(true);
  };
  
  // Handler for deleting an image
  const handleDeleteImage = (imageId: number) => {
    deleteMutation.mutate(imageId);
  };
  
  // Function to add a notification
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = generateId();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };
  
  // Handler for dismissing a notification
  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 min-h-screen relative z-10">
      {/* Animated Background Elements */}
      <BackgroundElements />
      
      <header className="mb-8 text-center py-6 animate-in fade-in duration-700">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Image Uploader</h1>
        <p className="text-neutral-600 text-lg">Upload and manage your images with style</p>
      </header>

      {/* Drop Zone */}
      <div className="mb-8 animate-in slide-in-from-bottom duration-700 delay-100">
        <DropZone onFilesSelected={handleFilesSelected} />
      </div>

      {/* Preview Section */}
      <div className="animate-in slide-in-from-bottom duration-700 delay-200">
        <PreviewSection 
          files={selectedFiles}
          onUpload={handleUpload}
          onClear={handleClearFiles}
          onRemoveFile={handleRemoveFile}
        />
      </div>

      {/* Upload Progress */}
      <div className="animate-in slide-in-from-bottom duration-700 delay-300">
        <UploadProgress 
          uploads={uploadingFiles}
          onRetry={handleRetryUpload}
        />
      </div>

      {/* Gallery Section */}
      <div className="animate-in slide-in-from-bottom duration-700 delay-400">
        <GallerySection 
          images={images}
          onDeleteImage={handleDeleteImage}
          onViewImage={handleViewImage}
        />
      </div>

      {/* Image Viewer Modal */}
      <ImageViewerModal 
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        image={selectedImage}
        images={images}
        onDelete={handleDeleteImage}
      />

      {/* Notifications */}
      <Notifications 
        notifications={notifications}
        onDismiss={handleDismissNotification}
      />
    </div>
  );
}
