// Comprehensive evaluation script for BERT vs LSTM fraud detection
import { bertAnalysisService } from "./src/services/bertAnalysis.js";
import { lstmAnalysisService } from "./src/services/lstmAnalysis.js";

class ModelEvaluator {
  constructor() {
    this.testData = this.createTestDataset();
    this.results = { bert: [], lstm: [] };
  }

  createTestDataset() {
    return [
      // LEGITIMATE JOBS (label = 1)
      {
        text: "Senior Software Engineer at Microsoft. Requirements: 5+ years experience with C#, .NET, Azure. Competitive salary $120k-$150k plus comprehensive benefits including health insurance, stock options, and remote work flexibility.",
        label: 1,
        category: "legitimate",
      },
      {
        text: "Marketing Manager position. Bachelor's degree in Marketing or related field required. 3+ years experience in digital marketing. Full-time role with excellent benefits package including 401k matching and professional development opportunities.",
        label: 1,
        category: "legitimate",
      },
      {
        text: "Data Scientist role at Amazon. PhD preferred, Master's required. Experience with Python, R, machine learning. Competitive compensation with equity package and comprehensive benefits.",
        label: 1,
        category: "legitimate",
      },
      {
        text: "UX Designer wanted. Portfolio showcasing web and mobile design projects required. Experience with Figma, Adobe Creative Suite. Competitive salary plus equity in growing startup.",
        label: 1,
        category: "legitimate",
      },
      {
        text: "Project Manager position. PMP certification preferred. Experience with Agile methodologies and project management tools. Excellent benefits including health, dental, and paid time off.",
        label: 1,
        category: "legitimate",
      },

      // SUSPICIOUS JOBS (label = 0)
      {
        text: "Work from home opportunity! Earn $3000 weekly with no experience required. Flexible hours, easy money, start immediately. No interview needed, guaranteed income!",
        label: 0,
        category: "suspicious",
      },
      {
        text: "URGENT: Make money fast! Easy online job paying $5000 per week. No skills needed, work from home, start today. Limited spots available!",
        label: 0,
        category: "suspicious",
      },
      {
        text: "Quick cash opportunity! Earn $100 per hour from home. No experience required, easy money guaranteed. Start immediately with no interview.",
        label: 0,
        category: "suspicious",
      },

      // FRAUDULENT JOBS (label = 0)
      {
        text: "SCAM ALERT: Become a millionaire overnight! Work 2 hours per day from home. No skills needed, get rich quick scheme. Investment required but guaranteed returns!",
        label: 0,
        category: "fraudulent",
      },
      {
        text: "MONEY MAKING SCAM: Easy money from home! Earn $10,000 weekly with no experience. Send money first for training materials. GUARANTEED RICHES!",
        label: 0,
        category: "fraudulent",
      },
      {
        text: "PONZI SCHEME: Invest $1000 and earn $5000 back in one week! No work required, guaranteed profits. Join our millionaire making program today!",
        label: 0,
        category: "fraudulent",
      },
      {
        text: "CRYPTO SCAM: Make millions trading cryptocurrency from home! No experience needed, we provide all signals. Send Bitcoin first for premium membership.",
        label: 0,
        category: "fraudulent",
      },
      {
        text: "JOB SCAM: Work from home data entry job paying $5000/week! No experience needed. Pay $99 for training kit first. GUARANTEED EMPLOYMENT!",
        label: 0,
        category: "fraudulent",
      },
    ];
  }

  async evaluateModels() {
    console.log("🔬 COMPREHENSIVE MODEL EVALUATION: BERT vs LSTM");
    console.log("=".repeat(60));
    console.log(`Testing on ${this.testData.length} job postings...\n`);

    // Run evaluation
    for (let i = 0; i < this.testData.length; i++) {
      const item = this.testData[i];
      console.log(
        `[${i + 1}/${
          this.testData.length
        }] Testing: ${item.category.toUpperCase()} - "${item.text.substring(
          0,
          50
        )}..."`
      );

      try {
        // Get BERT prediction
        const bertResult = await bertAnalysisService.analyzeJobPosting(
          item.text
        );
        const bertPrediction = bertResult.overallScore / 100; // Convert to 0-1 scale
        const bertBinaryPred = bertPrediction > 0.5 ? 1 : 0;

        // Get LSTM prediction
        const lstmResult = await lstmAnalysisService.analyzeJobPosting(
          item.text
        );
        const lstmPrediction = lstmResult.overallScore / 100; // Convert to 0-1 scale
        const lstmBinaryPred = lstmPrediction > 0.5 ? 1 : 0;

        // Store results
        this.results.bert.push({
          prediction: bertPrediction,
          binaryPrediction: bertBinaryPred,
          actual: item.label,
          correct: bertBinaryPred === item.label,
        });

        this.results.lstm.push({
          prediction: lstmPrediction,
          binaryPrediction: lstmBinaryPred,
          actual: item.label,
          correct: lstmBinaryPred === item.label,
        });

        console.log(
          `  BERT: ${bertPrediction.toFixed(
            3
          )} (${bertBinaryPred}) | LSTM: ${lstmPrediction.toFixed(
            3
          )} (${lstmBinaryPred}) | Actual: ${item.actual}`
        );
        console.log(
          `  BERT: ${bertResult.isLegitimate ? "✓" : "✗"} | LSTM: ${
            lstmResult.isLegitimate ? "✓" : "✗"
          } | Correct: ${bertBinaryPred === item.label ? "✓" : "✗"}/${
            lstmBinaryPred === item.label ? "✓" : "✗"
          }`
        );
        console.log("");
      } catch (error) {
        console.error(`  Error on test case ${i + 1}:`, error.message);
      }
    }

    this.calculateMetrics();
  }

