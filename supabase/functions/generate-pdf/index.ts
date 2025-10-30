import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportData {
  companyName: string;
  bidsData?: any;
  departmentData?: any;
  statesData?: any;
  priceBandData?: any;
  missedOpportunities?: any;
  categories?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName, bidsData, departmentData, statesData, priceBandData, missedOpportunities, categories }: ReportData = await req.json();

    console.log('Generating PDF for company:', companyName);

    if (!companyName) {
      throw new Error('Company name is required');
    }

    // Generate comprehensive HTML report
    const htmlContent = generateHTMLReport({
      companyName,
      bidsData,
      departmentData,
      statesData,
      priceBandData,
      missedOpportunities,
      categories
    });

    // Use Puppeteer to generate PDF
    const pdfResponse = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('api:'),
      },
      body: JSON.stringify({
        source: htmlContent,
        landscape: false,
        use_print: false,
      }),
    });

    if (!pdfResponse.ok) {
      console.error('PDF generation failed:', await pdfResponse.text());
      throw new Error('Failed to generate PDF');
    }

    const pdfBlob = await pdfResponse.arrayBuffer();

    return new Response(pdfBlob, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${companyName}_Intelligence_Report.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('Error in generate-pdf function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate PDF' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateHTMLReport(data: ReportData): string {
  const { companyName, bidsData, departmentData, statesData, priceBandData, missedOpportunities, categories } = data;

  // Calculate metrics
  const winRate = bidsData?.count > 0 ? ((bidsData.table1.win / bidsData.count) * 100).toFixed(1) : '0';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Arial', sans-serif; 
          color: #333; 
          line-height: 1.6;
          padding: 40px;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #2563eb;
        }
        .header h1 {
          color: #1e40af;
          font-size: 32px;
          margin-bottom: 10px;
        }
        .header p {
          color: #64748b;
          font-size: 14px;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 20px;
          color: #1e40af;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        .stat-card {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #2563eb;
        }
        .stat-label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #1e293b;
          margin-top: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th {
          background: #f1f5f9;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #475569;
          border-bottom: 2px solid #cbd5e1;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #e2e8f0;
        }
        tr:hover {
          background: #f8fafc;
        }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
        .badge-win {
          background: #dcfce7;
          color: #166534;
        }
        .badge-lost {
          background: #fee2e2;
          color: #991b1b;
        }
        .chart-container {
          margin: 20px 0;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
        }
        .bar {
          display: flex;
          align-items: center;
          margin: 10px 0;
        }
        .bar-label {
          width: 150px;
          font-size: 13px;
          color: #475569;
        }
        .bar-fill {
          flex: 1;
          height: 24px;
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          border-radius: 4px;
          position: relative;
          margin: 0 10px;
        }
        .bar-value {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          min-width: 60px;
          text-align: right;
        }
        .highlight-box {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
          padding: 15px;
          margin: 15px 0;
          border-radius: 4px;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
          text-align: center;
          color: #64748b;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Tender Intelligence Report</h1>
        <p>Company: ${companyName}</p>
        <p>Generated on: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      ${bidsData ? `
      <div class="section">
        <h2 class="section-title">Performance Overview</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Bids</div>
            <div class="stat-value">${formatNumber(bidsData.count)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Wins</div>
            <div class="stat-value">${formatNumber(bidsData.table1.win)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Win Rate</div>
            <div class="stat-value">${winRate}%</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Value</div>
            <div class="stat-value">${formatCurrency(bidsData.table1.totalBidValue)}</div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Qualified Bid Value</div>
            <div class="stat-value">${formatCurrency(bidsData.table1.qualifiedBidValue)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Disqualified Bid Value</div>
            <div class="stat-value">${formatCurrency(bidsData.table1.disqualifiedBidValue)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Average Order Value</div>
            <div class="stat-value">${formatCurrency(bidsData.table1.averageOrderValue)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Bids Participated</div>
            <div class="stat-value">${formatNumber(bidsData.table1.totalBidsParticipated)}</div>
          </div>
        </div>
      </div>
      ` : ''}

      ${departmentData && Object.keys(bidsData?.departmentCount || {}).length > 0 ? `
      <div class="section">
        <h2 class="section-title">Department Distribution</h2>
        <div class="chart-container">
          ${Object.entries(bidsData.departmentCount)
            .sort(([, a]: any, [, b]: any) => b - a)
            .slice(0, 10)
            .map(([dept, count]: any) => {
              const maxCount = Math.max(...Object.values(bidsData.departmentCount) as number[]);
              const percentage = (count / maxCount) * 100;
              return `
                <div class="bar">
                  <div class="bar-label">${dept}</div>
                  <div class="bar-fill" style="width: ${percentage}%;"></div>
                  <div class="bar-value">${count} bids</div>
                </div>
              `;
            }).join('')}
        </div>
      </div>
      ` : ''}

      ${statesData && Object.keys(bidsData?.stateCount || {}).length > 0 ? `
      <div class="section">
        <h2 class="section-title">Geographic Performance</h2>
        <div class="chart-container">
          ${Object.entries(bidsData.stateCount)
            .sort(([, a]: any, [, b]: any) => b - a)
            .slice(0, 10)
            .map(([state, count]: any) => {
              const maxCount = Math.max(...Object.values(bidsData.stateCount) as number[]);
              const percentage = (count / maxCount) * 100;
              return `
                <div class="bar">
                  <div class="bar-label">${state}</div>
                  <div class="bar-fill" style="width: ${percentage}%;"></div>
                  <div class="bar-value">${count} bids</div>
                </div>
              `;
            }).join('')}
        </div>
      </div>
      ` : ''}

      ${priceBandData ? `
      <div class="section">
        <h2 class="section-title">Price Band Analysis</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Highest Price</div>
            <div class="stat-value">${formatCurrency(priceBandData.highest)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Lowest Price</div>
            <div class="stat-value">${formatCurrency(priceBandData.lowest)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Average Price</div>
            <div class="stat-value">${formatCurrency(priceBandData.average)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Price Range</div>
            <div class="stat-value">${formatCurrency(priceBandData.highest - priceBandData.lowest)}</div>
          </div>
        </div>
      </div>
      ` : ''}

      ${missedOpportunities?.ai?.strategy_summary ? `
      <div class="section">
        <h2 class="section-title">Strategic Insights</h2>
        <div class="highlight-box">
          <p><strong>AI-Powered Strategy Summary:</strong></p>
          <p>${missedOpportunities.ai.strategy_summary}</p>
        </div>
      </div>
      ` : ''}

      ${bidsData?.sortedRows && bidsData.sortedRows.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Recent Bid History (Top 20)</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Status</th>
              <th>Rank</th>
              <th>Price</th>
              <th>Organisation</th>
            </tr>
          </thead>
          <tbody>
            ${bidsData.sortedRows.slice(0, 20).map((bid: any) => `
              <tr>
                <td>${formatDate(bid.participated_on)}</td>
                <td>${truncate(bid.offered_item, 50)}</td>
                <td><span class="badge ${bid.seller_status === 'Win' ? 'badge-win' : 'badge-lost'}">${bid.seller_status}</span></td>
                <td>${bid.rank}</td>
                <td>${formatCurrency(parseFloat(bid.total_price) || 0)}</td>
                <td>${truncate(bid.organisation, 30)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      <div class="footer">
        <p>This report is generated automatically based on government tender data.</p>
        <p>For more information, visit your Tender Intelligence Dashboard.</p>
      </div>
    </body>
    </html>
  `;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
