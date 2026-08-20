/**
 * Treatment protocols — drug catalog and protocol definitions. Edit here to add drugs or protocols.
 *
 * Optional per-protocol tablet prices: add `defaultCosts` on a protocol (keys = drug catalog ids).
 * Those values seed the cost fields when the protocol is selected. Omit the map, or omit a drug,
 * to keep using DEFAULT_COST_PER_TABLET. Example:
 *
 *   defaultCosts: {
 *     'amlodipine-5mg': 0.12,
 *     'losartan-50mg': 0.08,
 *   },
 *
 * Optional per-protocol currency: add `defaultCurrency` to seed the currency field when the
 * protocol is selected. `position` is `'before'` (symbol then number) or `'after'`
 * (`'start'` / `'end'` also work). Omit the object to keep $ before the number.
 *
 *   defaultCurrency: {
 *     symbol: 'Rp',
 *     position: 'before',
 *   },
 *
 * Optional statin (toggle): if the protocol has no statin in `steps` / `otherDrugs`, the form
 * shows Include statin. Override the injected drug with `optionalStatin` (same shape as an
 * otherDrugs line). Omit it to keep Atorvastatin 20mg. Do not put that drug in `otherDrugs`
 * or the toggle is hidden.
 *
 *   optionalStatin: {
 *     label: 'Simvastatin 20mg',
 *     drugIds: ['simvastatin-20mg'],
 *     percentage: 30,
 *   },
 */

/** Illustrative default cost per tablet (same currency units as the rest of the app). */
const DEFAULT_COST_PER_TABLET = {
    'amlodipine-5mg': 0.5,
    'amlodipine-10mg': 0.6,
    'lisinopril-10mg': 0.3,
    'losartan-50mg': 0.2,
    'telmisartan-40mg': 0.5,    
    'valsartan-80mg-amlodipine-5mg-spc': 0.4,
    'valsartan-160mg-amlodipine-10mg-spc': 0.6,
    'chlorthalidone-12.5mg': 0.4,
    'atorvastatin-10mg': 0.8,
    'atorvastatin-20mg': 0.5,
    'hctz-25mg': 0.3,
    'atorvastatin-10mg': 0.8,
    'atorvastatin-20mg': 0.9,
    'simvastatin-10mg': 0.5,
}

export function createInitialDrugCatalog() {
    return [
        // Hypertension
        { id: 'amlodipine-5mg', name: 'Amlodipine 5mg', costPerTablet: DEFAULT_COST_PER_TABLET['amlodipine-5mg'] },
        { id: 'amlodipine-10mg', name: 'Amlodipine 10mg', costPerTablet: DEFAULT_COST_PER_TABLET['amlodipine-10mg'] },
        { id: 'lisinopril-10mg', name: 'Lisinopril 10mg', costPerTablet: DEFAULT_COST_PER_TABLET['lisinopril-10mg'] },
        { id: 'losartan-50mg', name: 'Losartan 50mg', costPerTablet: DEFAULT_COST_PER_TABLET['losartan-50mg'] },
        { id: 'hctz-25mg', name: 'Hydrochlorothiazide 25mg', costPerTablet: DEFAULT_COST_PER_TABLET['hctz-25mg'] },
        { id: 'telmisartan-40mg', name: 'Telmisartan 40mg', costPerTablet: DEFAULT_COST_PER_TABLET['telmisartan-40mg'] },
        { id: 'valsartan-80mg-amlodipine-5mg-spc', name: 'Valsartan 80mg & Amlodipine 5mg SPC', costPerTablet: DEFAULT_COST_PER_TABLET['valsartan-80mg-amlodipine-5mg-spc'] },
        { id: 'valsartan-160mg-amlodipine-10mg-spc', name: 'Valsartan 160mg & Amlodipine 10mg SPC', costPerTablet: DEFAULT_COST_PER_TABLET['valsartan-160mg-amlodipine-10mg-spc'] },
        { id: 'chlorthalidone-12.5mg', name: 'Chlorthalidone 12.5mg', costPerTablet: DEFAULT_COST_PER_TABLET['chlorthalidone-12.5mg'] },
        // Statins
        { id: 'atorvastatin-10mg', name: 'Atorvastatin 10mg', costPerTablet: DEFAULT_COST_PER_TABLET['atorvastatin-10mg'] },
        { id: 'atorvastatin-20mg', name: 'Atorvastatin 20mg', costPerTablet: DEFAULT_COST_PER_TABLET['atorvastatin-20mg'] },
        { id: 'simvastatin-10mg', name: 'Simvastatin 10mg', costPerTablet: DEFAULT_COST_PER_TABLET['simvastatin-10mg'] },
    ]
}

