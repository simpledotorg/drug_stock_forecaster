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
    ]
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
    for (const line of [...(protocol.steps ?? []), ...(protocol.otherDrugs ?? [])]) {
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
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5, fullRegimen: 'Amlodipine 10mg + Lisinopril 20mg + Hydrochlorothiazide 25mg' },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 1, fullRegimen: 'Amlodipine 10mg + Lisinopril 20mg + Hydrochlorothiazide 50mg' },
            ],
            // otherDrugs: [
            //     { label: 'Atorvastatin 10mg', drugIds: ['atorvastatin-10mg'], percentage: 30 },
            // ],
            defaultCosts: {
                'amlodipine-5mg': 120,
                'amlodipine-10mg': 180,
                'lisinopril-10mg': 350,
                'hctz-25mg': 370,
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
