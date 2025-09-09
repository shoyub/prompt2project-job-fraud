import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  icon: React.ReactNode;
  color: 'success' | 'warning' | 'danger' | 'primary';
}

const stats: StatCard[] = [
  {
    title: 'Jobs Analyzed',
    value: '12,847',
    description: 'Total postings processed',
    trend: 'up',
    trendValue: '+12.5%',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'primary'
  },
  {
    title: 'Legitimate Jobs',
    value: '9,234',
    description: 'Verified authentic postings',
    trend: 'up',
    trendValue: '+8.2%',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'success'
  },
  {
    title: 'Fraudulent Detected',
    value: '3,613',
    description: 'Fake postings identified',
    trend: 'down',
    trendValue: '-5.1%',
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'danger'
  },
  {
    title: 'Accuracy Rate',
    value: '94.8%',
    description: 'ML model precision',
    trend: 'up',
    trendValue: '+2.3%',
    icon: <Shield className="w-5 h-5" />,
    color: 'success'
  }
];

const recentAnalyses = [
  { company: 'TechCorp Solutions', status: 'legitimate', confidence: 92, time: '2 min ago' },
  { company: 'Remote Work Paradise', status: 'fraudulent', confidence: 87, time: '5 min ago' },
  { company: 'DataScience Innovations', status: 'legitimate', confidence: 95, time: '8 min ago' },
  { company: 'Quick Money Jobs', status: 'fraudulent', confidence: 96, time: '12 min ago' },
  { company: 'Enterprise Software Inc', status: 'legitimate', confidence: 89, time: '15 min ago' }
];

export function DashboardStats() {
  const getStatusColor = (status: string) => {
    return status === 'legitimate' ? 'success' : 'danger';
  };

  const getStatusIcon = (status: string) => {
    return status === 'legitimate' ? (
      <CheckCircle className="w-4 h-4 text-success" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-danger" />
    );
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-success" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-success" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card border-border/50 backdrop-blur-sm hover:shadow-premium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                <div className={`text-${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {getTrendIcon(stat.trend)}
                <span className={stat.trend === 'up' ? 'text-success' : 'text-danger'}>
                  {stat.trendValue}
                </span>
                <span>from last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Analyses */}
      <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
          <CardDescription>Latest job posting authenticity checks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAnalyses.map((analysis, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/20 border border-border/50">
                <div className="flex items-center gap-3">
                  {getStatusIcon(analysis.status)}
                  <div>
                    <div className="font-medium text-sm">{analysis.company}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {analysis.status} • {analysis.confidence}% confidence
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusColor(analysis.status) as any} className="mb-1">
                    {analysis.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground">{analysis.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Performance */}
      <Card className="bg-gradient-card border-border/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Model Performance</CardTitle>
          <CardDescription>Current AI detection capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Precision</span>
              <span>94.8%</span>
            </div>
            <Progress value={94.8} className="h-2 [&>div]:bg-success" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Recall</span>
              <span>91.2%</span>
            </div>
            <Progress value={91.2} className="h-2 [&>div]:bg-primary" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>F1-Score</span>
              <span>93.0%</span>
            </div>
            <Progress value={93.0} className="h-2 [&>div]:bg-warning" />
          </div>

          <div className="pt-2 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Model last updated: <span className="text-foreground">2 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}