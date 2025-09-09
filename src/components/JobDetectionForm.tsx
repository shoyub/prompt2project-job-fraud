<<<<<<< HEAD
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, XCircle, Brain, Shield, Zap } from 'lucide-react';
=======
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Brain,
  Shield,
  Zap,
  Cpu,
} from "lucide-react";
import { lstmAnalysisService } from "@/services/lstmAnalysis";
>>>>>>> a0de47b (1st commit)

interface AnalysisResult {
  isLegitimate: boolean;
  confidence: number;
  riskFactors: string[];
  legitimacyFactors: string[];
  overallScore: number;
}

<<<<<<< HEAD
=======
interface ModelResult extends AnalysisResult {
  modelName: string;
  modelType: "BERT" | "LSTM";
}

>>>>>>> a0de47b (1st commit)
interface JobDetectionFormProps {
  onAnalyze?: (jobPosting: string) => Promise<AnalysisResult>;
}

export function JobDetectionForm({ onAnalyze }: JobDetectionFormProps) {
<<<<<<< HEAD
  const [jobPosting, setJobPosting] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!jobPosting.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // If onAnalyze prop is provided, use it; otherwise use mock analysis
      const analysisResult = onAnalyze 
        ? await onAnalyze(jobPosting)
        : await mockAnalysis(jobPosting);
      
      setResult(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
=======
  const [jobPosting, setJobPosting] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ModelResult[]>([]);
  const [combinedResult, setCombinedResult] = useState<AnalysisResult | null>(
    null
  );

  const handleAnalyze = async () => {
    if (!jobPosting.trim()) return;

    setIsAnalyzing(true);
    setResults([]);
    setCombinedResult(null);

    try {
      // Run LSTM analysis
      const lstmResult = await lstmAnalysisService.analyzeJobPosting(
        jobPosting
      );

      // Create model result
      const lstmModelResult: ModelResult = {
        ...lstmResult,
        modelName: "LSTM Neural Network",
        modelType: "LSTM",
      };

      const modelResults: ModelResult[] = [lstmModelResult];
      setResults(modelResults);

      // Use LSTM result as the combined result
      const combinedAnalysis: AnalysisResult = {
        isLegitimate: lstmResult.isLegitimate,
        confidence: lstmResult.confidence,
        riskFactors: lstmResult.riskFactors,
        legitimacyFactors: lstmResult.legitimacyFactors,
        overallScore: lstmResult.overallScore,
      };

      setCombinedResult(combinedAnalysis);
    } catch (error) {
      console.error("Analysis failed:", error);
      // Fallback to basic mock analysis
      const mockResult = await mockAnalysis(jobPosting);
      setCombinedResult(mockResult);
>>>>>>> a0de47b (1st commit)
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Mock analysis function for demonstration
  const mockAnalysis = async (text: string): Promise<AnalysisResult> => {
    // Simulate API delay
<<<<<<< HEAD
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple heuristic analysis
    const suspiciousWords = ['urgent', 'immediate', 'work from home', 'no experience', 'easy money', 'guaranteed'];
    const legitimateWords = ['benefits', 'qualifications', 'company', 'responsibilities', 'experience required'];
    
    const suspiciousCount = suspiciousWords.filter(word => 
      text.toLowerCase().includes(word)
    ).length;
    
    const legitimateCount = legitimateWords.filter(word => 
      text.toLowerCase().includes(word)
    ).length;
    
    const score = Math.max(0, Math.min(100, 70 + (legitimateCount * 10) - (suspiciousCount * 15)));
    const isLegitimate = score > 50;
    
    return {
      isLegitimate,
      confidence: score,
      riskFactors: suspiciousCount > 0 ? ['Suspicious keywords detected', 'Unrealistic promises'] : [],
      legitimacyFactors: legitimateCount > 0 ? ['Professional language', 'Clear requirements'] : [],
      overallScore: score
=======
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simple heuristic analysis
    const suspiciousWords = [
      "urgent",
      "immediate",
      "work from home",
      "no experience",
      "easy money",
      "guaranteed",
    ];
    const legitimateWords = [
      "benefits",
      "qualifications",
      "company",
      "responsibilities",
      "experience required",
    ];

    const suspiciousCount = suspiciousWords.filter((word) =>
      text.toLowerCase().includes(word)
    ).length;

    const legitimateCount = legitimateWords.filter((word) =>
      text.toLowerCase().includes(word)
    ).length;

    const score = Math.max(
      0,
      Math.min(100, 70 + legitimateCount * 10 - suspiciousCount * 15)
    );
    const isLegitimate = score > 50;

    return {
      isLegitimate,
      confidence: score,
      riskFactors:
        suspiciousCount > 0
          ? ["Suspicious keywords detected", "Unrealistic promises"]
          : [],
      legitimacyFactors:
        legitimateCount > 0
          ? ["Professional language", "Clear requirements"]
          : [],
      overallScore: score,
>>>>>>> a0de47b (1st commit)
    };
  };

  const getResultColor = (score: number) => {
<<<<<<< HEAD
    if (score >= 70) return 'success';
    if (score >= 40) return 'warning';
    return 'danger';
=======
    if (score >= 70) return "default";
    if (score >= 40) return "secondary";
    return "destructive";
>>>>>>> a0de47b (1st commit)
  };

  const getResultIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="w-5 h-5" />;
    if (score >= 40) return <AlertTriangle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Job Posting Analysis
          </CardTitle>
          <CardDescription>
<<<<<<< HEAD
            Paste a job posting below to analyze its authenticity using advanced ML algorithms
=======
            Paste a job posting below to analyze its authenticity using LSTM
            neural network
>>>>>>> a0de47b (1st commit)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the job posting content here..."
            value={jobPosting}
            onChange={(e) => setJobPosting(e.target.value)}
            className="min-h-[200px] bg-background/50 border-border resize-none"
          />
<<<<<<< HEAD
          
          <Button 
=======

          <Button
>>>>>>> a0de47b (1st commit)
            onClick={handleAnalyze}
            disabled={!jobPosting.trim() || isAnalyzing}
            variant="premium"
            size="lg"
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Analyze Job Posting
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm animate-fade-in">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary animate-glow" />
<<<<<<< HEAD
                <span className="text-sm font-medium">AI Analysis in Progress</span>
=======
                <span className="text-sm font-medium">
                  AI Analysis in Progress
                </span>
>>>>>>> a0de47b (1st commit)
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing job posting...</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="relative overflow-hidden bg-muted/20 rounded h-1">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

<<<<<<< HEAD
      {result && (
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getResultIcon(result.overallScore)}
              Analysis Results
            </CardTitle>
=======
      {/* Individual Model Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Model Analysis Results
          </h3>
          <div className="grid gap-4">
            {results.map((modelResult, index) => (
              <Card
                key={index}
                className="bg-gradient-card border-border/50 backdrop-blur-sm"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Cpu className="w-4 h-4 text-green-500" />
                    {modelResult.modelName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Score</span>
                    <Badge
                      variant={getResultColor(modelResult.overallScore) as any}
                    >
                      {modelResult.overallScore.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress
                    value={modelResult.overallScore}
                    className={`h-2 ${
                      modelResult.overallScore >= 70
                        ? "[&>div]:bg-success"
                        : modelResult.overallScore >= 40
                        ? "[&>div]:bg-warning"
                        : "[&>div]:bg-danger"
                    }`}
                  />
                  <div className="text-xs text-muted-foreground">
                    {modelResult.isLegitimate ? "Legitimate" : "Suspicious"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Combined Result */}
      {combinedResult && (
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getResultIcon(combinedResult.overallScore)}
              Combined Analysis Results
            </CardTitle>
            <CardDescription>
              Results from LSTM neural network analysis
            </CardDescription>
>>>>>>> a0de47b (1st commit)
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
<<<<<<< HEAD
                <span className="text-sm font-medium">Legitimacy Score</span>
                <Badge variant={getResultColor(result.overallScore) as any}>
                  {result.overallScore}%
                </Badge>
              </div>
              <Progress 
                value={result.overallScore} 
                className={`h-3 ${
                  result.overallScore >= 70 ? '[&>div]:bg-success' :
                  result.overallScore >= 40 ? '[&>div]:bg-warning' :
                  '[&>div]:bg-danger'
=======
                <span className="text-sm font-medium">
                  Overall Legitimacy Score
                </span>
                <Badge
                  variant={getResultColor(combinedResult.overallScore) as any}
                >
                  {combinedResult.overallScore.toFixed(1)}%
                </Badge>
              </div>
              <Progress
                value={combinedResult.overallScore}
                className={`h-3 ${
                  combinedResult.overallScore >= 70
                    ? "[&>div]:bg-success"
                    : combinedResult.overallScore >= 40
                    ? "[&>div]:bg-warning"
                    : "[&>div]:bg-danger"
>>>>>>> a0de47b (1st commit)
                }`}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
<<<<<<< HEAD
              {result.legitimacyFactors.length > 0 && (
=======
              {combinedResult.legitimacyFactors.length > 0 && (
>>>>>>> a0de47b (1st commit)
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-success flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Positive Indicators
                  </h4>
                  <ul className="space-y-1">
<<<<<<< HEAD
                    {result.legitimacyFactors.map((factor, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
=======
                    {combinedResult.legitimacyFactors.map((factor, index) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
>>>>>>> a0de47b (1st commit)
                        <div className="w-1.5 h-1.5 rounded-full bg-success" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

<<<<<<< HEAD
              {result.riskFactors.length > 0 && (
=======
              {combinedResult.riskFactors.length > 0 && (
>>>>>>> a0de47b (1st commit)
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-danger flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    Risk Factors
                  </h4>
                  <ul className="space-y-1">
<<<<<<< HEAD
                    {result.riskFactors.map((factor, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
=======
                    {combinedResult.riskFactors.map((factor, index) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
>>>>>>> a0de47b (1st commit)
                        <div className="w-1.5 h-1.5 rounded-full bg-danger" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
              <p className="text-sm">
<<<<<<< HEAD
                <strong>Recommendation:</strong>{' '}
                {result.isLegitimate 
                  ? 'This job posting appears to be legitimate. However, always verify company details independently.'
                  : 'This job posting shows signs of being potentially fraudulent. Exercise caution and verify all details.'}
=======
                <strong>Recommendation:</strong>{" "}
                {combinedResult.isLegitimate
                  ? "This job posting appears to be legitimate based on AI analysis. However, always verify company details independently."
                  : "This job posting shows signs of being potentially fraudulent. Exercise caution and verify all details."}
>>>>>>> a0de47b (1st commit)
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> a0de47b (1st commit)
