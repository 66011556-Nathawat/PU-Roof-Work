/**
 * Core business calculations for PU Roof Works
 * Grounded in industrial operational math from Track A (Sales Forecast) & Track B (Stock Check & Quote)
 */

export interface ForecastResult {
  runRate: number;
  base: number;
  low: number;
  high: number;
  confidence: 'high' | 'medium' | 'too early, low confidence';
}

/**
 * Track A: Run rate calculation
 * sales_to_date / working_days_elapsed * working_days_in_month
 */
export function calculateRunRate(
  salesToDate: number,
  workingDaysElapsed: number,
  workingDaysInMonth: number
): number {
  if (workingDaysElapsed <= 0) return 0;
  if (salesToDate <= 0) return 0;
  return Math.round((salesToDate / workingDaysElapsed) * workingDaysInMonth);
}

/**
 * Track A: Seasonal Adjustment Index
 * Based on historical month average vs total average (December vs July peak in roof construction)
 */
export function calculateSeasonalIndex(
  monthNumber: number // 1-12
): number {
  // Typical construction & metal sheet roofing seasonal weights in Thailand:
  // Jan-May (Dry/Peak building): 1.10 - 1.18
  // Jun-Sep (Rainy season slowdown): 0.88 - 0.95
  // Oct-Dec (Post-rain rush & fiscal budget closing): 1.05 - 1.15
  const seasonalWeights: Record<number, number> = {
    1: 1.08,
    2: 1.12,
    3: 1.15,
    4: 0.95, // Songkran holiday period
    5: 1.05,
    6: 0.92,
    7: 0.90,
    8: 0.88,
    9: 0.94,
    10: 1.06,
    11: 1.14,
    12: 1.16,
  };
  return seasonalWeights[monthNumber] || 1.0;
}

/**
 * Track A: Forecast Range (Low, Base, High)
 * low = run rate * 0.91 (or lowest historical variance)
 * high = run rate * 1.09
 */
export function calculateForecastRange(
  salesToDate: number,
  workingDaysElapsed: number,
  workingDaysInMonth: number,
  monthNumber: number
): ForecastResult {
  if (workingDaysElapsed <= 0 || salesToDate <= 0) {
    return {
      runRate: 0,
      base: 0,
      low: 0,
      high: 0,
      confidence: workingDaysElapsed <= 3 ? 'too early, low confidence' : 'medium',
    };
  }

  const rawRunRate = (salesToDate / workingDaysElapsed) * workingDaysInMonth;
  const seasonIdx = calculateSeasonalIndex(monthNumber);
  const base = Math.round(rawRunRate * seasonIdx);

  // Confidence check: Less than 4 working days elapsed
  const confidence =
    workingDaysElapsed <= 3
      ? 'too early, low confidence'
      : workingDaysElapsed <= 8
      ? 'medium'
      : 'high';

  // Range band: wider if early in the month
  const varianceFactor = workingDaysElapsed <= 5 ? 0.14 : 0.08;
  const low = Math.round(base * (1 - varianceFactor));
  const high = Math.round(base * (1 + varianceFactor));

  return {
    runRate: Math.round(rawRunRate),
    base,
    low,
    high,
    confidence,
  };
}

/**
 * Hand-verified math test cases (Slide 49)
 * 1) 500,000 over 10 of 22 working days, index 1.0 -> base 1,100,000
 * 2) zero sales so far -> base 0, no crash
 * 3) 3 working days elapsed -> flag "too early, low confidence"
 */
export function runMathVerificationChecks(): {
  case1: boolean;
  case2: boolean;
  case3: boolean;
  allPassed: boolean;
} {
  const case1Rate = calculateRunRate(500000, 10, 22);
  const case1Pass = case1Rate === 1100000;

  const case2Result = calculateForecastRange(0, 10, 22, 5);
  const case2Pass = case2Result.base === 0;

  const case3Result = calculateForecastRange(150000, 3, 22, 5);
  const case3Pass = case3Result.confidence === 'too early, low confidence';

  return {
    case1: case1Pass,
    case2: case2Pass,
    case3: case3Pass,
    allPassed: case1Pass && case2Pass && case3Pass,
  };
}

/**
 * Track B: Days of cover
 * stock_qty / avg_daily_usage
 */
export function calculateDaysOfCover(stockQty: number, avgDailyUsage: number): number {
  if (avgDailyUsage <= 0) return 999;
  return Math.round((stockQty / avgDailyUsage) * 10) / 10;
}

/**
 * Track B: Reorder point
 * avg_daily_usage * lead_time_days + safety_stock
 */
export function calculateReorderPoint(
  avgDailyUsage: number,
  leadTimeDays: number,
  safetyStock: number
): number {
  return Math.ceil(avgDailyUsage * leadTimeDays + safetyStock);
}

/**
 * Track B: Order quantity
 * target_cover_days * avg_daily_usage - stock_qty
 */
export function calculateOrderQty(
  targetCoverDays: number,
  avgDailyUsage: number,
  stockQty: number
): number {
  const needed = Math.ceil(targetCoverDays * avgDailyUsage - stockQty);
  return Math.max(0, needed);
}

/**
 * Track B: Price Guardrail (Slide 31)
 * floor = total_cost * (1 + min_margin)
 * ceiling = market_reference * 1.10
 */
export function checkQuoteGuardrails(
  totalCost: number,
  offeredPrice: number,
  minMargin: number = 0.20, // 20% minimum gross margin floor
  marketReferencePrice: number = 0
): {
  floor: number;
  ceiling: number;
  status: 'below_floor' | 'healthy' | 'above_ceiling';
  warningMessage?: string;
} {
  const floor = Math.round(totalCost * (1 + minMargin));
  const ceiling = marketReferencePrice > 0 ? Math.round(marketReferencePrice * 1.15) : 0;

  if (offeredPrice < floor) {
    return {
      floor,
      ceiling,
      status: 'below_floor',
      warningMessage: `ราคาต่ำกว่าขั้นต่ำ (${floor.toLocaleString()} บาท) กำไรต่ำกว่า ${minMargin * 100}% มีความเสี่ยงขาดทุน`,
    };
  }

  if (ceiling > 0 && offeredPrice > ceiling) {
    return {
      floor,
      ceiling,
      status: 'above_ceiling',
      warningMessage: `ราคาสูงกว่าเพดานตลาด (${ceiling.toLocaleString()} บาท) อาจเสียเปรียบคู่แข่ง`,
    };
  }

  return {
    floor,
    ceiling,
    status: 'healthy',
  };
}

/**
 * Format Thai Baht currency
 */
export function formatTHB(amount: number, hideDecimals = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '฿0';
  return (
    '฿' +
    amount.toLocaleString('th-TH', {
      minimumFractionDigits: hideDecimals ? 0 : 2,
      maximumFractionDigits: hideDecimals ? 0 : 2,
    })
  );
}

/**
 * Format numbers with comma
 */
export function formatNumber(amount: number, decimals = 0): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0';
  return amount.toLocaleString('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