/** Injected when Include statin is on and the protocol does not already list a statin. */
export const DEFAULT_OPTIONAL_STATIN = {
    label: 'Atorvastatin 20mg',
    drugIds: ['atorvastatin-20mg'],
    percentage: 30,
}

export function resolveOptionalStatinLine(protocol) {
    const override = protocol?.optionalStatin
    if (!override?.drugIds?.length) {
        return {
            label: DEFAULT_OPTIONAL_STATIN.label,
            drugIds: [...DEFAULT_OPTIONAL_STATIN.drugIds],
            percentage: DEFAULT_OPTIONAL_STATIN.percentage,
        }
    }
    const pct = override.percentage
    return {
        label: override.label || DEFAULT_OPTIONAL_STATIN.label,
        drugIds: [...override.drugIds],
        percentage: typeof pct === 'number' && Number.isFinite(pct) ? pct : DEFAULT_OPTIONAL_STATIN.percentage,
    }
}

const DEFAULT_CURRENCY_SYMBOL = '$'
const DEFAULT_CURRENCY_POSITION = 'start'

function normalizeCurrencyPosition(position) {
    if (position === 'end' || position === 'after') return 'end'
    if (position === 'start' || position === 'before') return 'start'
    return DEFAULT_CURRENCY_POSITION
}

/** App default, or protocol `defaultCurrency` when that protocol defines one. */
export function resolveDefaultCurrency(protocol) {
    const raw = protocol?.defaultCurrency
    if (!raw || typeof raw !== 'object') {
        return { symbol: DEFAULT_CURRENCY_SYMBOL, position: DEFAULT_CURRENCY_POSITION }
    }
    const symbol = typeof raw.symbol === 'string' ? raw.symbol : DEFAULT_CURRENCY_SYMBOL
    return {
        symbol,
        position: normalizeCurrencyPosition(raw.position),
    }
}

/** Seed the currency field from this protocol (falls back to $ before the number). */
export function applyProtocolDefaultCurrency(protocol, currencySymbolRef, currencyPositionRef) {
    if (!currencySymbolRef || !currencyPositionRef) return
    const { symbol, position } = resolveDefaultCurrency(protocol)
    currencySymbolRef.value = symbol
    currencyPositionRef.value = position
}

/** Catalog fallback, or protocol `defaultCosts[drugId]` when that protocol defines one. */
export function resolveDefaultCostPerTablet(drugId, protocol) {
    const fromProtocol = protocol?.defaultCosts?.[drugId]
    if (typeof fromProtocol === 'number' && Number.isFinite(fromProtocol)) return fromProtocol
    const fromGlobal = DEFAULT_COST_PER_TABLET[drugId]
    return typeof fromGlobal === 'number' && Number.isFinite(fromGlobal) ? fromGlobal : undefined
}

/** Seed catalog `costPerTablet` for drugs used by this protocol. */
export function applyProtocolDefaultCosts(protocol, drugCatalog) {
    if (!protocol || !Array.isArray(drugCatalog)) return
    const ids = new Set()
    const lines = [
        ...(protocol.steps ?? []),
        ...(protocol.otherDrugs ?? []),
        resolveOptionalStatinLine(protocol),
    ]
    for (const line of lines) {
        for (const id of line?.drugIds ?? []) ids.add(id)
    }
    for (const id of ids) {
        const drug = drugCatalog.find((d) => d.id === id)
        if (!drug) continue
        drug.costPerTablet = resolveDefaultCostPerTablet(id, protocol)
    }
}

