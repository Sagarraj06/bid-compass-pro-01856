import { useState } from 'react';
import { Download, FileText, Calendar } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateTime } from '@/utils/formatters';

// Mock data - will be replaced with actual API calls
const mockReports = [
  {
    id: 'RPT-001',
    companyName: 'ROYAL IMPEX',
    generatedOn: new Date('2025-01-15T10:30:00'),
    status: 'Ready',
  },
  {
    id: 'RPT-002',
    companyName: 'APM INDUSTRIES',
    generatedOn: new Date('2025-01-14T15:45:00'),
    status: 'Ready',
  },
];

export default function ReportHistory() {
  const [reports] = useState(mockReports);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Report History</h1>
          <p className="text-muted-foreground">
            View and download your previously generated reports
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>
              All reports remain available for 30 days from generation date
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reports generated yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate your first report from the Company Search page
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Generated On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.companyName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDateTime(report.generatedOn)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={report.status === 'Ready' ? 'default' : 'secondary'}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
