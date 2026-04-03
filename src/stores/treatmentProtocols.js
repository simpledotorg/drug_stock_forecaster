/**
 * Treatment protocols — drug catalog and protocol definitions. Edit here to add drugs or protocols.
 */

/** Illustrative default cost per tablet (same currency units as the rest of the app). */
const DEFAULT_COST_PER_TABLET = {
    'amlodipine-5mg': 0.05,
    'losartan-50mg': 0.06,
    'hctz-25mg': 0.03,
    'telmisartan-40mg': 0.1,
    'atorvastatin-20mg': 0.12,
}

export function createInitialDrugCatalog() {
    return [
        { id: 'amlodipine-5mg', name: 'Amlodipine 5mg', costPerTablet: DEFAULT_COST_PER_TABLET['amlodipine-5mg'] },
        { id: 'losartan-50mg', name: 'Losartan 50mg', costPerTablet: DEFAULT_COST_PER_TABLET['losartan-50mg'] },
        { id: 'hctz-25mg', name: 'Hydrochlorothiazide 25mg', costPerTablet: DEFAULT_COST_PER_TABLET['hctz-25mg'] },
        { id: 'telmisartan-40mg', name: 'Telmisartan 40mg', costPerTablet: DEFAULT_COST_PER_TABLET['telmisartan-40mg'] },
        { id: 'atorvastatin-20mg', name: 'Atorvastatin 20mg', costPerTablet: DEFAULT_COST_PER_TABLET['atorvastatin-20mg'] },
    ]
}

export function createInitialProtocols() {
    return [
        {
            id: 'philippines-htn',
            name: 'Philippines (HTN)',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100 },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 40 },
                {
                    label: 'Amlodipine 5mg + Losartan 50mg',
                    drugIds: ['amlodipine-5mg', 'losartan-50mg'],
                    percentage: 25,
                },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5 },
            ],
        },
        {
            id: 'aalh',
            name: 'AALH',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100 },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 40 },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 25 },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5 },
            ],
        },
        {
            id: 'aath',
            name: 'AATH with Statin',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100 },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 40 },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 25 },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5 },
            ],
            otherDrugs: [
                { label: 'Atorvastatin 20mg', drugIds: ['atorvastatin-20mg'], percentage: 30 },
            ],
        },
        {
            id: 'alh',
            name: 'ALH',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100 },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 40 },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 25 },
            ],
        },
        {
            id: 'attah',
            name: 'ATTAH',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100 },
                { label: 'Telmisartan 40mg', drugIds: ['telmisartan-40mg'], percentage: 40 },
                { label: 'Telmisartan 40mg', drugIds: ['telmisartan-40mg'], percentage: 25 },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 12 },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5 },
            ],
        },
        {
            id: 'alalh',
            name: 'AL(AL)H',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100 },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 40 },
                {
                    label: 'Amlodipine 5mg + Losartan 50mg',
                    drugIds: ['amlodipine-5mg', 'losartan-50mg'],
                    percentage: 25,
                },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5 },
            ],
        },
        {
            id: 'aallh',
            name: 'AALLH',
            steps: [
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 100 },
                { label: 'Amlodipine 5mg', drugIds: ['amlodipine-5mg'], percentage: 50 },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 30 },
                { label: 'Losartan 50mg', drugIds: ['losartan-50mg'], percentage: 15 },
                { label: 'Hydrochlorothiazide 25mg', drugIds: ['hctz-25mg'], percentage: 5 },
            ],
        },
    ]
}
