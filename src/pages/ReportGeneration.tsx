import { useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { LowCreditWarning } from '@/components/credits/LowCreditWarning';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useCredits } from '@/contexts/CreditContext';
import { toast } from 'sonner';
import { sanitizeInput } from '@/utils/formatters';

export default function ReportGeneration() {
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const { credits, deductCredit } = useCredits();

  const handleGenerate = async () => {
    const sanitized = sanitizeInput(companyName);
    if (!sanitized) {
      toast.error('Please enter a company name');
      return;
    }

    if (credits.remaining === 0) {
      toast.error('No credits remaining. Credits reset at midnight IST.');
      return;
    }

    setLoading(true);
    
    try {
      await deductCredit();
      
      // Simulate PDF generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Report generated successfully! (PDF download will be available when backend is online)');
      
      // TODO: Implement actual PDF generation and download
      // const blob = await apiService.generatePDF({ companyName: sanitized });
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `${sanitized}_Intelligence_Report.pdf`;
      // link.click();
      // window.URL.revokeObjectURL(url);
      
    } catch (err: any) {
      console.error('Generation error:', err);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <LowCreditWarning />

        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Generate Tender Intelligence Report</h1>
            <p className="text-muted-foreground">
              Create a comprehensive PDF report for any government tender participant
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Report Details
              </CardTitle>
              <CardDescription>
                Each report costs 1 credit. You have {credits.remaining} credits remaining.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="e.g., ROYAL IMPEX"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter the exact company name as it appears in tender documents
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-semibold mb-2">Report Includes:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Company profile and performance metrics</li>
                  <li>✓ Win/Loss ratio and bid history</li>
                  <li>✓ Price band analysis</li>
                  <li>✓ Department and category distribution</li>
                  <li>✓ Geographic performance analysis</li>
                  <li>✓ Missed-but-winnable opportunities</li>
                  <li>✓ AI-powered strategic insights</li>
                  <li>✓ Monthly trend analysis</li>
                </ul>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || credits.remaining === 0 || !companyName}
                className="w-full gap-2"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Generate Report (1 Credit)
                  </>
                )}
              </Button>

              {credits.remaining === 0 && (
                <p className="text-center text-sm text-destructive">
                  No credits remaining. Credits reset at midnight IST.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Note</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                PDF generation is server-side for optimal quality and performance. 
                Reports typically take 30-60 seconds to generate. The backend service 
                must be online for PDF generation to work.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
