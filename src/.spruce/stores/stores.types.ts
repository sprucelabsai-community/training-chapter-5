import FamiliesStore from '../../family/Families.store'

declare module '@sprucelabs/data-stores/build/types/stores.types' {
	interface StoreMap {
                families: FamiliesStore
	}

	interface StoreOptionsMap {
                families: Omit<Parameters<typeof FamiliesStore['Store']>[0], keyof UniversalStoreOptions>   
        }
}