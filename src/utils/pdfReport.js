import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  lumpsumFutureValue,
  stepUpSipFutureValue,
  stepUpSipTotalInvested,
  sipProjection,
  fdMaturity,
  rdMaturity,
  generateAmortization,
} from './calculations';

// jsPDF's built-in fonts have no ₹ glyph — it renders as a garbled superscript.
// Use "Rs." instead; the on-screen calculators still show ₹ via CSS/HTML.
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rs. 0';
  const abs = Math.abs(Math.round(amount));
  const formatted = abs.toLocaleString('en-IN');
  return amount < 0 ? `-Rs. ${formatted}` : `Rs. ${formatted}`;
};

const BRAND = {
  green: [27, 107, 58],
  red: [190, 60, 60],
  gold: [197, 165, 90],
  text: [26, 42, 30],
  muted: [110, 125, 115],
  border: [222, 228, 221],
  panel: [244, 247, 244],
  letterhead: [239, 245, 240],
  white: [255, 255, 255],
};

const MARGIN = 15;

let logoDataUrl = null;

async function loadLogo() {
  if (logoDataUrl) return logoDataUrl;
  logoDataUrl = await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 240;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = '/logo.svg';
  });
  return logoDataUrl;
}

function addHeader(doc, { title, subtitle, forName }, logo) {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(...BRAND.letterhead);
  doc.rect(0, 0, pageWidth, 29, 'F');

  if (logo) doc.addImage(logo, 'PNG', MARGIN, 8, 13, 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(...BRAND.green);
  doc.text('Vitta', MARGIN + 17, 16.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...BRAND.muted);
  doc.text('P L A N   ·   G R O W   ·   P R O T E C T', MARGIN + 17, 21.5);

  doc.setFontSize(9.5);
  doc.setTextColor(...BRAND.text);
  doc.text('vittahub.in', pageWidth - MARGIN, 13, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  doc.text('vittahub.in@gmail.com', pageWidth - MARGIN, 18, { align: 'right' });

  doc.setDrawColor(...BRAND.border);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, 29, pageWidth - MARGIN, 29);
  doc.setDrawColor(...BRAND.gold);
  doc.setLineWidth(0.9);
  doc.line(MARGIN, 29, MARGIN + 20, 29);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...BRAND.text);
  doc.text(title, MARGIN, 40);

  // Subtitle gets its own full-width row (wraps if needed) so it can never run into
  // the forName/date row below it, regardless of how long either string is.
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...BRAND.muted);
  const subtitleWidth = pageWidth - MARGIN * 2;
  const subtitleLines = doc.splitTextToSize(subtitle, subtitleWidth);
  doc.text(subtitleLines, MARGIN, 46);

  let y = 46 + (subtitleLines.length - 1) * 4.3 + 7;
  const genDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  if (forName) {
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BRAND.green);
    doc.text(forName, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...BRAND.muted);
    doc.text(`Generated on ${genDate}`, pageWidth - MARGIN, y, { align: 'right' });
  } else {
    doc.setFontSize(8.5);
    doc.setTextColor(...BRAND.muted);
    doc.text(`Generated on ${genDate}`, pageWidth - MARGIN, y, { align: 'right' });
  }

  return y + 9;
}

function addFooter(doc) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const y = pageHeight - 17;

  doc.setDrawColor(...BRAND.gold);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, y, MARGIN + 12, y);
  doc.setDrawColor(...BRAND.border);
  doc.setLineWidth(0.3);
  doc.line(MARGIN + 12, y, pageWidth - MARGIN, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...BRAND.muted);
  doc.text(
    'Educational estimate only, not investment advice. Vitta is not SEBI-registered as an Investment Adviser or Research Analyst.',
    MARGIN, y + 4.5, { maxWidth: pageWidth - MARGIN * 2 }
  );
  doc.text('vittahub.in  ·  vittahub.in@gmail.com  ·  +91 9000872375', MARGIN, y + 9.5);

  // doc.__footerStamp is an opaque per-document marker, not a param on this
  // shared helper — see generateBlueprintReport(). It's undefined for every
  // other report this file generates, so this is a no-op everywhere else.
  // It exists so a paid PDF carries its purchase receipt on every page: not
  // a bypass-proofing measure (nothing client-side can be that), but a real
  // deterrent against freely redistributing a paid copy once it's stamped
  // with the transaction that paid for it.
  const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
  const rightText = doc.__footerStamp ? `${doc.__footerStamp}  ·  Page ${pageNum}` : `Page ${pageNum}`;
  doc.text(rightText, pageWidth - MARGIN, y + 9.5, { align: 'right' });
}

function addSectionHeading(doc, y, text) {
  doc.setFillColor(...BRAND.green);
  doc.rect(MARGIN, y - 3.3, 1.1, 4.3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.text);
  doc.text(text, MARGIN + 4, y);
}

function addStatCards(doc, y, stats) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const gap = 5;
  const cardWidth = (pageWidth - MARGIN * 2 - gap * (stats.length - 1)) / stats.length;
  const cardHeight = 21;

  stats.forEach((stat, i) => {
    const x = MARGIN + i * (cardWidth + gap);
    if (stat.highlight) {
      doc.setFillColor(...BRAND.green);
      doc.roundedRect(x, y, cardWidth, cardHeight, 2.5, 2.5, 'F');
    } else {
      doc.setFillColor(...BRAND.panel);
      doc.setDrawColor(...BRAND.border);
      doc.setLineWidth(0.25);
      doc.roundedRect(x, y, cardWidth, cardHeight, 2.5, 2.5, 'FD');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...(stat.highlight ? BRAND.white : BRAND.muted));
    doc.text(stat.label.toUpperCase(), x + 4.5, y + 7.5, { maxWidth: cardWidth - 9 });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(stat.small ? 11 : 12);
    doc.setTextColor(...(stat.highlight ? BRAND.white : BRAND.text));
    doc.text(stat.value, x + 4.5, y + 16, { maxWidth: cardWidth - 9 });
  });

  return y + cardHeight + 11;
}

// Generic label/value list — used for "Your Inputs" and any other 2-column breakdown
function addKeyValueTable(doc, y, heading, rows) {
  addSectionHeading(doc, y, heading);
  y += 5.5;

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN, top: 20, bottom: 24 },
    theme: 'plain',
    body: rows.map((r) => [r.label, r.value]),
    styles: { fontSize: 9.5, cellPadding: { top: 1.4, bottom: 1.4, left: 0, right: 0 } },
    columnStyles: {
      0: { textColor: BRAND.muted, cellWidth: 90 },
      1: { textColor: BRAND.text, fontStyle: 'bold' },
    },
    didDrawPage: () => addFooter(doc),
  });

  return doc.lastAutoTable.finalY + 10;
}

