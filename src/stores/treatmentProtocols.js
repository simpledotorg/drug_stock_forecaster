/**
 * Treatment protocols — drug catalog and protocol definitions. Edit here to add drugs or protocols.
 */

export function createInitialDrugCatalog() {
    return [
        { id: 'amlodipine-5mg', name: 'Amlodipine 5mg', costPerTablet: undefined },
        { id: 'losartan-50mg', name: 'Losartan 50mg', costPerTablet: undefined },
        { id: 'hctz-25mg', name: 'Hydrochlorothiazide 25mg', costPerTablet: undefined },
        { id: 'telmisartan-40mg', name: 'Telmisartan 40mg', costPerTablet: undefined },
        { id: 'atorvastatin-20mg', name: 'Atorvastatin 20mg', costPerTablet: undefined },
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
