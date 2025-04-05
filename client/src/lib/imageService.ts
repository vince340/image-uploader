import { ImageFile, UploadingImage } from '@/types';

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to format dates
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Generate a data URL for preview from a File object
export const generatePreviewUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Convert base64 data to a Blob URL for display
export const getImageUrl = (image: ImageFile): string => {
  if (!image.data) {
    return '';
  }
  
  // Create a blob from the base64 data
  const byteCharacters = atob(image.data);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  const blob = new Blob(byteArrays, { type: image.mimetype });
  return URL.createObjectURL(blob);
};

// Helper function to generate a unique client-side ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Check if the file is an acceptable image type
export const isAcceptableImageType = (file: File): boolean => {
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  return acceptedTypes.includes(file.type);
};

// Create upload objects from File objects
export const createUploadObjects = (files: File[]): UploadingImage[] => {
  return files.map(file => ({
    id: generateId(),
    file,
    progress: 0,
    status: 'idle',
  }));
};

// Get file extension from filename
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Get a shareable URL for an image
export const getShareableImageUrl = (image: ImageFile): string => {
  // Return the full absolute URL that can be shared
  const baseUrl = window.location.origin;
  return `${baseUrl}/images/${image.id}`;
};
