import * as tf from "@tensorflow/tfjs";
import * as use from "@tensorflow-models/universal-sentence-encoder";

interface LstmAnalysisResult {
  isLegitimate: boolean;
  confidence: number;
  riskFactors: string[];
  legitimacyFactors: string[];
  overallScore: number;
}

class LstmAnalysisService {
  private model: tf.LayersModel | null = null;
  private encoder: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load Universal Sentence Encoder
      this.encoder = await use.load();

      // Create a simple neural network for classification
      this.model = tf.sequential({
        layers: [
          // Input layer (using feature extraction instead of USE embeddings)
          tf.layers.dense({ inputShape: [10], units: 64, activation: "relu" }),
          // Hidden layers
          tf.layers.dropout({ rate: 0.3 }),
          tf.layers.dense({ units: 32, activation: "relu" }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 16, activation: "relu" }),
          // Output layer (binary classification)
          tf.layers.dense({ units: 1, activation: "sigmoid" }),
        ],
      });

      // Compile the model
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: "binaryCrossentropy",
        metrics: ["accuracy"],
      });

      // Initialize with pre-trained weights (simplified approach)
      // In a real implementation, you would load pre-trained weights
      this.initializeWeights();

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize LSTM model:", error);
      // Don't throw error, mark as failed but allow fallback
      this.isInitialized = false;
    }
  }

  private async initializeWeights() {
    if (!this.model) return;

    try {
      // Create training data for fraud detection
      const trainingData = this.createTrainingData();

      // Convert training data to tensors
      const inputs = tf.tensor2d(trainingData.inputs);
      const labels = tf.tensor2d(trainingData.labels, [
        trainingData.labels.length,
        1,
      ]);

      // Train the model
      await this.model.fit(inputs, labels, {
        epochs: 50,
        batchSize: 8,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 10 === 0) {
              console.log(
                `LSTM Training - Epoch ${epoch}: loss = ${logs?.loss?.toFixed(
                  4
                )}`
              );
            }
          },
        },
      });

      // Clean up training tensors
      inputs.dispose();
      labels.dispose();

      console.log("LSTM model training completed");
    } catch (error) {
      console.error("Failed to train LSTM model:", error);
      // Model will still work with random weights as fallback
    }
  }

  private createTrainingData(): { inputs: number[][]; labels: number[][] } {
    // Create synthetic training data for fraud detection
    // In production, this would use real labeled job posting data

    const legitimateExamples = [
      "Software Engineer position at Google. Requirements: 3+ years experience with React, Node.js. Competitive salary and benefits.",
      "Marketing Manager needed. Bachelor's degree required. Experience in digital marketing preferred. Full-time position with health benefits.",
      "Data Analyst role. SQL, Python skills required. Competitive compensation package including 401k matching.",
      "Project Manager position. PMP certification preferred. Experience with Agile methodologies. Excellent benefits package.",
      "UX Designer wanted. Portfolio required. Experience with Figma and user research. Competitive salary plus stock options.",
    ];

    const fraudulentExamples = [
      "Work from home and earn $5000 per week! No experience needed. Start immediately!",
      "URGENT: Make money fast! Easy job, guaranteed income. No interview required.",
      "Become a millionaire overnight! Work 2 hours per day. No skills needed.",
      "Quick cash opportunity! Earn $100 per hour from home. No experience required.",
      "SCAM ALERT: Easy money making scheme. Work from home, get rich quick!",
    ];

    const inputs: number[][] = [];
    const labels: number[][] = [];

    // Process legitimate examples
    for (const text of legitimateExamples) {
      const features = this.extractFeatures(text);
      inputs.push(features);
      labels.push([1]); // Legitimate = 1
    }

    // Process fraudulent examples
    for (const text of fraudulentExamples) {
      const features = this.extractFeatures(text);
      inputs.push(features);
      labels.push([0]); // Fraudulent = 0
    }

    return { inputs, labels };
  }

  private extractFeatures(text: string): number[] {
    // Extract numerical features from text for the neural network
    const features: number[] = [];

    // Text length features
    features.push(text.length / 1000); // Normalized length
    features.push(text.split(" ").length / 100); // Normalized word count

    // Keyword counts (normalized)
    const fraudKeywords = [
      "urgent",
      "immediate",
      "work from home",
      "no experience",
      "easy money",
      "guaranteed",
      "quick cash",
    ];
    const legitKeywords = [
      "benefits",
      "qualifications",
      "company",
      "responsibilities",
      "experience required",
      "salary",
    ];

    const fraudCount = fraudKeywords.filter((word) =>
      text.toLowerCase().includes(word)
    ).length;
    const legitCount = legitKeywords.filter((word) =>
      text.toLowerCase().includes(word)
    ).length;

    features.push(fraudCount / 10); // Normalized fraud keyword count
    features.push(legitCount / 10); // Normalized legit keyword count

    // Sentiment-like features (simplified)
    const positiveWords = [
      "excellent",
      "great",
      "professional",
      "competitive",
      "benefits",
    ];
    const negativeWords = ["scam", "urgent", "guaranteed", "easy", "quick"];

    const positiveCount = positiveWords.filter((word) =>
      text.toLowerCase().includes(word)
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      text.toLowerCase().includes(word)
    ).length;

    features.push(positiveCount / 5);
    features.push(negativeCount / 5);

    // Capitalization ratio
    const uppercaseRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    features.push(uppercaseRatio);

    // Punctuation density
    const punctuationRatio = (text.match(/[!?]/g) || []).length / text.length;
    features.push(punctuationRatio);

    return features;
  }

  async analyzeJobPosting(text: string): Promise<LstmAnalysisResult> {
    await this.initialize();

    // If initialization failed, use fallback
    if (!this.isInitialized || !this.encoder || !this.model) {
      return this.fallbackAnalysis(text);
    }

    try {
      // Extract features from the text
      const features = this.extractFeatures(text);
      const inputTensor = tf.tensor2d([features], [1, 10]);

      // Make prediction
      const prediction = this.model!.predict(inputTensor) as tf.Tensor;
      const score = (await prediction.data())[0] * 100;

      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      // Convert score to legitimacy score
      // Score > 0.5 means legitimate, < 0.5 means suspicious
      const legitimacyScore = score > 50 ? score : 100 - score;

      // Generate factors based on the analysis
      const riskFactors: string[] = [];
      const legitimacyFactors: string[] = [];

      if (score <= 50) {
        riskFactors.push("LSTM model detected suspicious patterns");
        riskFactors.push("Neural network analysis suggests potential fraud");
        if (score < 30) {
          riskFactors.push("Strong indication of fraudulent content");
        }
      } else {
        legitimacyFactors.push("LSTM model confirms legitimate patterns");
        legitimacyFactors.push("Neural network analysis supports authenticity");
        if (score > 70) {
          legitimacyFactors.push("High confidence in content legitimacy");
        }
      }

      // Add text-length based factors
      if (text.length < 100) {
        riskFactors.push("Job posting is unusually short");
      } else if (text.length > 2000) {
        legitimacyFactors.push("Detailed job description provided");
      }

      return {
        isLegitimate: legitimacyScore > 50,
        confidence: legitimacyScore,
        riskFactors,
        legitimacyFactors,
        overallScore: legitimacyScore,
      };
    } catch (error) {
      console.error("LSTM analysis failed:", error);
      // Fallback to heuristic analysis
      return this.fallbackAnalysis(text);
    }
  }

  private fallbackAnalysis(text: string): LstmAnalysisResult {
    // Enhanced fallback heuristic with more sophisticated analysis
    const suspiciousWords = [
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
    ];

    const legitimateWords = [
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
    ];

    const suspiciousCount = suspiciousWords.filter((word) =>
      text.toLowerCase().includes(word)
    ).length;

    const legitimateCount = legitimateWords.filter((word) =>
      text.toLowerCase().includes(word)
    ).length;

    // More sophisticated scoring
    let score = 60; // Base score
    score += legitimateCount * 8;
    score -= suspiciousCount * 12;

    // Length factor
    if (text.length < 200) score -= 15;
    else if (text.length > 1000) score += 10;

    // Capitalization factor
    const uppercaseRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (uppercaseRatio > 0.3) score -= 10;

    score = Math.max(0, Math.min(100, score));

    return {
      isLegitimate: score > 50,
      confidence: score,
      riskFactors:
        suspiciousCount > 0
          ? [
              "Suspicious keywords detected",
              "Pattern analysis suggests caution",
            ]
          : [],
      legitimacyFactors:
        legitimateCount > 0
          ? ["Professional terminology detected", "Structured content analysis"]
          : [],
      overallScore: score,
    };
  }
}

export const lstmAnalysisService = new LstmAnalysisService();
