import { useState, useEffect } from 'react';
import { BookOpen, MessageCircleQuestion, FileText, Users, Upload, Send, Check, ChevronDown, ChevronUp, Trash2, ExternalLink, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Doubt {
  id: string;
  user_id: string;
  title: string;
  description: string;
  subject: string | null;
  is_resolved: boolean;
  created_at: string;
}

interface DoubtAnswer {
  id: string;
  doubt_id: string;
  user_id: string;
  content: string;
  is_accepted: boolean;
  created_at: string;
}

interface StudyMaterial {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  subject: string;
  file_url: string | null;
  material_type: string;
  created_at: string;
}

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'History', 'Geography', 'Computer Science', 'Other'];

const StudentHub = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [answers, setAnswers] = useState<Record<string, DoubtAnswer[]>>({});
  const [expandedDoubt, setExpandedDoubt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [newDoubt, setNewDoubt] = useState({ title: '', description: '', subject: '' });
  const [newMaterial, setNewMaterial] = useState({ title: '', description: '', subject: '', material_type: 'notes' });
  const [newAnswer, setNewAnswer] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filterSubject, setFilterSubject] = useState<string>('all');

  useEffect(() => {
    fetchDoubts();
    fetchMaterials();
  }, []);

  const fetchDoubts = async () => {
    const { data, error } = await supabase
      .from('doubts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: 'Error fetching doubts', variant: 'destructive' });
    } else {
      setDoubts(data || []);
    }
    setLoading(false);
  };

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('study_materials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: 'Error fetching materials', variant: 'destructive' });
    } else {
      setMaterials(data || []);
    }
  };

  const fetchAnswers = async (doubtId: string) => {
    const { data, error } = await supabase
      .from('doubt_answers')
      .select('*')
      .eq('doubt_id', doubtId)
      .order('created_at', { ascending: true });
    
    if (!error && data) {
      setAnswers(prev => ({ ...prev, [doubtId]: data }));
    }
  };

  const handlePostDoubt = async () => {
    if (!user) {
      toast({ title: 'Please login to post a doubt', variant: 'destructive' });
      return;
    }
    
    if (!newDoubt.title || !newDoubt.description) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('doubts').insert({
      user_id: user.id,
      title: newDoubt.title,
      description: newDoubt.description,
      subject: newDoubt.subject || null,
    });

    if (error) {
      toast({ title: 'Error posting doubt', variant: 'destructive' });
    } else {
      toast({ title: 'Doubt posted successfully!' });
      setNewDoubt({ title: '', description: '', subject: '' });
      fetchDoubts();
    }
  };

  const handlePostAnswer = async (doubtId: string) => {
    if (!user) {
      toast({ title: 'Please login to answer', variant: 'destructive' });
      return;
    }
    
    const content = newAnswer[doubtId];
    if (!content?.trim()) return;

    const { error } = await supabase.from('doubt_answers').insert({
      doubt_id: doubtId,
      user_id: user.id,
      content: content.trim(),
    });

    if (error) {
      toast({ title: 'Error posting answer', variant: 'destructive' });
    } else {
      toast({ title: 'Answer posted!' });
      setNewAnswer(prev => ({ ...prev, [doubtId]: '' }));
      fetchAnswers(doubtId);
    }
  };

  const handleMarkResolved = async (doubtId: string) => {
    const { error } = await supabase
      .from('doubts')
      .update({ is_resolved: true })
      .eq('id', doubtId);

    if (!error) {
      toast({ title: 'Doubt marked as resolved!' });
      fetchDoubts();
    }
  };

  const handleUploadMaterial = async () => {
    if (!user) {
      toast({ title: 'Please login to upload', variant: 'destructive' });
      return;
    }
    
    if (!newMaterial.title || !newMaterial.subject) {
      toast({ title: 'Please fill title and subject', variant: 'destructive' });
      return;
    }

    setUploading(true);
    let fileUrl = null;

    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('study-materials')
        .upload(fileName, selectedFile);

      if (uploadError) {
        toast({ title: 'Error uploading file', variant: 'destructive' });
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('study-materials')
        .getPublicUrl(fileName);
      
      fileUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from('study_materials').insert({
      user_id: user.id,
      title: newMaterial.title,
      description: newMaterial.description || null,
      subject: newMaterial.subject,
      material_type: newMaterial.material_type,
      file_url: fileUrl,
    });

    if (error) {
      toast({ title: 'Error saving material', variant: 'destructive' });
    } else {
      toast({ title: 'Study material shared!' });
      setNewMaterial({ title: '', description: '', subject: '', material_type: 'notes' });
      setSelectedFile(null);
      fetchMaterials();
    }
    setUploading(false);
  };

  const handleDeleteDoubt = async (doubtId: string) => {
    const { error } = await supabase.from('doubts').delete().eq('id', doubtId);
    if (!error) {
      toast({ title: 'Doubt deleted' });
      fetchDoubts();
    }
  };

  const toggleDoubt = (doubtId: string) => {
    if (expandedDoubt === doubtId) {
      setExpandedDoubt(null);
    } else {
      setExpandedDoubt(doubtId);
      if (!answers[doubtId]) {
        fetchAnswers(doubtId);
      }
    }
  };

  const filteredDoubts = filterSubject === 'all' 
    ? doubts 
    : doubts.filter(d => d.subject === filterSubject);

  const filteredMaterials = filterSubject === 'all'
    ? materials
    : materials.filter(m => m.subject === filterSubject);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-main">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Student Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Learn Together, Grow Together
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ask doubts, share notes, and help juniors succeed. Together we can achieve more!
            </p>
            <div className="mt-6">
              <Button
                variant="outline"
                className="bg-primary/10 border-primary/30 hover:bg-primary/20"
                onClick={() => window.open('https://swayam.gov.in/nd1_noc20_hs08/preview', '_blank')}
              >
                <Video className="w-4 h-4 mr-2" />
                हिंदी व्याख्यान - SWAYAM
              </Button>
            </div>
          </div>

          <Card className="card-elevated mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                NCERT Books & Online Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Class 9th & 10th NCERT Books</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => window.open('https://ncert.nic.in/textbook.php?iemh1=0-14', '_blank')}
                  >
                    <div className="text-left">
                      <div className="font-medium">Class 9 गणित (हिंदी)</div>
                      <div className="text-xs text-muted-foreground">NCERT Official</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => window.open('https://ncert.nic.in/textbook.php?jemh1=0-16', '_blank')}
                  >
                    <div className="text-left">
                      <div className="font-medium">Class 10 गणित (हिंदी)</div>
                      <div className="text-xs text-muted-foreground">NCERT Official</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => window.open('https://ncert.nic.in/textbook.php?iesc1=0-13', '_blank')}
                  >
                    <div className="text-left">
                      <div className="font-medium">Class 9 विज्ञान (हिंदी)</div>
                      <div className="text-xs text-muted-foreground">NCERT Official</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => window.open('https://ncert.nic.in/textbook.php?jesc1=0-15', '_blank')}
                  >
                    <div className="text-left">
                      <div className="font-medium">Class 10 विज्ञान (हिंदी)</div>
                      <div className="text-xs text-muted-foreground">NCERT Official</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => window.open('https://ncert.nic.in/textbook.php?iemh1=0-13', '_blank')}
                  >
                    <div className="text-left">
                      <div className="font-medium">Class 9 Mathematics</div>
                      <div className="text-xs text-muted-foreground">NCERT Official</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => window.open('https://ncert.nic.in/textbook.php?jemh1=0-15', '_blank')}
                  >
                    <div className="text-left">
                      <div className="font-medium">Class 10 Mathematics</div>
                      <div className="text-xs text-muted-foreground">NCERT Official</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => window.open('https://ncert.nic.in/textbook.php?iesc1=0-12', '_blank')}
                  >
                    <div className="text-left">
                      <div className="font-medium">Class 9 Science</div>
                      <div className="text-xs text-muted-foreground">NCERT Official</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => window.open('https://ncert.nic.in/textbook.php?jesc1=0-14', '_blank')}
                  >
                    <div className="text-left">
                      <div className="font-medium">Class 10 Science</div>
                      <div className="text-xs text-muted-foreground">NCERT Official</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => window.open('https://ncert.nic.in/textbook.php?iess1=0-11', '_blank')}
                  >
                    <div className="text-left">
                      <div className="font-medium">Class 9 Social Science</div>
                      <div className="text-xs text-muted-foreground">NCERT Official</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => window.open('https://ncert.nic.in/textbook.php?jess1=0-13', '_blank')}
                  >
                    <div className="text-left">
                      <div className="font-medium">Class 10 Social Science</div>
                      <div className="text-xs text-muted-foreground">NCERT Official</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Online Learning Platforms</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => window.open('https://swayam.gov.in/nc_details/NCERT', '_blank')}
                  >
                    <div className="text-left">
                      <div className="font-medium">SWAYAM - NCERT Lectures</div>
                      <div className="text-xs text-muted-foreground">Free video courses</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => window.open('https://swayam.gov.in/nd1_noc20_hs08/preview', '_blank')}
                  >
                    <div className="text-left">
                      <div className="font-medium">हिंदी व्याख्यान - SWAYAM</div>
                      <div className="text-xs text-muted-foreground">Hindi medium lectures</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4"
                    onClick={() => window.open('https://diksha.gov.in/', '_blank')}
                  >
                    <div className="text-left">
                      <div className="font-medium">DIKSHA Platform</div>
                      <div className="text-xs text-muted-foreground">Digital learning</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="text-center p-4 card-elevated">
              <MessageCircleQuestion className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{doubts.length}</p>
              <p className="text-sm text-muted-foreground">Doubts Posted</p>
            </Card>
            <Card className="text-center p-4 card-elevated">
              <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{doubts.filter(d => d.is_resolved).length}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </Card>
            <Card className="text-center p-4 card-elevated">
              <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{materials.length}</p>
              <p className="text-sm text-muted-foreground">Study Materials</p>
            </Card>
            <Card className="text-center p-4 card-elevated">
              <Users className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {new Set([...doubts.map(d => d.user_id), ...materials.map(m => m.user_id)]).size}
              </p>
              <p className="text-sm text-muted-foreground">Contributors</p>
            </Card>
          </div>

          <div className="flex justify-end mb-4">
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="doubts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
              <TabsTrigger value="doubts" className="flex items-center gap-2">
                <MessageCircleQuestion className="w-4 h-4" />
                Doubts
              </TabsTrigger>
              <TabsTrigger value="materials" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Books
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Tips
              </TabsTrigger>
            </TabsList>

            <TabsContent value="doubts" className="space-y-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircleQuestion className="w-5 h-5 text-primary" />
                    Ask a Doubt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="What's your question?"
                    value={newDoubt.title}
                    onChange={(e) => setNewDoubt(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Describe your doubt in detail..."
                    value={newDoubt.description}
                    onChange={(e) => setNewDoubt(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                  <div className="flex gap-4">
                    <Select
                      value={newDoubt.subject}
                      onValueChange={(value) => setNewDoubt(prev => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handlePostDoubt} className="btn-primary-gradient">
                      <Send className="w-4 h-4 mr-2" />
                      Post Doubt
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {loading ? (
                  <p className="text-center text-muted-foreground py-8">Loading doubts...</p>
                ) : filteredDoubts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No doubts yet. Be the first to ask!</p>
                ) : (
                  filteredDoubts.map((doubt) => (
                    <Card key={doubt.id} className="card-elevated overflow-hidden">
                      <div
                        className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                        onClick={() => toggleDoubt(doubt.id)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {doubt.subject && (
                                <Badge variant="secondary">{doubt.subject}</Badge>
                              )}
                              {doubt.is_resolved && (
                                <Badge className="bg-green-500/10 text-green-600">
                                  <Check className="w-3 h-3 mr-1" />
                                  Resolved
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-foreground">{doubt.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {doubt.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(doubt.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {expandedDoubt === doubt.id ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>

                      {expandedDoubt === doubt.id && (
                        <div className="border-t border-border p-4 bg-secondary/30">
                          <div className="space-y-3 mb-4">
                            {answers[doubt.id]?.length ? (
                              answers[doubt.id].map((answer) => (
                                <div key={answer.id} className="bg-background p-3 rounded-lg">
                                  <p className="text-foreground">{answer.content}</p>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {new Date(answer.created_at).toLocaleDateString('en-IN')}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">No answers yet. Be the first to help!</p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Input
                              placeholder="Write your answer..."
                              value={newAnswer[doubt.id] || ''}
                              onChange={(e) => setNewAnswer(prev => ({ ...prev, [doubt.id]: e.target.value }))}
                              onKeyPress={(e) => e.key === 'Enter' && handlePostAnswer(doubt.id)}
                            />
                            <Button size="sm" onClick={() => handlePostAnswer(doubt.id)}>
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>

                          {user?.id === doubt.user_id && (
                            <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                              {!doubt.is_resolved && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleMarkResolved(doubt.id)}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Mark Resolved
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteDoubt(doubt.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="materials" className="space-y-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Share Study Material
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Title (e.g., Class 10 Physics Notes - Chapter 1)"
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Brief description..."
                    value={newMaterial.description}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                  <div className="flex flex-wrap gap-4">
                    <Select
                      value={newMaterial.subject}
                      onValueChange={(value) => setNewMaterial(prev => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={newMaterial.material_type}
                      onValueChange={(value) => setNewMaterial(prev => ({ ...prev, material_type: value }))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="notes">Notes</SelectItem>
                        <SelectItem value="question_paper">Question Paper</SelectItem>
                        <SelectItem value="solution">Solution</SelectItem>
                        <SelectItem value="guide">Study Guide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    <Button onClick={handleUploadMaterial} disabled={uploading} className="btn-primary-gradient">
                      {uploading ? 'Uploading...' : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Share
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredMaterials.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 col-span-full">
                    No study materials yet. Be the first to share!
                  </p>
                ) : (
                  filteredMaterials.map((material) => (
                    <Card key={material.id} className="card-elevated hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">{material.subject}</Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {material.material_type.replace('_', ' ')}
                              </Badge>
                            </div>
                            <h3 className="font-medium text-foreground truncate">{material.title}</h3>
                            {material.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {material.description}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(material.created_at).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </div>
                        {material.file_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                            onClick={() => window.open(material.file_url!, '_blank')}
                          >
                            Download
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    NCERT Books & Online Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Class 9th & 10th NCERT Books</h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <Button
                        variant="outline"
                        className="justify-start h-auto p-3"
                        onClick={() => window.open('https://ncert.nic.in/textbook.php?iemh1=0-13', '_blank')}
                      >
                        <div className="text-left">
                          <div className="font-medium">Class 9 Mathematics</div>
                          <div className="text-xs text-muted-foreground">NCERT Official</div>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start h-auto p-3"
                        onClick={() => window.open('https://ncert.nic.in/textbook.php?jemh1=0-15', '_blank')}
                      >
                        <div className="text-left">
                          <div className="font-medium">Class 10 Mathematics</div>
                          <div className="text-xs text-muted-foreground">NCERT Official</div>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start h-auto p-3"
                        onClick={() => window.open('https://ncert.nic.in/textbook.php?iesc1=0-12', '_blank')}
                      >
                        <div className="text-left">
                          <div className="font-medium">Class 9 Science</div>
                          <div className="text-xs text-muted-foreground">NCERT Official</div>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start h-auto p-3"
                        onClick={() => window.open('https://ncert.nic.in/textbook.php?jesc1=0-14', '_blank')}
                      >
                        <div className="text-left">
                          <div className="font-medium">Class 10 Science</div>
                          <div className="text-xs text-muted-foreground">NCERT Official</div>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start h-auto p-3"
                        onClick={() => window.open('https://ncert.nic.in/textbook.php?iess1=0-11', '_blank')}
                      >
                        <div className="text-left">
                          <div className="font-medium">Class 9 Social Science</div>
                          <div className="text-xs text-muted-foreground">NCERT Official</div>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start h-auto p-3"
                        onClick={() => window.open('https://ncert.nic.in/textbook.php?jess1=0-13', '_blank')}
                      >
                        <div className="text-left">
                          <div className="font-medium">Class 10 Social Science</div>
                          <div className="text-xs text-muted-foreground">NCERT Official</div>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Online Learning Platforms</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button
                        variant="outline"
                        className="justify-start h-auto p-4"
                        onClick={() => window.open('https://swayam.gov.in/nc_details/NCERT', '_blank')}
                      >
                        <div className="text-left">
                          <div className="font-medium">SWAYAM - NCERT Lectures</div>
                          <div className="text-xs text-muted-foreground">Free video courses</div>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start h-auto p-4"
                        onClick={() => window.open('https://diksha.gov.in/', '_blank')}
                      >
                        <div className="text-left">
                          <div className="font-medium">DIKSHA Platform</div>
                          <div className="text-xs text-muted-foreground">Digital learning</div>
                        </div>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      📚 Study Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                        <span className="text-2xl">⏰</span>
                        <div>
                          <h4 className="font-medium text-foreground">Create a Study Schedule</h4>
                          <p className="text-sm text-muted-foreground">Plan your study hours and stick to them. Consistency is key!</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                        <span className="text-2xl">✍️</span>
                        <div>
                          <h4 className="font-medium text-foreground">Take Notes by Hand</h4>
                          <p className="text-sm text-muted-foreground">Writing helps you remember better than typing.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                        <span className="text-2xl">🧠</span>
                        <div>
                          <h4 className="font-medium text-foreground">Use Active Recall</h4>
                          <p className="text-sm text-muted-foreground">Test yourself instead of just re-reading notes.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      🎯 Exam Strategies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                        <span className="text-2xl">📝</span>
                        <div>
                          <h4 className="font-medium text-foreground">Practice Previous Papers</h4>
                          <p className="text-sm text-muted-foreground">Solve last 5 years' papers to understand the pattern.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                        <span className="text-2xl">⏱️</span>
                        <div>
                          <h4 className="font-medium text-foreground">Time Management</h4>
                          <p className="text-sm text-muted-foreground">Allocate time per section and stick to it during exams.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                        <span className="text-2xl">🔄</span>
                        <div>
                          <h4 className="font-medium text-foreground">Revision is Key</h4>
                          <p className="text-sm text-muted-foreground">Revise regularly using the spaced repetition method.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentHub;