import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Plus, Upload, X, Eye } from 'lucide-react';

interface Photo {
  id: string;
  title: string | null;
  image_url: string;
  uploaded_at: string;
  album_id: string;
}

interface Album {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  is_public: boolean;
  created_at: string;
}

export const DynamicGallery = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Form states
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [showUploadPhoto, setShowUploadPhoto] = useState(false);
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch albums
  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('photo_albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlbums(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load albums",
        variant: "destructive",
      });
    }
  };

  // Fetch photos for selected album
  const fetchPhotos = async (albumId: string) => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('album_id', albumId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
      setCurrentIndex(0);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load photos",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAlbums();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedAlbum) {
      fetchPhotos(selectedAlbum.id);
    }
  }, [selectedAlbum]);

  // Create new album
  const createAlbum = async () => {
    if (!user || !albumTitle.trim()) return;
    
    setUploading(true);
    try {
      const { data, error } = await supabase
        .from('photo_albums')
        .insert({
          title: albumTitle,
          description: albumDescription,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setAlbums([data, ...albums]);
      setAlbumTitle('');
      setAlbumDescription('');
      setShowCreateAlbum(false);
      
      toast({
        title: "Success",
        description: "Album created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setUploading(false);
  };

  // Upload photo
  const uploadPhoto = async () => {
    if (!user || !selectedFile || !selectedAlbum) return;
    
    setUploading(true);
    try {
      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('albums')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('albums')
        .getPublicUrl(fileName);

      // Insert photo record
      const { data, error } = await supabase
        .from('photos')
        .insert({
          album_id: selectedAlbum.id,
          title: photoTitle || selectedFile.name,
          image_url: publicUrl,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setPhotos([data, ...photos]);
      setPhotoTitle('');
      setSelectedFile(null);
      setShowUploadPhoto(false);
      
      toast({
        title: "Success",
        description: "Photo uploaded successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setUploading(false);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? photos.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === photos.length - 1 ? 0 : currentIndex + 1);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading gallery...</p>
      </div>
    );
  }

  return (
    <section id="gallery" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-bold neon-text animate-slide-in">
            Dynamic Photo Gallery
          </h2>
          
          {user && (
            <div className="flex gap-4">
              <Dialog open={showCreateAlbum} onOpenChange={setShowCreateAlbum}>
                <DialogTrigger asChild>
                  <Button className="btn-glass">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Album
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-glass-border">
                  <DialogHeader>
                    <DialogTitle>Create New Album</DialogTitle>
                    <DialogDescription>
                      Create a new photo album to organize your images.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="albumTitle">Album Title</Label>
                      <Input
                        id="albumTitle"
                        value={albumTitle}
                        onChange={(e) => setAlbumTitle(e.target.value)}
                        placeholder="Enter album title"
                        className="glass-card border-glass-border"
                      />
                    </div>
                    <div>
                      <Label htmlFor="albumDescription">Description (Optional)</Label>
                      <Textarea
                        id="albumDescription"
                        value={albumDescription}
                        onChange={(e) => setAlbumDescription(e.target.value)}
                        placeholder="Enter album description"
                        className="glass-card border-glass-border"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={createAlbum}
                      disabled={!albumTitle.trim() || uploading}
                      className="btn-neon"
                    >
                      {uploading ? 'Creating...' : 'Create Album'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {selectedAlbum && (
                <Dialog open={showUploadPhoto} onOpenChange={setShowUploadPhoto}>
                  <DialogTrigger asChild>
                    <Button className="btn-neon">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-glass-border">
                    <DialogHeader>
                      <DialogTitle>Upload Photo</DialogTitle>
                      <DialogDescription>
                        Add a new photo to "{selectedAlbum.title}" album.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="photoFile">Select Photo</Label>
                        <Input
                          id="photoFile"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="glass-card border-glass-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor="photoTitle">Photo Title (Optional)</Label>
                        <Input
                          id="photoTitle"
                          value={photoTitle}
                          onChange={(e) => setPhotoTitle(e.target.value)}
                          placeholder="Enter photo title"
                          className="glass-card border-glass-border"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={uploadPhoto}
                        disabled={!selectedFile || uploading}
                        className="btn-neon"
                      >
                        {uploading ? 'Uploading...' : 'Upload Photo'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </div>

        {/* Albums Grid */}
        {!selectedAlbum && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {albums.map((album, index) => (
              <Card
                key={album.id}
                className="glass-card gallery-item cursor-pointer group"
                onClick={() => setSelectedAlbum(album)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl neon-text rounded-t-lg">
                    📁
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{album.title}</h3>
                    {album.description && (
                      <p className="text-muted-foreground text-sm mb-2">{album.description}</p>
                    )}
                    <p className="text-xs text-primary">
                      Created {new Date(album.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {albums.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground mb-4">No albums found</p>
                {!user && (
                  <p className="text-sm text-muted-foreground">
                    Sign in to create your first album
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Photo Viewer */}
        {selectedAlbum && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setSelectedAlbum(null)}
                className="text-muted-foreground hover:text-primary"
              >
                ← Back to Albums
              </Button>
              <h3 className="text-2xl font-bold neon-text">{selectedAlbum.title}</h3>
            </div>

            {photos.length > 0 ? (
              <>
                {/* Main Photo Display */}
                <div className="relative">
                  <div className="glass-card rounded-2xl overflow-hidden neon-glow">
                    <div className="relative aspect-video">
                      <img
                        src={photos[currentIndex].image_url}
                        alt={photos[currentIndex].title || 'Photo'}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Navigation Arrows */}
                      {photos.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 btn-glass"
                            onClick={goToPrevious}
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 btn-glass"
                            onClick={goToNext}
                          >
                            <ChevronRight className="w-6 h-6" />
                          </Button>
                        </>
                      )}

                      {/* Photo Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-6">
                        <h4 className="text-xl font-bold text-foreground mb-2">
                          {photos[currentIndex].title || 'Untitled'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Uploaded {new Date(photos[currentIndex].uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Indicators */}
                  {photos.length > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                      {photos.map((_, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className={`w-3 h-3 rounded-full p-0 transition-all ${
                            index === currentIndex 
                              ? 'bg-primary animate-pulse-glow' 
                              : 'bg-muted hover:bg-muted-foreground'
                          }`}
                          onClick={() => setCurrentIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Photo Thumbnails */}
                {photos.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className={`gallery-item glass-card rounded-lg overflow-hidden cursor-pointer ${
                          index === currentIndex ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setCurrentIndex(index)}
                      >
                        <img
                          src={photo.image_url}
                          alt={photo.title || 'Photo'}
                          className="w-full aspect-square object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 glass-card rounded-2xl">
                <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No photos in this album yet</p>
                {user && (
                  <Button
                    onClick={() => setShowUploadPhoto(true)}
                    className="btn-neon"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload First Photo
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};