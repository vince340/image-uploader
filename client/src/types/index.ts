export interface ImageFile {
  id: number;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  data?: string; // Base64 encoded image data
  uploadDate: string;
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface UploadingImage {
  id: string; // Temporary client-side ID
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error';
  title: string;
  message: string;
  autoClose?: boolean;
}

export type ViewMode = 'grid' | 'list';