// Generic multi-column data table (year-by-year growth, amortization, breakdowns, etc.)
// aligns/colors/bold are keyed by column index; header and body cells are forced to the
// same alignment per column via didParseCell so they can never visually mismatch.
function addDataTable(doc, y, { heading, head, rows, aligns = [], colors = {}, bold = [] }) {
  addSectionHeading(doc, y, heading);
  y += 5.5;

  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN, top: 20, bottom: 24 },
    head: [head],
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: BRAND.green, textColor: BRAND.white, fontStyle: 'bold', fontSize: 9.5 },
    bodyStyles: { fontSize: 9, textColor: BRAND.text },
    alternateRowStyles: { fillColor: BRAND.panel },
    didParseCell: (data) => {
      data.cell.styles.halign = aligns[data.column.index] || 'left';
      if (data.section === 'body') {
        if (colors[data.column.index]) data.cell.styles.textColor = colors[data.column.index];
        if (bold.includes(data.column.index)) data.cell.styles.fontStyle = 'bold';
      }
    },
    didDrawPage: () => addFooter(doc),
  });

  return doc.lastAutoTable.finalY + 10;
}

function saveDoc(doc, filenameBase, forName) {
  const namePart = forName?.trim() ? `-${forName.trim().replace(/[^a-z0-9]+/gi, '-')}` : '';
  const datePart = new Date().toISOString().slice(0, 10);
  doc.save(`Vitta-${filenameBase}-Report${namePart}-${datePart}.pdf`);
}

// Declarative report builder shared by every calculator's report generator.
// spec: { filenameBase, title, subtitle, forName, stats, inputs, table }
async function buildReport({ filenameBase, title, subtitle, forName, stats, inputs, table }) {
  const logo = await loadLogo();
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  let y = addHeader(doc, { title, subtitle, forName: forName?.trim() }, logo);

  if (stats?.length) y = addStatCards(doc, y, stats);
  if (inputs?.length) y = addKeyValueTable(doc, y, inputs.heading || 'Your Inputs', inputs.rows || inputs);
  if (table) {
    addDataTable(doc, y, table);
  } else {
    addFooter(doc);
  }

  saveDoc(doc, filenameBase, forName);
}

const pct = (v) => `${v}%`;
const yrs = (v) => `${v} year${v === 1 ? '' : 's'}`;

/* ============================================
   Investment
   ============================================ */

export async function generateSIPReport({ monthly, rate, years, results, forName }) {
  const multiple = results.invested > 0 ? `${(results.fv / results.invested).toFixed(2)}x` : '-';
  await buildReport({
    filenameBase: 'SIP',
    title: 'SIP Investment Report',
    subtitle: 'Systematic Investment Plan projection, generated using the Vitta SIP Calculator.',
    forName,
    stats: [
      { label: 'Total Value', value: formatCurrency(results.fv), highlight: true },
      { label: 'Invested Amount', value: formatCurrency(results.invested) },
      { label: 'Est. Returns', value: formatCurrency(results.gains) },
      { label: 'Growth Multiple', value: multiple, small: true },
    ],
    inputs: [
      { label: 'Monthly Investment', value: formatCurrency(monthly) },
      { label: 'Expected Return Rate (p.a.)', value: pct(rate) },
      { label: 'Time Period', value: yrs(years) },
    ],
    table: {
      heading: 'Year-by-Year Growth',
      head: ['Year', 'Total Invested', 'Corpus Value', 'Wealth Gained'],
      rows: results.projection.map((d) => [`Year ${d.year}`, formatCurrency(d.invested), formatCurrency(d.value), formatCurrency(d.gains)]),
      aligns: ['left', 'right', 'right', 'right'],
      colors: { 3: BRAND.green },
      bold: [0, 2],
    },
  });
}

export async function generateLumpsumReport({ principal, rate, years, results, forName }) {
  const multiple = results.invested > 0 ? `${(results.fv / results.invested).toFixed(2)}x` : '-';
  const rows = [];
  for (let y = 1; y <= years; y++) {
    const value = Math.round(lumpsumFutureValue(principal, rate, y));
    rows.push([`Year ${y}`, formatCurrency(value), formatCurrency(value - principal)]);
  }
  await buildReport({
    filenameBase: 'Lumpsum',
    title: 'Lumpsum Investment Report',
    subtitle: 'One-time investment projection, generated using the Vitta Lumpsum Calculator.',
    forName,
    stats: [
      { label: 'Total Value', value: formatCurrency(results.fv), highlight: true },
      { label: 'Invested Amount', value: formatCurrency(results.invested) },
      { label: 'Est. Returns', value: formatCurrency(results.gains) },
      { label: 'Growth Multiple', value: multiple, small: true },
    ],
    inputs: [
      { label: 'Investment Amount', value: formatCurrency(principal) },
      { label: 'Expected Return Rate (p.a.)', value: pct(rate) },
      { label: 'Time Period', value: yrs(years) },
    ],
    table: {
      heading: 'Year-by-Year Growth',
      head: ['Year', 'Investment Value', 'Wealth Gained'],
      rows,
      aligns: ['left', 'right', 'right'],
      colors: { 2: BRAND.green },
      bold: [1],
    },
  });
}

export async function generateStepUpSIPReport({ monthly, rate, years, stepUp, results, forName }) {
  const multiple = results.invested > 0 ? `${(results.fv / results.invested).toFixed(2)}x` : '-';
  const rows = [];
  for (let y = 1; y <= years; y++) {
    const value = Math.round(stepUpSipFutureValue(monthly, rate, y, stepUp));
    const invested = Math.round(stepUpSipTotalInvested(monthly, y, stepUp));
    rows.push([`Year ${y}`, formatCurrency(invested), formatCurrency(value), formatCurrency(value - invested)]);
  }
  await buildReport({
    filenameBase: 'StepUp-SIP',
    title: 'Step-up SIP Investment Report',
    subtitle: 'SIP with annual step-up projection, generated using the Vitta Step-up SIP Calculator.',
    forName,
    stats: [
      { label: 'Total Value', value: formatCurrency(results.fv), highlight: true },
      { label: 'Total Invested', value: formatCurrency(results.invested) },
      { label: 'Wealth Gained', value: formatCurrency(results.gains) },
      { label: 'Growth Multiple', value: multiple, small: true },
    ],
    inputs: [
      { label: 'Starting Monthly SIP', value: formatCurrency(monthly) },
      { label: 'Annual Step-up', value: pct(stepUp) },
      { label: 'Expected Return (p.a.)', value: pct(rate) },
      { label: 'Time Period', value: yrs(years) },
    ],
    table: {
      heading: 'Year-by-Year Growth',
      head: ['Year', 'Total Invested', 'Corpus Value', 'Wealth Gained'],
      rows,
      aligns: ['left', 'right', 'right', 'right'],
      colors: { 3: BRAND.green },
      bold: [0, 2],
    },
  });
}

