import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Brain, Github, ExternalLink } from 'lucide-react';
import detectionIcon from '@/assets/detection-icon.png';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={detectionIcon} alt="JobGuard AI" className="w-8 h-8" />
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              JobGuard AI
            </h1>
            <Badge variant="outline" className="text-xs">
              Beta
            </Badge>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#analyzer" className="text-sm font-medium hover:text-primary transition-colors">
            Analyzer
          </a>
          <a href="#dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </a>
          <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Github className="w-4 h-4" />
            Source
          </Button>
          <Button variant="premium" size="sm">
            <ExternalLink className="w-4 h-4" />
            API Access
          </Button>
        </div>
      </div>
    </header>
  );
}