import { drugCostWritable } from '../../utils/forecastMath'

export function createCostsModule({ drugCatalog }) {
  // Legacy URL/query cost fields (bind to catalog)
  const amoldipine5mgCost = drugCostWritable(drugCatalog, 'amlodipine-5mg')
  const losartan50mgCost = drugCostWritable(drugCatalog, 'losartan-50mg')
  const hydrochlorothiazide25mgCost = drugCostWritable(drugCatalog, 'hctz-25mg')
  const telmisartan40mgCost = drugCostWritable(drugCatalog, 'telmisartan-40mg')

  return {
    amoldipine5mgCost,
    losartan50mgCost,
    hydrochlorothiazide25mgCost,
    telmisartan40mgCost,
  }
}