export async function generateMutualFundReport({ invested, currentVal, years, results, forName }) {
  await buildReport({
    filenameBase: 'Mutual-Fund',
    title: 'Mutual Fund Returns Report',
    subtitle: 'Investment return summary, generated using the Vitta Mutual Fund Calculator.',
    forName,
    stats: [
      { label: 'CAGR', value: pct(results.cagr), highlight: true },
      { label: 'Current Value', value: formatCurrency(currentVal) },
      { label: 'Total Returns', value: formatCurrency(results.gains) },
      { label: 'Absolute Return', value: pct(results.gainPercent), small: true },
    ],
    inputs: [
      { label: 'Amount Invested', value: formatCurrency(invested) },
      { label: 'Current Value', value: formatCurrency(currentVal) },
      { label: 'Investment Period', value: yrs(years) },
    ],
  });
}

export async function generateCAGRReport({ initial, final_, years, cagr, forName }) {
  const absReturn = Math.round(((final_ - initial) / initial) * 10000) / 100;
  await buildReport({
    filenameBase: 'CAGR',
    title: 'CAGR Report',
    subtitle: 'Compound Annual Growth Rate summary, generated using the Vitta CAGR Calculator.',
    forName,
    stats: [
      { label: 'CAGR', value: pct(Math.round(cagr * 100) / 100), highlight: true },
      { label: 'Absolute Returns', value: formatCurrency(final_ - initial) },
      { label: 'Absolute Return', value: pct(absReturn), small: true },
    ],
    inputs: [
      { label: 'Initial Value', value: formatCurrency(initial) },
      { label: 'Final Value', value: formatCurrency(final_) },
      { label: 'Time Period', value: yrs(years) },
    ],
  });
}