export function createInitialProtocols() {
    return [
        // {
        //     id: 'aalh',
        //     name: 'AALH',
        //     steps: [
        //         { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100, fullRegimen: 'Amlodipine 5mg'   },
        //         { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 40, fullRegimen: 'Amlodipine 10mg'   },
        //         { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 25, fullRegimen: 'Amlodipine 10mg + Losartan 50mg' },
        //         { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5, fullRegimen: 'Amlodipine 10mg + Losartan 50mg + Hydrochlorothiazide 25mg' },
        //     ],
        // },
        // {
        //     id: 'alh',
        //     name: 'ALH',
        //     steps: [
        //         { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100, fullRegimen: 'Amlodipine 5mg' },
        //         { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 40, fullRegimen: 'Amlodipine 5mg + Losartan 50mg' },
        //         { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 25, fullRegimen: 'Amlodipine 5mg + Losartan 50mg + Hydrochlorothiazide 25mg' },
        //     ],
        // },
        // {
        //     id: 'attah',
        //     name: 'ATTAH',
        //     steps: [
        //         { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100, fullRegimen: 'Amlodipine 5mg'   },
        //         { label: 'Telmisartan 40mg', drugIds: ['telmisartan-40mg'], percentage: 40, fullRegimen: 'Amlodipine 5mg + Telmisartan 40mg' },
        //         { label: 'Telmisartan 40mg', drugIds: ['telmisartan-40mg'], percentage: 25, fullRegimen: 'Amlodipine 5mg + Telmisartan 80mg' },
        //         { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 12, fullRegimen: 'Amlodipine 10mg + Telmisartan 80mg' },
        //         { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5, fullRegimen: 'Amlodipine 10mg + Telmisartan 80mg + Hydrochlorothiazide 25mg' },
        //     ],
        // },
        // {
        //     id: 'alalh',
        //     name: 'AL(AL)H',
        //     steps: [
        //         { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100, fullRegimen: 'Amlodipine 5mg' },
        //         { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 40, fullRegimen: 'Amlodipine 5mg + Losartan 50mg' },
        //         {
        //             label: 'Amlodipine 5mg + Losartan 50mg',
        //             drugIds: ['amlodipine-5mg', 'losartan-50mg'],
        //             percentage: 25,
        //             fullRegimen: 'Amlodipine 10mg + Losartan 100mg' },
        //         { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5,
        //             fullRegimen: 'Amlodipine 10mg + Losartan 100mg + Hydrochlorothiazide 25mg' },
        //     ],
        // },
        // {
        //     id: 'aallh',
        //     name: 'AALLH',
        //     steps: [
        //         { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100, fullRegimen: 'Amlodipine 5mg' },
        //         { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 50, fullRegimen: 'Amlodipine 10mg' },
        //         { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 30, fullRegimen: 'Amlodipine 10mg + Losartan 50mg' },
        //         { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 15, fullRegimen: 'Amlodipine 10mg + Losartan 100mg' },
        //         { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5, fullRegimen: 'Amlodipine 10mg + Losartan 100mg + Hydrochlorothiazide 25mg' },
        //     ],
        // },
        // New protocols
        {
            id: 'bangladesh-aallh',
            name: 'Bangladesh • AALLH',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 50, fullRegimen: 'Amlodipine 5mg' },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-10mg'], percentage: 50, fullRegimen: 'Amlodipine 10mg' },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 30, fullRegimen: 'Amlodipine 10mg + Losartan 50mg' },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 15, fullRegimen: 'Amlodipine 10mg + Losartan 100mg' },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5, fullRegimen: 'Amlodipine 10mg + Losartan 100mg + Hydrochlorothiazide 25mg' },
            ],
            otherDrugs: [
                { label: 'Atorvastatin 20mg', drugIds: ['atorvastatin-20mg'], percentage: 30 },
            ],
        },
        {
            id: 'egypt-2026',
            name: 'Egypt • (VA)(VA)HH',
            steps: [
                { label: 'Valsartan 80mg + Amlodipine 5mg SPC', drugIds: ['valsartan-80mg-amlodipine-5mg-spc'], percentage: 60, fullRegimen: 'Valsartan 80mg & Amlodipine 5mg SPC' },
                { label: 'Valsartan 80mg + Amlodipine 5mg SPC', drugIds: ['valsartan-160mg-amlodipine-10mg-spc'], percentage: 40, fullRegimen: 'Valsartan 160mg & Amlodipine 10mg SPC' },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5, fullRegimen: 'Valsartan 160mg & Amlodipine 10mg SPC + Hydrochlorothiazide 25mg' },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 1, fullRegimen: 'Valsartan 160mg & Amlodipine 10mg SPC + Hydrochlorothiazide 50mg' },
            ],
            otherDrugs: [
                { label: 'Atorvastatin 20mg', drugIds: ['atorvastatin-20mg'], percentage: 30 },
            ],
        },
        {
            id: 'ethiopia-aalh-statin',
            name: 'Ethiopia • AALH + Statin',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 60, fullRegimen: 'Amlodipine 5mg'   },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-10mg'], percentage: 40, fullRegimen: 'Amlodipine 10mg'   },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 25, fullRegimen: 'Amlodipine 10mg + Losartan 50mg' },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5, fullRegimen: 'Amlodipine 10mg + Losartan 50mg + Hydrochlorothiazide 25mg' },
            ],
            otherDrugs: [
                { label: 'Atorvastatin 20mg', drugIds: ['atorvastatin-20mg'], percentage: 30 },
            ],
        },
        {
            id: 'india-aatth',
            name: 'India • AATTH',
            group: 'India',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100, fullRegimen: 'Amlodipine 5mg' },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 40, fullRegimen: 'Amlodipine 10mg' },
                { label: 'Telmisartan 40mg', drugIds: ['telmisartan-40mg'], percentage: 25, fullRegimen: 'Amlodipine 10mg + Telmisartan 40mg' },
                { label: 'Telmisartan 40mg', drugIds: ['telmisartan-40mg'], percentage: 12, fullRegimen: 'Amlodipine 10mg + Telmisartan 80mg' },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5, fullRegimen: 'Amlodipine 10mg + Telmisartan 80mg + Hydrochlorothiazide 25mg' },
            ],
        },
        {
            id: 'india-attah',
            name: 'India • ATTAH',
            group: 'India',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100, fullRegimen: 'Amlodipine 5mg' },
                { label: 'Telmisartan 40mg', drugIds: ['telmisartan-40mg'], percentage: 40, fullRegimen: 'Amlodipine 5mg + Telmisartan 40mg' },
                { label: 'Telmisartan 40mg', drugIds: ['telmisartan-40mg'], percentage: 25, fullRegimen: 'Amlodipine 5mg + Telmisartan 80mg' },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 12, fullRegimen: 'Amlodipine 10mg + Telmisartan 80mg' },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5, fullRegimen: 'Amlodipine 10mg + Telmisartan 80mg + Hydrochlorothiazide 25mg' },
            ],
        },
        {
            id: 'india-mp-atac',
            name: 'India MP • ATAC',
            group: 'India',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100, fullRegimen: 'Amlodipine 5mg'   },
                { label: 'Telmisartan 40mg', drugIds: ['telmisartan-40mg'], percentage: 40, fullRegimen: 'Amlodipine 5mg + Telmisartan 40mg' },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 25, fullRegimen: 'Amlodipine 10mg + Telmisartan 40mg'   },
                { label: 'Chlorthalidone 12.5mg', drugIds: ['chlorthalidone-12.5mg'], percentage: 5, fullRegimen: 'Amlodipine 10mg + Telmisartan 40mg + Chlorthalidone 12.5mg' },
            ],
            otherDrugs: [
                { label: 'Atorvastatin 10mg', drugIds: ['atorvastatin-10mg'], percentage: 30 },
            ],
        },
        {
            id: 'india-up-ath',
            name: 'India UP • ATH',
            group: 'India',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100, fullRegimen: 'Amlodipine 5mg'   },
                { label: 'Telmisartan 40mg', drugIds: ['telmisartan-40mg'], percentage: 40, fullRegimen: 'Amlodipine 5mg + Telmisartan 40mg' },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 10, fullRegimen: 'Amlodipine 5mg + Telmisartan 40mg + Hydrochlorothiazide 25mg' },
            ],
            otherDrugs: [
                { label: 'Atorvastatin 20mg', drugIds: ['atorvastatin-20mg'], percentage: 30 },
            ],
        },
        {
            id: 'indonesia-aallhh',
            name: 'Indonesia • AALiLiHH',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 40, fullRegimen: 'Amlodipine 5mg'   },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-10mg'], percentage: 60, fullRegimen: 'Amlodipine 10mg'   },
                { label: 'Lisinopril 10mg', drugIds: ['lisinopril-10mg'], percentage: 30, fullRegimen: 'Amlodipine 10mg + Lisinopril 10mg' },
                { label: 'Lisinopril 10mg', drugIds: ['lisinopril-10mg'], percentage: 10, fullRegimen: 'Amlodipine 10mg + Lisinopril 20mg' },
                { label: 'HCTZ 25mg', drugIds: ['hctz-25mg'], percentage: 5, fullRegimen: 'Amlodipine 10mg + Lisinopril 20mg + Hydrochlorothiazide 25mg' },
                { label: 'HCTZ 25mg', drugIds: ['hctz-25mg'], percentage: 1, fullRegimen: 'Amlodipine 10mg + Lisinopril 20mg + Hydrochlorothiazide 50mg' },
            ],
            // Keep statin off `otherDrugs` so the Include statin toggle stays available.
            optionalStatin: {
                label: 'Simvastatin 10mg',
                drugIds: ['simvastatin-10mg'],
                percentage: 30,
            },
            defaultCurrency: {
                symbol: 'Rp',
                position: 'before',
            },
            defaultCosts: {
                'amlodipine-5mg': 80,
                'amlodipine-10mg': 130,
                'lisinopril-10mg': 270,
                'hctz-25mg': 145,
                'simvastatin-10mg': 160,
            },
        },
        {
            id: 'nigeria-alalh',
            name: 'Nigeria • AL(AL)H',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100, fullRegimen: 'Amlodipine 5mg' },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 40, fullRegimen: 'Amlodipine 5mg + Losartan 50mg' },
                {
                    label: 'Amlodipine 5mg + Losartan 50mg',
                    drugIds: ['amlodipine-5mg', 'losartan-50mg'],
                    percentage: 25,
                    fullRegimen: 'Amlodipine 10mg + Losartan 100mg' },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5,
                    fullRegimen: 'Amlodipine 10mg + Losartan 100mg + Hydrochlorothiazide 25mg' },
            ],
        },
        {
            id: 'philippines-alalh',
            name: 'Philippines • AL(AL)H',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100, fullRegimen: 'Amlodipine 5mg' },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 40, fullRegimen: 'Amoldipine 5mg + Losartan 50mg' },
                {
                    label: 'Amlodipine 5mg + Losartan 50mg',
                    drugIds: ['amlodipine-5mg', 'losartan-50mg'],
                    percentage: 25,
                    fullRegimen: 'Amoldipine 10mg + Losartan 100mg',
                },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5, fullRegimen: 'Amoldipine 10mg + Losartan 100mg + Hydrochlorothiazide 25mg' },
            ],
        },
        {
            id: 'rwanda-aalilihh',
            name: 'Rwanda • AALiLiH',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100, fullRegimen: 'Amlodipine 5mg'   },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 60, fullRegimen: 'Amlodipine 10mg'   },
                { label: 'Lisinopril 10mg', drugIds: ['lisinopril-10mg'], percentage: 25, fullRegimen: 'Amlodipine 10mg + Lisinopril 10mg' },
                { label: 'Lisinopril 10mg', drugIds: ['lisinopril-10mg'], percentage: 12, fullRegimen: 'Amlodipine 10mg + Lisinopril 20mg' },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5, fullRegimen: 'Amlodipine 10mg + Lisinopril 20mg + Hydrochlorothiazide 25mg' },
            ],
            // otherDrugs: [
            //     { label: 'Atorvastatin 10mg', drugIds: ['atorvastatin-10mg'], percentage: 30 },
            // ],
        },
        {
            id: 'uganda-aallh',
            name: 'Uganda • AALLH',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100, fullRegimen: 'Amlodipine 5mg'   },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 50, fullRegimen: 'Amlodipine 10mg'   },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 30, fullRegimen: 'Amlodipine 10mg + Losartan 50mg' },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 15, fullRegimen: 'Amlodipine 10mg + Losartan 100mg' },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5, fullRegimen: 'Amlodipine 10mg + Losartan 100mg + Hydrochlorothiazide 25mg' },
            ],
        },
        {
            id: 'test-aath',
            name: 'Test • AATH with Statin',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100, fullRegimen: 'Amlodipine 5mg' },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 40, fullRegimen: 'Amlodipine 10mg'   },
                { label: 'Telmisartan 40mg', drugIds: ['telmisartan-40mg'], percentage: 25, fullRegimen: 'Amlodipine 10mg + Telmisartan 40mg' },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5, fullRegimen: 'Amlodipine 10mg + Telmisartan 40mg + Hydrochlorothiazide 25mg' },
            ],
            otherDrugs: [
                { label: 'Atorvastatin 20mg', drugIds: ['atorvastatin-20mg'], percentage: 30 },
            ],
        },
    ]
}
