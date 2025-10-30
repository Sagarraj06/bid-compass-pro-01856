export interface BidData {
  seller_name: string;
  offered_item: string;
  participated_on: string;
  seller_status: string;
  rank: string;
  total_price: string;
  organisation: string;
  department: string;
  ministry: string;
}

export interface BidsResponse {
  count: number;
  departmentCount: Record<string, number>;
  stateCount: Record<string, number>;
  monthlyTotals: Record<string, number>;
  sortedRows: BidData[];
  table1: {
    win: number;
    lost: number;
    totalBidValue: number;
    qualifiedBidValue: number;
    disqualifiedBidValue: number;
    totalBidsParticipated: number;
    averageOrderValue: number;
  };
}

export interface DepartmentSeller {
  seller_name: string;
  participation_count: number;
  rank: number;
}

export interface DepartmentResponse {
  department: string;
  total: number;
  results: DepartmentSeller[];
}

export interface Department {
  department: string;
  total_tenders: string;
}

export interface StatePerformance {
  state_name: string;
  total_tenders: number;
}

export interface StatesResponse {
  generated_at: string;
  ttl_seconds: number;
  results: StatePerformance[];
}

export interface PriceBandResponse {
  highest: number;
  lowest: number;
  average: number;
}

export interface CategoryItem {
  [key: string]: number;
}

export interface MissedWinnableResponse {
  seller: string;
  recentWins: any[];
  marketWins: any[];
  ai: {
    strategy_summary: string;
    likely_wins: any[];
    signals: {
      org_affinity: Array<{ org: string; signal: string }>;
      dept_affinity: Array<{ dept: string; signal: string }>;
      ministry_affinity: Array<{ ministry: string; signal: string }>;
    };
  };
  meta?: any;
}

export interface ReportPayload {
  companyName: string;
  department?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}