export async function generateXIRRReport({ cashflows, xirr, forName }) {
  const sorted = [...cashflows].sort((a, b) => new Date(a.date) - new Date(b.date));
  await buildReport({
    filenameBase: 'XIRR',
    title: 'XIRR Report',
    subtitle: 'Annualized return on irregular cash flows, generated using the Vitta XIRR Calculator.',
    forName,
    stats: [
      { label: 'XIRR', value: pct(Math.round(xirr * 100) / 100), highlight: true },
    ],
    table: {
      heading: 'Cash Flows',
      head: ['Date', 'Type', 'Amount'],
      rows: sorted.map((cf) => [
        new Date(cf.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        cf.amount < 0 ? 'Investment' : 'Redemption',
        formatCurrency(cf.amount),
      ]),
      aligns: ['left', 'left', 'right'],
      bold: [2],
    },
  });
}

export async function generateSWPReport({ corpus, withdrawal, rate, years, results, forName }) {
  const rows = results.data.map((d) => [
    `Year ${d.month / 12}`,
    formatCurrency(withdrawal * d.month),
    formatCurrency(d.corpus),
  ]);
  await buildReport({
    filenameBase: 'SWP',
    title: 'SWP Withdrawal Report',
    subtitle: 'Systematic Withdrawal Plan projection, generated using the Vitta SWP Calculator.',
    forName,
    stats: [
      { label: 'Final Corpus', value: formatCurrency(results.finalCorpus), highlight: true },
      { label: 'Total Withdrawn', value: formatCurrency(results.totalWithdrawn) },
      { label: 'Initial Corpus', value: formatCurrency(corpus) },
    ],
    inputs: [
      { label: 'Total Corpus', value: formatCurrency(corpus) },
      { label: 'Monthly Withdrawal', value: formatCurrency(withdrawal) },
      { label: 'Expected Return (p.a.)', value: pct(rate) },
      { label: 'Period', value: yrs(years) },
    ],
    table: rows.length ? {
      heading: 'Year-by-Year Corpus',
      head: ['Year', 'Cumulative Withdrawn', 'Remaining Corpus'],
      rows,
      aligns: ['left', 'right', 'right'],
      bold: [2],
    } : null,
  });
}

/* ============================================
   Fixed Income
   ============================================ */

export async function generateFDReport({ principal, rate, years, results, forName }) {
  const rows = [];
  for (let y = 1; y <= years; y++) {
    const value = Math.round(fdMaturity(principal, rate, y));
    rows.push([`Year ${y}`, formatCurrency(value), formatCurrency(value - principal)]);
  }
  await buildReport({
    filenameBase: 'FD',
    title: 'Fixed Deposit Report',
    subtitle: 'FD maturity projection (quarterly compounding), generated using the Vitta FD Calculator.',
    forName,
    stats: [
      { label: 'Maturity Amount', value: formatCurrency(results.maturity), highlight: true },
      { label: 'Principal', value: formatCurrency(principal) },
      { label: 'Interest Earned', value: formatCurrency(results.interest) },
    ],
    inputs: [
      { label: 'Deposit Amount', value: formatCurrency(principal) },
      { label: 'Interest Rate (p.a.)', value: pct(rate) },
      { label: 'Tenure', value: yrs(years) },
    ],
    table: {
      heading: 'Year-by-Year Growth',
      head: ['Year', 'Value', 'Interest Earned'],
      rows,
      aligns: ['left', 'right', 'right'],
      colors: { 2: BRAND.green },
      bold: [1],
    },
  });
}

export async function generateRDReport({ monthly, rate, years, results, forName }) {
  const rows = [];
  for (let y = 1; y <= years; y++) {
    const value = Math.round(rdMaturity(monthly, rate, y));
    const invested = monthly * y * 12;
    rows.push([`Year ${y}`, formatCurrency(invested), formatCurrency(value), formatCurrency(value - invested)]);
  }
  await buildReport({
    filenameBase: 'RD',
    title: 'Recurring Deposit Report',
    subtitle: 'RD maturity projection, generated using the Vitta RD Calculator.',
    forName,
    stats: [
      { label: 'Maturity Amount', value: formatCurrency(results.maturity), highlight: true },
      { label: 'Total Deposited', value: formatCurrency(results.invested) },
      { label: 'Interest Earned', value: formatCurrency(results.interest) },
    ],
    inputs: [
      { label: 'Monthly Deposit', value: formatCurrency(monthly) },
      { label: 'Interest Rate (p.a.)', value: pct(rate) },
      { label: 'Tenure', value: yrs(years) },
    ],
    table: {
      heading: 'Year-by-Year Growth',
      head: ['Year', 'Total Deposited', 'Value', 'Interest Earned'],
      rows,
      aligns: ['left', 'right', 'right', 'right'],
      colors: { 3: BRAND.green },
      bold: [0, 2],
    },
  });
}

export async function generatePPFReport({ annual, rate, years, results, forName }) {
  await buildReport({
    filenameBase: 'PPF',
    title: 'PPF Report',
    subtitle: 'Public Provident Fund projection, generated using the Vitta PPF Calculator.',
    forName,
    stats: [
      { label: 'Maturity Amount', value: formatCurrency(results.maturity), highlight: true },
      { label: 'Total Invested', value: formatCurrency(results.totalInvested) },
      { label: 'Interest Earned', value: formatCurrency(results.interest) },
    ],
    inputs: [
      { label: 'Annual Deposit', value: formatCurrency(annual) },
      { label: 'Interest Rate (p.a.)', value: pct(rate) },
      { label: 'Duration', value: yrs(years) },
    ],
    table: {
      heading: 'Year-by-Year Growth',
      head: ['Year', 'Annual Deposit', 'Balance'],
      rows: results.yearData.map((d) => [`Year ${d.year}`, formatCurrency(d.deposit), formatCurrency(d.balance)]),
      aligns: ['left', 'right', 'right'],
      bold: [2],
    },
  });
}

export async function generateNPSReport({ monthly, rate, years, annuity, results, forName }) {
  const projection = sipProjection(monthly, rate, years);
  await buildReport({
    filenameBase: 'NPS',
    title: 'NPS Report',
    subtitle: 'National Pension System projection, generated using the Vitta NPS Calculator.',
    forName,
    stats: [
      { label: 'Total Corpus', value: formatCurrency(results.totalCorpus), highlight: true },
      { label: 'Lumpsum Payout', value: formatCurrency(results.lumpsum) },
      { label: 'Annuity Investment', value: formatCurrency(results.annuityAmount) },
      { label: 'Total Invested', value: formatCurrency(results.totalInvested) },
    ],
    inputs: [
      { label: 'Monthly Contribution', value: formatCurrency(monthly) },
      { label: 'Expected Return (p.a.)', value: pct(rate) },
      { label: 'Years till Retirement', value: yrs(years) },
      { label: 'Annuity Allocation', value: pct(annuity) },
      { label: 'Wealth Gained', value: formatCurrency(results.wealthGained) },
    ],
    table: {
      heading: 'Year-by-Year Growth',
      head: ['Year', 'Total Invested', 'Corpus Value', 'Wealth Gained'],
      rows: projection.map((d) => [`Year ${d.year}`, formatCurrency(d.invested), formatCurrency(d.value), formatCurrency(d.gains)]),
      aligns: ['left', 'right', 'right', 'right'],
      colors: { 3: BRAND.green },
      bold: [0, 2],
    },
  });
}

export async function generateBondYieldReport({ face, coupon, price, years, ytm, forName }) {
  const couponAmount = Math.round((face * coupon) / 100);
  const rows = [];
  for (let y = 1; y <= years; y++) {
    const redemption = y === years ? face : 0;
    rows.push([`Year ${y}`, formatCurrency(couponAmount), redemption ? formatCurrency(redemption) : '-', formatCurrency(couponAmount + redemption)]);
  }
  await buildReport({
    filenameBase: 'Bond-Yield',
    title: 'Bond Yield Report',
    subtitle: 'Yield to Maturity summary, generated using the Vitta Bond Yield Calculator.',
    forName,
    stats: [
      { label: 'Yield to Maturity', value: pct(Math.round(ytm * 100) / 100), highlight: true },
      { label: 'Annual Coupon', value: formatCurrency(couponAmount) },
      { label: 'Capital Gain/Loss', value: formatCurrency(face - price) },
    ],
    inputs: [
      { label: 'Face Value', value: formatCurrency(face) },
      { label: 'Coupon Rate', value: pct(coupon) },
      { label: 'Current Market Price', value: formatCurrency(price) },
      { label: 'Years to Maturity', value: yrs(years) },
    ],
    table: {
      heading: 'Cash Flow Schedule',
      head: ['Year', 'Coupon', 'Redemption', 'Total Cash Flow'],
      rows,
      aligns: ['left', 'right', 'right', 'right'],
      colors: { 3: BRAND.green },
      bold: [0],
    },
  });
}

/* ============================================
   Loans
   ============================================ */

function amortizationTable(schedule) {
  return {
    heading: 'Year-by-Year Amortization',
    head: ['Year', 'Principal Paid', 'Interest Paid', 'Balance Remaining'],
    rows: schedule.map((d) => [`Year ${d.year}`, formatCurrency(d.principal), formatCurrency(d.interest), formatCurrency(d.balance)]),
    aligns: ['left', 'right', 'right', 'right'],
    colors: { 2: BRAND.red },
    bold: [0, 3],
  };
}

export async function generateEMIReport({ principal, rate, years, results, forName }) {
  const amort = generateAmortization(principal, rate, years);
  await buildReport({
    filenameBase: 'EMI',
    title: 'EMI Report',
    subtitle: 'Loan EMI summary, generated using the Vitta EMI Calculator.',
    forName,
    stats: [
      { label: 'Monthly EMI', value: formatCurrency(results.emi), highlight: true },
      { label: 'Total Interest', value: formatCurrency(results.interest) },
      { label: 'Total Payment', value: formatCurrency(results.total) },
    ],
    inputs: [
      { label: 'Loan Amount', value: formatCurrency(principal) },
      { label: 'Interest Rate (p.a.)', value: pct(rate) },
      { label: 'Loan Tenure', value: yrs(years) },
    ],
    table: amortizationTable(amort.schedule),
  });
}

export async function generateHomeLoanReport({ principal, rate, years, results, forName }) {
  await buildReport({
    filenameBase: 'Home-Loan',
    title: 'Home Loan Report',
    subtitle: 'Home loan EMI and amortization schedule, generated using the Vitta Home Loan Calculator.',
    forName,
    stats: [
      { label: 'Monthly EMI', value: formatCurrency(results.emi), highlight: true },
      { label: 'Total Interest', value: formatCurrency(results.totalInterest) },
      { label: 'Total Payment', value: formatCurrency(results.totalPayment) },
    ],
    inputs: [
      { label: 'Loan Amount', value: formatCurrency(principal) },
      { label: 'Interest Rate (p.a.)', value: pct(rate) },
      { label: 'Tenure', value: yrs(years) },
    ],
    table: amortizationTable(results.schedule),
  });
}

export async function generateCarLoanReport({ price, down, rate, years, results, forName }) {
  const amort = generateAmortization(results.loan, rate, years);
  await buildReport({
    filenameBase: 'Car-Loan',
    title: 'Car Loan Report',
    subtitle: 'Car loan EMI and total cost, generated using the Vitta Car Loan Calculator.',
    forName,
    stats: [
      { label: 'Monthly EMI', value: formatCurrency(results.emi), highlight: true },
      { label: 'Loan Amount', value: formatCurrency(results.loan) },
      { label: 'Total Interest', value: formatCurrency(results.interest) },
      { label: 'Total Cost of Car', value: formatCurrency(results.totalCost), small: true },
    ],
    inputs: [
      { label: 'Car Price', value: formatCurrency(price) },
      { label: 'Down Payment', value: formatCurrency(down) },
      { label: 'Interest Rate (p.a.)', value: pct(rate) },
      { label: 'Tenure', value: yrs(years) },
    ],
    table: amortizationTable(amort.schedule),
  });
}

/* ============================================
   Planning
   ============================================ */

export async function generateGoalPlanningReport({ target, years, rate, inflation, results, forName }) {
  const projection = sipProjection(results.sip, rate, years);
  // The monthly SIP shown/used here is rounded to the nearest rupee, so compounding it
  // year-by-year lands a few rupees off the precisely-computed goal figures shown in the
  // stat cards. Snap the final row to those exact figures so the two never visibly disagree.
  if (projection.length) {
    const last = projection[projection.length - 1];
    last.invested = results.totalInvested;
    last.value = results.inflatedTarget;
  }
  await buildReport({
    filenameBase: 'Goal-Planning',
    title: 'Goal Planning Report',
    subtitle: 'Monthly SIP required to reach your goal, generated using the Vitta Goal Planning Calculator.',
    forName,
    stats: [
      { label: 'Required Monthly SIP', value: formatCurrency(results.sip), highlight: true },
      { label: 'Future Goal (Inflation Adj.)', value: formatCurrency(results.inflatedTarget) },
      { label: 'Total Investment', value: formatCurrency(results.totalInvested) },
    ],
    inputs: [
      { label: "Goal Amount (Today's Value)", value: formatCurrency(target) },
      { label: 'Time to Goal', value: yrs(years) },
      { label: 'Expected Return (p.a.)', value: pct(rate) },
      { label: 'Inflation Rate', value: pct(inflation) },
    ],
    table: {
      heading: 'Projected Path to Your Goal',
      head: ['Year', 'Total Invested', 'Projected Corpus'],
      rows: projection.map((d) => [`Year ${d.year}`, formatCurrency(d.invested), formatCurrency(d.value)]),
      aligns: ['left', 'right', 'right'],
      bold: [2],
    },
  });
}

export async function generateRetirementReport({ age, retireAge, expense, inflation, preReturn, postReturn, results, forName }) {
  const projection = sipProjection(results.monthlySIP, preReturn, results.yearsToRetire);
  if (projection.length) projection[projection.length - 1].value = results.corpus;
  await buildReport({
    filenameBase: 'Retirement',
    title: 'Retirement Planning Report',
    subtitle: 'Retirement corpus and savings plan, generated using the Vitta Retirement Calculator.',
    forName,
    stats: [
      { label: 'Corpus Needed', value: formatCurrency(results.corpus), highlight: true },
      { label: 'Monthly SIP Required', value: formatCurrency(results.monthlySIP) },
      { label: 'Future Monthly Expense', value: formatCurrency(results.futureExpense) },
    ],
    inputs: [
      { label: 'Current Age', value: `${age} years` },
      { label: 'Retirement Age', value: `${retireAge} years` },
      { label: 'Monthly Expenses (Today)', value: formatCurrency(expense) },
      { label: 'Inflation Rate', value: pct(inflation) },
      { label: 'Pre-Retirement Return', value: pct(preReturn) },
      { label: 'Post-Retirement Return', value: pct(postReturn) },
    ],
    table: projection.length ? {
      heading: 'Projected Path to Retirement',
      head: ['Year', 'Total Invested', 'Projected Corpus'],
      rows: projection.map((d) => [`Year ${d.year}`, formatCurrency(d.invested), formatCurrency(d.value)]),
      aligns: ['left', 'right', 'right'],
      bold: [2],
    } : null,
  });
}

export async function generateFIREReport({ annualExpense, withdrawalRate, currentSavings, rate, results, forName }) {
  const hasTable = results.yearsToFire > 0 && results.monthlySIP > 0;
  const projection = hasTable ? sipProjection(results.monthlySIP, rate, results.yearsToFire) : [];
  if (projection.length) projection[projection.length - 1].value = results.gap;
  await buildReport({
    filenameBase: 'FIRE',
    title: 'FIRE Report',
    subtitle: 'Financial Independence, Retire Early plan, generated using the Vitta FIRE Calculator.',
    forName,
    stats: [
      { label: 'FIRE Number', value: formatCurrency(results.fireNumber), highlight: true },
      { label: 'Gap to FIRE', value: formatCurrency(results.gap) },
      { label: 'Monthly Passive Income', value: formatCurrency(results.monthlyPassive) },
      { label: 'Est. Years to FIRE', value: `${results.yearsToFire}`, small: true },
    ],
    inputs: [
      { label: 'Annual Expenses', value: formatCurrency(annualExpense) },
      { label: 'Safe Withdrawal Rate', value: pct(withdrawalRate) },
      { label: 'Current Savings/Investments', value: formatCurrency(currentSavings) },
      { label: 'Expected Return (p.a.)', value: pct(rate) },
      { label: 'Required Monthly SIP', value: formatCurrency(results.monthlySIP) },
    ],
    table: hasTable ? {
      heading: 'Projected Path to FIRE',
      head: ['Year', 'Total Invested', 'Projected Corpus'],
      rows: projection.map((d) => [`Year ${d.year}`, formatCurrency(d.invested), formatCurrency(d.value)]),
      aligns: ['left', 'right', 'right'],
      bold: [2],
    } : null,
  });
}

export async function generateEmergencyFundReport({ expense, months, current, results, forName }) {
  await buildReport({
    filenameBase: 'Emergency-Fund',
    title: 'Emergency Fund Report',
    subtitle: 'Emergency fund adequacy check, generated using the Vitta Emergency Fund Calculator.',
    forName,
    stats: [
      { label: 'Required Fund', value: formatCurrency(results.required), highlight: true },
      { label: 'Gap to Fill', value: formatCurrency(results.gap) },
      { label: 'Months Covered', value: `${results.covered}`, small: true },
    ],
    inputs: [
      { label: 'Monthly Expenses', value: formatCurrency(expense) },
      { label: 'Months of Cover', value: `${months} months` },
      { label: 'Current Emergency Savings', value: formatCurrency(current) },
    ],
  });
}

export async function generateInflationReport({ amount, rate, years, results, forName }) {
  const rows = [];
  for (let y = 1; y <= years; y++) {
    const futureCost = Math.round(amount * Math.pow(1 + rate / 100, y));
    const purchasingPower = Math.round(amount / Math.pow(1 + rate / 100, y));
    rows.push([`Year ${y}`, formatCurrency(futureCost), formatCurrency(purchasingPower)]);
  }
  await buildReport({
    filenameBase: 'Inflation',
    title: 'Inflation Impact Report',
    subtitle: "How inflation erodes your money's value, generated using the Vitta Inflation Calculator.",
    forName,
    stats: [
      { label: "Today's Value Then", value: formatCurrency(results.purchasingPower), highlight: true },
      { label: 'Future Cost', value: formatCurrency(results.futureValue) },
      { label: 'Purchasing Power Lost', value: formatCurrency(results.loss) },
    ],
    inputs: [
      { label: 'Current Amount', value: formatCurrency(amount) },
      { label: 'Inflation Rate', value: pct(rate) },
      { label: 'Time Period', value: yrs(years) },
    ],
    table: {
      heading: 'Year-by-Year Erosion',
      head: ['Year', 'Future Cost of Today\'s Amount', "Today's Amount Will Be Worth"],
      rows,
      aligns: ['left', 'right', 'right'],
      bold: [2],
    },
  });
}

export async function generateAssetAllocationReport({ age, risk, allocation, forName }) {
  const riskLabel = { conservative: 'Conservative', moderate: 'Moderate', aggressive: 'Aggressive' }[risk] || risk;
  await buildReport({
    filenameBase: 'Asset-Allocation',
    title: 'Asset Allocation Report',
    subtitle: 'Sample portfolio split by age and risk profile, generated using the Vitta Asset Allocation Calculator.',
    forName,
    stats: [
      { label: 'Equity', value: pct(allocation.equity), highlight: true },
      { label: 'Debt', value: pct(allocation.debt) },
      { label: 'Gold', value: pct(allocation.gold) },
      { label: 'REITs / Others', value: pct(allocation.reit), small: true },
    ],
    inputs: [
      { label: 'Your Age', value: `${age} years` },
      { label: 'Risk Profile', value: riskLabel },
    ],
    table: {
      heading: 'Recommended Allocation',
      head: ['Asset Class', 'Allocation'],
      rows: [
        ['Equity (Stocks/MF)', pct(allocation.equity)],
        ['Debt (FD/PPF/Bonds)', pct(allocation.debt)],
        ['Gold (ETF/SGB)', pct(allocation.gold)],
        ['REITs / Others', pct(allocation.reit)],
      ],
      aligns: ['left', 'right'],
      bold: [1],
    },
  });
}

export async function generateNetWorthReport({ assets, liabilities, totalAssets, totalLiab, netWorth, forName }) {
  const rows = [
    ...assets.map((a) => ['Asset', a.name, formatCurrency(a.value)]),
    ...liabilities.map((l) => ['Liability', l.name, formatCurrency(l.value)]),
  ];
  await buildReport({
    filenameBase: 'Net-Worth',
    title: 'Net Worth Report',
    subtitle: 'Assets and liabilities snapshot, generated using the Vitta Net Worth Tracker.',
    forName,
    stats: [
      { label: 'Net Worth', value: formatCurrency(netWorth), highlight: true },
      { label: 'Total Assets', value: formatCurrency(totalAssets) },
      { label: 'Total Liabilities', value: formatCurrency(totalLiab) },
    ],
    table: rows.length ? {
      heading: 'Assets & Liabilities',
      head: ['Type', 'Item', 'Amount'],
      rows,
      aligns: ['left', 'left', 'right'],
      bold: [2],
    } : null,
  });
}

/* ============================================
   Insurance & Tax
   ============================================ */

export async function generateInsuranceNeedReport({ income, yearsReplace, liabilities, futureCosts, existing, results, forName }) {
  await buildReport({
    filenameBase: 'Insurance-Need',
    title: 'Insurance Need Report',
    subtitle: 'Life insurance cover requirement, generated using the Vitta Insurance Need Calculator.',
    forName,
    stats: [
      { label: 'Insurance You Need', value: formatCurrency(results.need), highlight: true },
      { label: 'Income Replacement', value: formatCurrency(results.incomeReplacement) },
      { label: 'Existing Cover', value: formatCurrency(existing) },
    ],
    inputs: [
      { label: 'Annual Income', value: formatCurrency(income) },
      { label: 'Years to Replace Income', value: yrs(yearsReplace) },
      { label: 'Outstanding Liabilities', value: formatCurrency(liabilities) },
      { label: 'Future Costs (Education etc.)', value: formatCurrency(futureCosts) },
      { label: 'Existing Life Cover', value: formatCurrency(existing) },
    ],
    table: {
      heading: 'Coverage Breakdown',
      head: ['Component', 'Amount'],
      rows: [
        ['Income Replacement', formatCurrency(results.incomeReplacement)],
        ['Outstanding Liabilities', formatCurrency(liabilities)],
        ['Future Costs', formatCurrency(futureCosts)],
        ['Less: Existing Cover', `-${formatCurrency(existing)}`],
        ['Insurance Needed', formatCurrency(results.need)],
      ],
      aligns: ['left', 'right'],
      bold: [1],
    },
  });
}

export async function generateHumanLifeValueReport({ income, expenses, yearsToRetire, discount, hlv, forName }) {
  await buildReport({
    filenameBase: 'Human-Life-Value',
    title: 'Human Life Value Report',
    subtitle: 'Economic value of your life, generated using the Vitta Human Life Value Calculator.',
    forName,
    stats: [
      { label: 'Human Life Value', value: formatCurrency(hlv), highlight: true },
      { label: 'Annual Net Contribution', value: formatCurrency(income - expenses) },
      { label: 'Years Remaining', value: `${yearsToRetire}`, small: true },
    ],
    inputs: [
      { label: 'Annual Income', value: formatCurrency(income) },
      { label: 'Annual Personal Expenses', value: formatCurrency(expenses) },
      { label: 'Years to Retirement', value: yrs(yearsToRetire) },
      { label: 'Discount Rate', value: pct(discount) },
    ],
  });
}

export async function generateTaxReport({ income, ded80C, ded80D, hra, other, results, forName }) {
  await buildReport({
    filenameBase: 'Tax',
    title: 'Tax Report — FY 2025-26',
    subtitle: 'Old vs New regime comparison, generated using the Vitta Tax Calculator.',
    forName,
    stats: [
      { label: `${results.betterRegime} Regime Saves`, value: formatCurrency(Math.abs(results.savings)), highlight: true },
      { label: 'Old Regime Total Tax', value: formatCurrency(results.old.total) },
      { label: 'New Regime Total Tax', value: formatCurrency(results.new.total) },
    ],
    inputs: [
      { label: 'Gross Annual Income', value: formatCurrency(income) },
      { label: 'Section 80C', value: formatCurrency(ded80C) },
      { label: 'Section 80D', value: formatCurrency(ded80D) },
      { label: 'HRA Exemption', value: formatCurrency(hra) },
      { label: 'Other Deductions', value: formatCurrency(other) },
    ],
    table: {
      heading: 'Regime Comparison',
      head: ['Regime', 'Taxable Income', 'Tax', 'Cess', 'Total Payable'],
      rows: [
        ['Old Regime', formatCurrency(results.old.taxableIncome), formatCurrency(results.old.tax), formatCurrency(results.old.cess), formatCurrency(results.old.total)],
        ['New Regime', formatCurrency(results.new.taxableIncome), formatCurrency(results.new.tax), formatCurrency(results.new.cess), formatCurrency(results.new.total)],
      ],
      aligns: ['left', 'right', 'right', 'right', 'right'],
      bold: [0, 4],
    },
  });
}

export async function generateHRAReport({ basic, hraReceived, rent, metro, results, forName }) {
  await buildReport({
    filenameBase: 'HRA',
    title: 'HRA Exemption Report',
    subtitle: 'House Rent Allowance exemption, generated using the Vitta HRA Calculator.',
    forName,
    stats: [
      { label: 'HRA Exemption (Annual)', value: formatCurrency(results.exemption), highlight: true },
      { label: 'Taxable HRA', value: formatCurrency(results.taxableHRA) },
    ],
    inputs: [
      { label: 'Basic Salary (Monthly)', value: formatCurrency(basic) },
      { label: 'HRA Received (Monthly)', value: formatCurrency(hraReceived) },
      { label: 'Rent Paid (Monthly)', value: formatCurrency(rent) },
      { label: 'City Type', value: metro ? 'Metro' : 'Non-Metro' },
    ],
    table: {
      heading: 'Exemption Calculation (Minimum of 3)',
      head: ['Component', 'Amount'],
      rows: [
        ['1. Actual HRA Received', formatCurrency(results.breakdown.actualHRA)],
        ['2. Rent Paid - 10% of Basic', formatCurrency(results.breakdown.rentMinus10Percent)],
        [`3. ${metro ? '50' : '40'}% of Basic Salary`, formatCurrency(results.breakdown.percentOfBasic)],
      ],
      aligns: ['left', 'right'],
      bold: [1],
    },
  });
}

/* ============================================
   Vitta Financial Blueprint — premium multi-section report
   Unlike every report above (one buildReport() call, one table),
   this report chains many sections together. addDataTable/
   addKeyValueTable already paginate their own rows and stamp a
   footer on every page they touch (proven by the loan amortization
   / tax reports above); ensureSpace() only needs to guard the few
   section headings / stat-cards from being orphaned at the very
   bottom of a page.
   ============================================ */

function ensureSpace(doc, y, needed) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 24) {
    addFooter(doc);
    doc.addPage();
    return 20;
  }
  return y;
}

