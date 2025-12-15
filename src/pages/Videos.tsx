import { useState, useEffect } from 'react';
import { Plus, Upload, Loader2, Video as VideoIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

interface VideoType {
  id: string;
  video_url: string;
  title: string;
  created_at: string;
  user_id: string;
}

const Videos = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    setVideos(data || []);
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!user) { navigate('/auth'); return; }
    if (!selectedFile || !title.trim()) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const fileName = `${user.id}/${Date.now()}.${selectedFile.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('videos').upload(fileName, selectedFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(fileName);
      await supabase.from('videos').insert({ user_id: user.id, video_url: publicUrl, title: title.trim() });

      toast({ title: 'Video uploaded!' });
      setDialogOpen(false);
      setSelectedFile(null);
      setTitle('');
      fetchVideos();
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 md:pt-24">
        <div className="container-main py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Video Gallery</h1>
              <p className="text-muted-foreground">Watch and share community videos</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gradient"><Plus className="w-4 h-4 mr-2" />Upload Video</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Upload Video</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Video title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  {selectedFile ? (
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <span className="text-sm truncate">{selectedFile.name}</span>
                      <button onClick={() => setSelectedFile(null)}><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Select video file</span>
                      <Input type="file" accept="video/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                    </label>
                  )}
                  <Button variant="gradient" className="w-full" onClick={handleUpload} disabled={uploading}>
                    {uploading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Uploading...</> : 'Upload'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20">
              <VideoIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
              <Button variant="gradient" onClick={() => setDialogOpen(true)}>Upload First Video</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="card-elevated overflow-hidden">
                  <video src={video.video_url} controls className="w-full aspect-video bg-slate-dark" />
                  <div className="p-4">
                    <h3 className="font-semibold">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(video.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Videos;