  calculateMetrics() {
    console.log("\n📊 PERFORMANCE METRICS");
    console.log("=".repeat(60));

    const bertMetrics = this.calculateModelMetrics(this.results.bert);
    const lstmMetrics = this.calculateModelMetrics(this.results.lstm);

    console.log("SIDE-BY-SIDE COMPARISON:");
    console.log("-".repeat(60));
    console.log(
      "Metric".padEnd(15),
      "LSTM".padEnd(12),
      "BERT".padEnd(12),
      "Difference".padEnd(12)
    );
    console.log("-".repeat(60));

    const metrics = ["accuracy", "precision", "recall", "f1Score", "auc"];
    metrics.forEach((metric) => {
      const lstmVal = lstmMetrics[metric].toFixed(3);
      const bertVal = bertMetrics[metric].toFixed(3);
      const diff = (bertMetrics[metric] - lstmMetrics[metric]).toFixed(3);
      const diffSymbol = parseFloat(diff) > 0 ? "+" : "";
      console.log(
        metric.padEnd(15),
        lstmVal.padEnd(12),
        bertVal.padEnd(12),
        `${diffSymbol}${diff}`.padEnd(12)
      );
    });

    console.log("-".repeat(60));
    console.log("\n🏆 WINNER ANALYSIS:");
    console.log(
      `BERT outperforms LSTM in ${
        metrics.filter((m) => bertMetrics[m] > lstmMetrics[m]).length
      }/${metrics.length} metrics`
    );

    if (bertMetrics.auc > lstmMetrics.auc) {
      console.log(
        "✅ BERT WINS: Higher AUC indicates better overall performance"
      );
    } else {
      console.log(
        "❌ LSTM WINS: Higher AUC indicates better overall performance"
      );
    }

    this.showDetailedBreakdown(bertMetrics, lstmMetrics);
  }

  calculateModelMetrics(results) {
    const tp = results.filter(
      (r) => r.binaryPrediction === 1 && r.actual === 1
    ).length;
    const tn = results.filter(
      (r) => r.binaryPrediction === 0 && r.actual === 0
    ).length;
    const fp = results.filter(
      (r) => r.binaryPrediction === 1 && r.actual === 0
    ).length;
    const fn = results.filter(
      (r) => r.binaryPrediction === 0 && r.actual === 1
    ).length;

    const accuracy = (tp + tn) / results.length;
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1Score = (2 * (precision * recall)) / (precision + recall) || 0;

    // Simple AUC approximation using predictions
    const auc = this.calculateAUC(results);

    return { accuracy, precision, recall, f1Score, auc, tp, tn, fp, fn };
  }

  calculateAUC(results) {
    // Sort by prediction score
    const sorted = [...results].sort((a, b) => b.prediction - a.prediction);

    let auc = 0;
    let prevTpr = 0;
    let prevFpr = 0;
    let tp = 0;
    let fp = 0;
    const totalPos = results.filter((r) => r.actual === 1).length;
    const totalNeg = results.filter((r) => r.actual === 0).length;

    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].actual === 1) tp++;
      else fp++;

      const tpr = tp / totalPos;
      const fpr = fp / totalNeg;

      auc += ((fpr - prevFpr) * (tpr + prevTpr)) / 2;
      prevTpr = tpr;
      prevFpr = fpr;
    }

    return auc;
  }

  showDetailedBreakdown(bertMetrics, lstmMetrics) {
    console.log("\n📈 DETAILED BREAKDOWN:");
    console.log("-".repeat(40));

    console.log("LSTM Confusion Matrix:");
    console.log(`  True Positives:  ${lstmMetrics.tp}`);
    console.log(`  True Negatives:  ${lstmMetrics.tn}`);
    console.log(`  False Positives: ${lstmMetrics.fp}`);
    console.log(`  False Negatives: ${lstmMetrics.fn}`);

    console.log("\nBERT Confusion Matrix:");
    console.log(`  True Positives:  ${bertMetrics.tp}`);
    console.log(`  True Negatives:  ${bertMetrics.tn}`);
    console.log(`  False Positives: ${bertMetrics.fp}`);
    console.log(`  False Negatives: ${bertMetrics.fn}`);

    console.log("\n🎯 KEY INSIGHTS:");
    if (bertMetrics.fp < lstmMetrics.fp) {
      console.log(
        "✅ BERT has fewer false positives (better at avoiding false alarms)"
      );
    }
    if (bertMetrics.fn < lstmMetrics.fn) {
      console.log(
        "✅ BERT has fewer false negatives (better at catching fraud)"
      );
    }
    if (bertMetrics.auc > lstmMetrics.auc) {
      console.log(
        "✅ BERT has higher AUC (better overall discrimination ability)"
      );
    }
  }
}

async function runEvaluation() {
  const evaluator = new ModelEvaluator();
  await evaluator.evaluateModels();
}

console.log("🚀 Starting comprehensive model evaluation...\n");
runEvaluation().catch(console.error);
