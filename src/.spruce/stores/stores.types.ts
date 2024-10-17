import FamilyMembersStore from '../../members/FamilyMembers.store'
import FamiliesStore from '../../family/Families.store'

declare module '@sprucelabs/data-stores/build/types/stores.types' {
	interface StoreMap {
                familyMembers: FamilyMembersStore
                families: FamiliesStore
	}

	interface StoreOptionsMap {
                familyMembers: Omit<Parameters<typeof FamilyMembersStore['Store']>[0], keyof UniversalStoreOptions>   
                families: Omit<Parameters<typeof FamiliesStore['Store']>[0], keyof UniversalStoreOptions>   
        }
}