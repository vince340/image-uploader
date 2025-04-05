import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download, Trash2, List, Grid, Image as ImageIcon } from 'lucide-react';
import { ImageFile, ViewMode } from '@/types';
import { formatDate, formatFileSize, getImageUrl } from '@/lib/imageService';

interface GallerySectionProps {
  images: ImageFile[];
  onDeleteImage: (imageId: number) => void;
  onViewImage: (image: ImageFile) => void;
}

export default function GallerySection({ 
  images, 
  onDeleteImage, 
  onViewImage 
}: GallerySectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const downloadImage = (image: ImageFile) => {
    if (!image.data) return;
    
    // Create a Blob from the base64 data
    const byteString = atob(image.data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: image.mimetype });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = image.originalname;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Your Gallery
        </h2>
        <div className="flex items-center">
          <span className="text-sm text-neutral-500 mr-3">View:</span>
          <div className="flex shadow-sm rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              className={`rounded-l-md px-3 transition-all duration-300 ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-purple-50'}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Grid className="h-4 w-4 mr-1" /> Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              className={`rounded-r-md px-3 transition-all duration-300 ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-purple-50'}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List className="h-4 w-4 mr-1" /> List
            </Button>
          </div>
        </div>
      </div>
      
      <Card className="glass-effect border-purple-100 shadow-lg overflow-hidden">
        <CardContent className="p-6">
          {images.length === 0 ? (
            <div className="py-16 text-center animated-gradient rounded-lg">
              <div className="bg-white/80 backdrop-blur-sm py-10 px-6 rounded-lg">
                <div className="p-4 bg-white/50 rounded-full inline-block mb-4">
                  <ImageIcon className="h-16 w-16 text-primary/60 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">No images yet</h3>
                <p className="text-neutral-600 mb-6">Your gallery is waiting for your beautiful images</p>
                <Button variant="default" className="button-hover">
                  Get Started with Upload
                </Button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <div key={image.id} className="image-card group relative">
                  <div className="aspect-square rounded-lg overflow-hidden bg-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300">
                    <img 
                      src={image.data ? `data:${image.mimetype};base64,${image.data}` : ''}
                      alt={image.originalname}
                      className="w-full h-full object-cover transform transition-transform group-hover:scale-105 duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                    <div className="w-full p-4 flex justify-center gap-3">
                      <Button
                        size="icon"
                        className="rounded-full h-9 w-9 bg-white/90 text-primary hover:bg-primary hover:text-white transition-colors duration-200 shadow-md"
                        onClick={() => onViewImage(image)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="rounded-full h-9 w-9 bg-white/90 text-neutral-700 hover:bg-neutral-700 hover:text-white transition-colors duration-200 shadow-md"
                        onClick={() => downloadImage(image)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="rounded-full h-9 w-9 bg-white/90 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 shadow-md"
                        onClick={() => onDeleteImage(image.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 px-1">
                    <p className="text-sm font-medium text-neutral-700 truncate">{image.originalname}</p>
                    <p className="text-xs text-neutral-500">Uploaded on {formatDate(image.uploadDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg shadow-sm">
              <table className="w-full caption-bottom text-sm bg-white/80 backdrop-blur-sm">
                <thead className="bg-purple-50/80">
                  <tr>
                    <th className="h-12 px-4 text-left align-middle font-medium text-purple-700">Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-purple-700 hidden md:table-cell">Size</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-purple-700 hidden md:table-cell">Date</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-purple-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((image, index) => (
                    <tr 
                      key={image.id} 
                      className={`border-b border-purple-100 hover:bg-purple-50/40 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white/40' : 'bg-purple-50/20'}`}
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-md overflow-hidden bg-neutral-200 shrink-0 shadow-sm ring-1 ring-purple-100">
                            <img 
                              src={image.data ? `data:${image.mimetype};base64,${image.data}` : ''}
                              alt={image.originalname}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-medium text-neutral-800 truncate max-w-[150px] block">{image.originalname}</span>
                            <span className="text-xs text-neutral-500 md:hidden">{formatFileSize(image.size)} • {formatDate(image.uploadDate)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle hidden md:table-cell text-neutral-600">{formatFileSize(image.size)}</td>
                      <td className="p-4 align-middle hidden md:table-cell text-neutral-600">{formatDate(image.uploadDate)}</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-primary rounded-full hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                            onClick={() => onViewImage(image)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-neutral-700 rounded-full hover:bg-neutral-700/10 hover:text-neutral-900 transition-colors duration-200"
                            onClick={() => downloadImage(image)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 rounded-full hover:bg-red-500/10 transition-colors duration-200"
                            onClick={() => onDeleteImage(image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
