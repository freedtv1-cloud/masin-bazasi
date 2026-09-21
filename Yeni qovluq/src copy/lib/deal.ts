// Elanın qiyməti bazar ortalamasından xeyli aşağıdırsa "Sərfəli təklif" hesab
// olunur. Hədd 10% — sadə, izah oluna bilən qayda.
const GOOD_DEAL_THRESHOLD = 0.9;

export function isGoodDeal(price: number, avgMarketPrice: number | null | undefined): boolean {
  if (!avgMarketPrice) return false;
  return price <= avgMarketPrice * GOOD_DEAL_THRESHOLD;
}
