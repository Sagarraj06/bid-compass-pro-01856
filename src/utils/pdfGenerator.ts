import jsPDF from 'jspdf';

export async function generatePDFFromHTML(html: string, companyName: string): Promise<Blob> {
  // Create a temporary container
  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '794px'; // A4 width in pixels at 96 DPI
  document.body.appendChild(container);

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Get all sections
    const sections = container.querySelectorAll('.section');
    const header = container.querySelector('.header');
    
    let yOffset = 10;

    // Add header
    if (header) {
      const headerText = header.textContent || '';
      pdf.setFontSize(16);
      pdf.setTextColor(30, 64, 175);
      pdf.text(companyName, 20, yOffset);
      yOffset += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 20, yOffset);
      yOffset += 15;
    }

    // Process each section
    sections.forEach((section, index) => {
      const sectionTitle = section.querySelector('.section-title');
      const stats = section.querySelectorAll('.stat-card');
      const tables = section.querySelectorAll('table');
      const bars = section.querySelectorAll('.bar');

      // Add section title
      if (sectionTitle) {
        if (yOffset > 250) {
          pdf.addPage();
          yOffset = 20;
        }
        pdf.setFontSize(14);
        pdf.setTextColor(30, 64, 175);
        pdf.text(sectionTitle.textContent || '', 20, yOffset);
        yOffset += 8;
      }

      // Add stat cards
      stats.forEach((stat, statIndex) => {
        if (yOffset > 260) {
          pdf.addPage();
          yOffset = 20;
        }
        const label = stat.querySelector('.stat-label')?.textContent || '';
        const value = stat.querySelector('.stat-value')?.textContent || '';
        
        pdf.setFontSize(9);
        pdf.setTextColor(100, 116, 139);
        pdf.text(label, 20 + (statIndex % 2) * 90, yOffset);
        pdf.setFontSize(12);
        pdf.setTextColor(30, 41, 59);
        pdf.text(value, 20 + (statIndex % 2) * 90, yOffset + 6);
        
        if (statIndex % 2 === 1) {
          yOffset += 12;
        }
      });

      if (stats.length % 2 === 1) {
        yOffset += 12;
      }

      // Add bar charts
      bars.forEach((bar) => {
        if (yOffset > 265) {
          pdf.addPage();
          yOffset = 20;
        }
        const label = bar.querySelector('.bar-label')?.textContent || '';
        const value = bar.querySelector('.bar-value')?.textContent || '';
        
        pdf.setFontSize(9);
        pdf.setTextColor(71, 85, 105);
        pdf.text(label, 20, yOffset);
        pdf.text(value, 160, yOffset);
        
        // Draw bar
        const barWidth = 100;
        pdf.setFillColor(59, 130, 246);
        pdf.rect(70, yOffset - 3, barWidth * 0.7, 4, 'F');
        
        yOffset += 7;
      });

      // Add tables
      tables.forEach((table) => {
        const rows = table.querySelectorAll('tr');
        
        rows.forEach((row, rowIndex) => {
          if (yOffset > 265) {
            pdf.addPage();
            yOffset = 20;
          }

          const cells = row.querySelectorAll('th, td');
          let xOffset = 20;

          cells.forEach((cell, cellIndex) => {
            const text = cell.textContent?.trim() || '';
            const maxWidth = cellIndex === 1 ? 50 : 30;
            
            pdf.setFontSize(8);
            if (row.querySelector('th')) {
              pdf.setTextColor(71, 85, 105);
              pdf.setFont(undefined, 'bold');
            } else {
              pdf.setTextColor(30, 41, 59);
              pdf.setFont(undefined, 'normal');
            }
            
            const truncated = text.length > 20 ? text.substring(0, 20) + '...' : text;
            pdf.text(truncated, xOffset, yOffset);
            xOffset += maxWidth;
          });

          yOffset += 6;
          
          if (rowIndex === 0) {
            pdf.setDrawColor(203, 213, 225);
            pdf.line(20, yOffset - 2, 190, yOffset - 2);
          }
        });

        yOffset += 5;
      });

      yOffset += 5;
    });

    // Add footer
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Page ${i} of ${pageCount}`, 180, 287);
    }

    return pdf.output('blob');
  } finally {
    document.body.removeChild(container);
  }
}
