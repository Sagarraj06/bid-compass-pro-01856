import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, History, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { LowCreditWarning } from '@/components/credits/LowCreditWarning';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Search Company',
      description: 'Search and analyze company tender performance',
      icon: Search,
      action: () => navigate('/search'),
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Generate Report',
      description: 'Create comprehensive tender intelligence PDF',
      icon: FileText,
      action: () => navigate('/generate'),
      color: 'text-green-600',
      bgColor: 'bg-green-600/10'
    },
    {
      title: 'Report History',
      description: 'View and download previously generated reports',
      icon: History,
      action: () => navigate('/history'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10'
    },
    {
      title: 'Market Insights',
      description: 'Explore department and state-wise tender analysis',
      icon: TrendingUp,
      action: () => navigate('/search'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-600/10'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <LowCreditWarning />

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Intel Bidder</h1>
          <p className="text-muted-foreground">
            Your comprehensive government tender intelligence platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
                <CardHeader>
                  <div className={`${action.bgColor} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">Get Started →</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platform Features</CardTitle>
            <CardDescription>What you can do with Intel Bidder</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Company Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive bid history, win rates, and performance metrics for any government tender participant.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Strategic recommendations based on historical patterns and competitive landscape analysis.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Professional Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Generate detailed PDF reports with charts, metrics, and actionable intelligence.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
