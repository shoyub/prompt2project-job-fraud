import { useState } from 'react';
import { Header } from '@/components/Header';
import { JobDetectionForm } from '@/components/JobDetectionForm';
import { DashboardStats } from '@/components/DashboardStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Brain, Zap, CheckCircle, AlertTriangle, Github, ExternalLink, BarChart3 } from 'lucide-react';
import heroBackground from '@/assets/hero-bg.jpg';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'dashboard'>('analyzer');

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Advanced AI Detection',
      description: 'Uses state-of-the-art NLP models including DistilBERT for accurate fraud detection'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Real-time Analysis',
      description: 'Instant job posting verification with detailed confidence scores and risk assessment'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Comprehensive Reporting',
      description: 'Detailed analytics and insights to help identify fraud patterns and trends'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
        
        <div className="relative container mx-auto px-4 py-24 text-center">
          <Badge variant="outline" className="mb-6 bg-background/50 backdrop-blur-sm">
            <Zap className="w-3 h-3 mr-1" />
            Powered by Advanced ML
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Detect Fake Job Postings
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              with AI Precision
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Protect job seekers from fraudulent opportunities using advanced machine learning. 
            Analyze job postings instantly with our AI-powered detection system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="premium" 
              size="lg"
              onClick={() => setActiveTab('analyzer')}
              className="text-lg px-8 py-6"
            >
              <Brain className="w-5 h-5 mr-2" />
              Try AI Analyzer
            </Button>
            <Button 
              variant="glass" 
              size="lg"
              onClick={() => setActiveTab('dashboard')}
              className="text-lg px-8 py-6"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background/50 backdrop-blur-sm border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose JobGuard AI?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with comprehensive fraud detection 
              to keep job seekers safe from malicious postings.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card border-border/50 backdrop-blur-sm hover:shadow-premium transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="analyzer" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Tab Navigation */}
            <div className="lg:w-1/4">
              <div className="sticky top-24 space-y-2">
                <Button
                  variant={activeTab === 'analyzer' ? 'premium' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('analyzer')}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Analyzer
                </Button>
                <Button
                  variant={activeTab === 'dashboard' ? 'premium' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:w-3/4">
              {activeTab === 'analyzer' && (
                <div className="animate-fade-in">
                  <JobDetectionForm />
                </div>
              )}
              
              {activeTab === 'dashboard' && (
                <div className="animate-fade-in">
                  <DashboardStats />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold">JobGuard AI</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Protecting job seekers with advanced AI fraud detection technology
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="sm">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentation
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