// Action-plan descriptions and user-typed goal names are free text that can
// contain a ₹ — unlike every number elsewhere in this file (which already
// goes through formatCurrency()'s "Rs." formatting), these strings are built
// as plain text shared with the on-screen cards, where ₹ renders fine via
// HTML/CSS. jsPDF's built-in Helvetica has no ₹ glyph: left in, it doesn't
// just show as a garbled character, it throws off autoTable's text-wrapping
// for the rest of the string too. Sanitize any free text at this PDF
// boundary rather than pushing PDF-specific formatting into the shared
// engine or wizard input.
const pdfSafeText = (text) => (typeof text === 'string' ? text.replace(/₹/g, 'Rs. ') : text);

export async function generateBlueprintReport(plan, forName, receipt) {
  const {
    profile, healthScore, savings, emergency, goalsAnalysis, goalsTax,
    overallAllocation, instruments, projection, lifeInsurance, healthInsurance,
    actions, portfolioTax,
  } = plan;

  const logo = await loadLogo();
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  // Paid copies carry their Razorpay payment id in the footer of every page
  // (see addFooter). Free/launch-period copies (receipt undefined) are
  // unstamped — there's nothing to trace, and nothing to imply otherwise.
  if (receipt?.paymentId) doc.__footerStamp = `Receipt ${pdfSafeText(String(receipt.paymentId))}`;

  let y = addHeader(doc, {
    title: 'Financial Blueprint Report',
    subtitle: 'A complete, goal-based financial plan, generated using the Vitta Financial Blueprint tool.',
    forName: forName?.trim(),
  }, logo);

  // Executive summary
  y = ensureSpace(doc, y, 40);
  y = addStatCards(doc, y, [
    { label: 'Financial Health Score', value: `${healthScore.score}/100 · ${healthScore.grade}`, highlight: true },
    { label: 'Required Monthly SIP', value: formatCurrency(goalsAnalysis.totalRequiredSIP) },
    { label: 'Available Surplus', value: formatCurrency(goalsAnalysis.availableSurplus) },
    { label: 'Goals Fully Funded', value: goalsAnalysis.isFullyAffordable ? 'Yes' : 'Partially', small: true },
  ]);

  // Health score breakdown
  y = ensureSpace(doc, y, 45);
  y = addDataTable(doc, y, {
    heading: 'Financial Health Score Breakdown',
    head: ['Category', 'Score', 'Out of'],
    rows: Object.values(healthScore.breakdown).map((b) => [b.label, `${b.score}`, `${b.max}`]),
    aligns: ['left', 'right', 'right'],
    bold: [1],
  });

  // Cash flow
  const totalIncome = (profile.monthlyIncome || 0) + (profile.otherIncome || 0);
  y = ensureSpace(doc, y, 45);
  y = addKeyValueTable(doc, y, 'Cash Flow Summary', [
    { label: 'Monthly Income', value: formatCurrency(totalIncome) },
    { label: 'Monthly Expenses + EMIs', value: formatCurrency((profile.monthlyExpenses || 0) + (profile.emiPayments || 0)) },
    { label: 'Monthly Surplus', value: formatCurrency(savings.monthlySavings) },
    { label: 'Savings Rate', value: `${savings.savingsRate}%` },
    { label: 'Emergency Fund (Current / Required)', value: `${formatCurrency(emergency.current)} / ${formatCurrency(emergency.required)}` },
  ]);

  // Goal-by-goal plan. "Status" reflects whether the allocated SIP actually
  // covers the required SIP (g.affordable) — not g.fundedPercent, which is a
  // different number (how much is already pre-funded by a lump sum, before
  // any new SIP). Showing fundedPercent here, right beside Required/Allocated
  // SIP, reads as if it relates to those two columns when it doesn't — a
  // clearer "Status" column answers the question those columns actually raise.
  y = ensureSpace(doc, y, 50);
  y = addDataTable(doc, y, {
    heading: 'Goal-by-Goal Plan',
    head: ['Goal', 'Target (Yrs)', 'Future Value', 'Required SIP', 'Allocated SIP', 'Status'],
    rows: goalsAnalysis.goals.map((g) => [
      pdfSafeText(g.label), `${g.yearsToTarget}`, formatCurrency(g.futureValueTarget),
      `${formatCurrency(g.requiredMonthlySIP)}/mo`, `${formatCurrency(g.allocatedSIP)}/mo`, g.affordable ? 'Fully Funded' : 'Underfunded',
    ]),
    aligns: ['left', 'right', 'right', 'right', 'right', 'right'],
    bold: [0, 2],
  });

  // Asset allocation + instruments
  y = ensureSpace(doc, y, 40);
  y = addStatCards(doc, y, [
    { label: 'Equity', value: `${overallAllocation.equity}%`, highlight: true },
    { label: 'Debt', value: `${overallAllocation.debt}%` },
    { label: 'Gold', value: `${overallAllocation.gold}%` },
    { label: 'REITs / Other', value: `${overallAllocation.reit}%`, small: true },
  ]);
  y = ensureSpace(doc, y, 45);
  y = addDataTable(doc, y, {
    heading: 'Illustrative Instruments',
    head: ['Instrument', 'Category', '% of Portfolio'],
    rows: instruments.map((i) => [i.name, i.category, `${i.percentOfTotal}%`]),
    aligns: ['left', 'left', 'right'],
    bold: [2],
  });

  // Insurance gap
  y = ensureSpace(doc, y, 60);
  y = addKeyValueTable(doc, y, 'Insurance Gap', [
    { label: 'Life Cover — Human Life Value Method', value: formatCurrency(lifeInsurance.humanLifeValue) },
    { label: 'Life Cover — Needs-Based Method', value: formatCurrency(lifeInsurance.needBasedCover) },
    { label: 'Recommended Life Cover', value: formatCurrency(lifeInsurance.recommendedCover) },
    { label: 'Existing Life Cover', value: formatCurrency(lifeInsurance.existingCover) },
    { label: 'Life Insurance Gap', value: formatCurrency(lifeInsurance.gap) },
    { label: 'Recommended Health Cover', value: formatCurrency(healthInsurance.recommendedCover) },
    { label: 'Existing Health Cover', value: formatCurrency(healthInsurance.existingCover) },
    { label: 'Health Insurance Gap', value: formatCurrency(healthInsurance.gap) },
  ]);

  // Tax efficiency — the STCG/LTCG post-tax estimate
  y = ensureSpace(doc, y, 50);
  y = addDataTable(doc, y, {
    heading: 'Tax Efficiency — Post-Tax Corpus by Goal (Estimate)',
    head: ['Goal', 'Pre-Tax Corpus', 'Est. Tax', 'Post-Tax Corpus', 'Eff. Rate'],
    rows: goalsTax.rows.map((r) => [
      pdfSafeText(r.label), formatCurrency(r.preTaxCorpus), formatCurrency(r.tax), formatCurrency(r.postTaxCorpus), `${r.effectiveTaxRate}%`,
    ]),
    aligns: ['left', 'right', 'right', 'right', 'right'],
    colors: { 2: BRAND.red, 3: BRAND.green },
    bold: [0, 3],
  });

  if (portfolioTax.rows.some((r) => r.estimated)) {
    y = ensureSpace(doc, y, 40);
    y = addKeyValueTable(doc, y, 'Existing Portfolio — Gains Estimate', [
      { label: 'Current Value', value: formatCurrency(portfolioTax.totals.currentValue) },
      { label: 'Gains So Far', value: formatCurrency(portfolioTax.totals.gains) },
      { label: 'If Redeemed Today (Post-Tax)', value: formatCurrency(portfolioTax.totals.postTaxValue) },
    ]);
  }

  // Year-by-year combined projection
  if (projection.projectionData.length) {
    y = ensureSpace(doc, y, 50);
    y = addDataTable(doc, y, {
      heading: 'Combined Wealth Projection (Existing Portfolio + Goal SIPs)',
      head: ['Year', 'Age', 'Total Invested', 'Projected Corpus', 'Wealth Gained'],
      rows: projection.projectionData.map((d) => [`Year ${d.year}`, `${d.age}`, formatCurrency(d.invested), formatCurrency(d.corpus), formatCurrency(d.gains)]),
      aligns: ['left', 'right', 'right', 'right', 'right'],
      colors: { 4: BRAND.green },
      bold: [0, 3],
    });
  }

  // Action plan
  y = ensureSpace(doc, y, 50);
  y = addDataTable(doc, y, {
    heading: 'Action Plan',
    head: ['Priority', 'Action', 'Details'],
    rows: actions.map((a) => [a.priority.charAt(0).toUpperCase() + a.priority.slice(1), pdfSafeText(a.title), pdfSafeText(a.description)]),
    aligns: ['left', 'left', 'left'],
    bold: [1],
  });

  // Assumptions & disclaimer — deliberately the last section, and a table (like
  // every section above it), so its own didDrawPage stamps the final footer.
  y = ensureSpace(doc, y, 60);
  addKeyValueTable(doc, y, 'Key Assumptions & Disclaimer', [
    { label: 'Inflation Assumption', value: '6% p.a.' },
    { label: 'Risk Profile', value: (profile.riskProfile || 'moderate').replace(/^\w/, (c) => c.toUpperCase()) },
    { label: 'Illustrative Return Assumptions', value: 'Equity 12% · Debt 7.5% · Gold 8.5% · REIT 9% p.a.' },
    { label: 'Tax Basis', value: 'FY 2025-26 capital gains rules (estimate only, not tax advice)' },
    { label: 'Disclaimer', value: 'Educational estimate only, not investment, insurance or tax advice. Vitta is not SEBI-registered as an Investment Adviser or Research Analyst.' },
  ]);

  saveDoc(doc, 'Financial-Blueprint', forName);
}
