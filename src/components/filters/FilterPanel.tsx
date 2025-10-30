import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { STATUS_OPTIONS, DATE_RANGE_OPTIONS } from '@/utils/constants';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FilterPanelProps {
  departments: Array<{ department: string; total_tenders: string }>;
  categories: Array<{ [key: string]: number }>;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  dateRange: string;
  department: string;
  category: string;
  status: string;
}

export const FilterPanel = ({ departments, categories, onFilterChange }: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '60',
    department: 'all',
    category: 'all',
    status: 'all'
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      dateRange: '60',
      department: 'all',
      category: 'all',
      status: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const categoryOptions = categories.map(cat => {
    const [name] = Object.keys(cat);
    return { value: name, label: name };
  });

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {isOpen ? 'Hide' : 'Show'}
              </span>
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_RANGE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.department} value={dept.department}>
                      {dept.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={clearFilters} className="w-full gap-2">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
