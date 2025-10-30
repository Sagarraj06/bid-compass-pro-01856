import { useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { LowCreditWarning } from '@/components/credits/LowCreditWarning';
import { CompanyProfile } from '@/components/company/CompanyProfile';
import { CompanyStats } from '@/components/company/CompanyStats';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart';
import { StatePerformanceChart } from '@/components/charts/StatePerformanceChart';
import { FilterPanel, FilterState } from '@/components/filters/FilterPanel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService } from '@/services/api';
import { useCredits } from '@/contexts/CreditContext';
import { sanitizeInput } from '@/utils/formatters';
import { toast } from 'sonner';
import type { BidsResponse, PriceBandResponse, CategoryItem, Department } from '@/types/api.types';

export default function CompanySearch() {
  const [companyName, setCompanyName] = useState('');
  const [searchedCompany, setSearchedCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [bidsData, setBidsData] = useState<BidsResponse | null>(null);
  const [priceBand, setPriceBand] = useState<PriceBandResponse | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [states, setStates] = useState<any>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  
  const { credits, deductCredit } = useCredits();

  const handleSearch = async () => {
    const sanitized = sanitizeInput(companyName);
    if (!sanitized) {
      toast.error('Please enter a company name');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const [bids, price, cats, statesData, depts] = await Promise.all([
        apiService.getBids(sanitized),
        apiService.getPriceBandAnalysis(sanitized),
        apiService.getCategoryListing(),
        apiService.getTopStates(),
        apiService.getDepartments()
      ]);

      setBidsData(bids);
      setPriceBand(price);
      setCategories(cats);
      setStates(statesData);
      setDepartments(depts);
      setSearchedCompany(sanitized);
      
      if (!bids) {
        setError('No data found for this company. The backend service may be offline.');
      }
    } catch (err: any) {
      console.error('Search error:', err);
      if (err.offline) {
        setError('Backend service is currently unavailable. Please try again later.');
      } else {
        setError('Failed to fetch company data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (credits.remaining === 0) {
      toast.error('No credits remaining. Credits reset at midnight.');
      return;
    }

    try {
      await deductCredit();
      toast.success('Credit deducted. PDF generation feature will be available when backend is online.');
      // TODO: Implement actual PDF generation when backend is ready
    } catch (err) {
      toast.error('Failed to generate report');
    }
  };

  const handleFilterChange = (filters: FilterState) => {
    console.log('Filters changed:', filters);
    // TODO: Apply filters to the data
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <LowCreditWarning />

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Company Search & Analysis</h1>
          
          <div className="flex gap-2 max-w-2xl">
            <Input
              placeholder="Enter company name (e.g., ROYAL IMPEX)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {searchedCompany && (
          <div className="space-y-6">
            <CompanyProfile
              companyName={searchedCompany}
              bidsData={bidsData}
              priceBand={priceBand}
              onGenerateReport={handleGenerateReport}
              creditsRemaining={credits.remaining}
            />

            {bidsData && <CompanyStats data={bidsData} />}

            <FilterPanel
              departments={departments}
              categories={categories}
              onFilterChange={handleFilterChange}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyTrendChart
                monthlyTotals={bidsData?.monthlyTotals || null}
                loading={loading}
              />
              <CategoryPieChart data={categories} loading={loading} />
            </div>

            <StatePerformanceChart
              data={states?.results || null}
              loading={loading}
            />
          </div>
        )}
      </main>
    </div>
  );
}
