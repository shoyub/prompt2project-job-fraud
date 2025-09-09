// import { pipeline } from "@huggingface/transformers";

interface BertAnalysisResult {
  isLegitimate: boolean;
  confidence: number;
  riskFactors: string[];
  legitimacyFactors: string[];
  overallScore: number;
}

class BertAnalysisService {
  private classifier: any = null;

  async initialize() {
    if (!this.classifier) {
      try {
        // Load BERT model for text classification - using a general purpose classifier
        // In production, this would be fine-tuned on fraud detection data
        this.classifier = await pipeline(
          "text-classification",
          "cardiffnlp/twitter-roberta-base-sentiment-latest"
        );
      } catch (error) {
        console.error("Failed to load BERT model:", error);
        // Don't throw error, let the fallback handle it
        this.classifier = null;
      }
    }
  }

  async analyzeJobPosting(text: string): Promise<BertAnalysisResult> {
    await this.initialize();

    // If classifier failed to load, use fallback
    if (!this.classifier) {
      return this.fallbackAnalysis(text);
    }

    try {
      // Run BERT analysis for fraud detection
      const result = await this.classifier(text);

      // Process the sentiment analysis result for fraud detection
      const prediction = result[0];
      const label = prediction.label.toLowerCase();
      const confidence = prediction.score * 100;

      // Analyze sentiment in context of fraud detection
      let legitimacyScore = 50; // Base score

      if (label.includes("positive") || label.includes("neutral")) {
        // Positive/neutral sentiment often indicates legitimate professional content
        legitimacyScore = Math.min(100, 60 + confidence * 0.4);
      } else if (label.includes("negative")) {
        // Negative sentiment might indicate aggressive or suspicious language
        legitimacyScore = Math.max(0, 40 - confidence * 0.3);
      }

      // Apply fraud-specific heuristics on top of sentiment analysis
      const fraudIndicators = this.detectFraudPatterns(text);
      legitimacyScore = Math.max(
        0,
        Math.min(100, legitimacyScore - fraudIndicators.scorePenalty)
      );

      // Generate factors based on the analysis
      const riskFactors: string[] = [];
      const legitimacyFactors: string[] = [];

      // Add sentiment-based factors
      if (label.includes("negative")) {
        riskFactors.push("Negative tone detected in job posting");
        riskFactors.push("Aggressive or concerning language patterns");
      } else {
        legitimacyFactors.push("Professional tone detected");
        legitimacyFactors.push("Appropriate language for job postings");
      }

      // Add fraud pattern factors
      riskFactors.push(...fraudIndicators.riskFactors);
      legitimacyFactors.push(...fraudIndicators.legitimacyFactors);

      // Add confidence-based factors
      if (confidence > 80) {
        if (legitimacyScore < 50) {
          riskFactors.push("High confidence in detecting suspicious patterns");
        } else {
          legitimacyFactors.push("High confidence in content legitimacy");
        }
      }

      return {
        isLegitimate: legitimacyScore > 50,
        confidence: legitimacyScore,
        riskFactors,
        legitimacyFactors,
        overallScore: legitimacyScore,
      };
    } catch (error) {
      console.error("BERT analysis failed:", error);
      // Fallback to heuristic analysis
      return this.fallbackAnalysis(text);
    }
  }

  private detectFraudPatterns(text: string): {
    scorePenalty: number;
    riskFactors: string[];
    legitimacyFactors: string[];
  } {
    const riskFactors: string[] = [];
    const legitimacyFactors: string[] = [];
    let scorePenalty = 0;

    // Fraud indicators
    const fraudWords = [
      "urgent",
      "immediate",
      "work from home",
      "no experience",
      "easy money",
      "guaranteed",
      "quick cash",
      "no interview",
      "start today",
      "millionaire",
      "rich quick",
      "scam",
    ];

    // Legitimacy indicators
    const legitWords = [
      "benefits",
      "qualifications",
      "company",
      "responsibilities",
      "experience required",
      "salary",
      "location",
      "requirements",
      "about us",
      "what we offer",
      "apply now",
      "equal opportunity",
    ];

    const fraudCount = fraudWords.filter((word) =>
      text.toLowerCase().includes(word)
    ).length;

    const legitCount = legitWords.filter((word) =>
      text.toLowerCase().includes(word)
    ).length;

    if (fraudCount > 0) {
      scorePenalty += fraudCount * 8;
      riskFactors.push(`${fraudCount} suspicious keyword(s) detected`);
    }

    if (legitCount > 0) {
      scorePenalty -= legitCount * 5;
      legitimacyFactors.push(`${legitCount} professional term(s) detected`);
    }

    // Length analysis
    if (text.length < 200) {
      scorePenalty += 10;
      riskFactors.push("Job posting is unusually short");
    } else if (text.length > 1000) {
      scorePenalty -= 5;
      legitimacyFactors.push("Detailed job description provided");
    }

    return { scorePenalty, riskFactors, legitimacyFactors };
  }

  private fallbackAnalysis(text: string): BertAnalysisResult {
    // Simple fallback heuristic
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

    return {
      isLegitimate: score > 50,
      confidence: score,
      riskFactors: suspiciousCount > 0 ? ["Suspicious keywords detected"] : [],
      legitimacyFactors:
        legitimateCount > 0 ? ["Professional language detected"] : [],
      overallScore: score,
    };
  }
}

export const bertAnalysisService = new BertAnalysisService();
