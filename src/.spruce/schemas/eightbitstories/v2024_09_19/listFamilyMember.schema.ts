import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceSchemas } from '../../schemas.types'



const listFamilyMemberSchema: SpruceSchemas.Eightbitstories.v2024_09_19.ListFamilyMemberSchema  = {
	id: 'listFamilyMember',
	version: 'v2024_09_19',
	namespace: 'Eightbitstories',
	name: '',
	    fields: {
	            /** . */
	            'id': {
	                type: 'id',
	                isRequired: true,
	                options: undefined
	            },
	            /** Name. */
	            'name': {
	                label: 'Name',
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	            /** Bio. */
	            'bio': {
	                label: 'Bio',
	                type: 'text',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(listFamilyMemberSchema)

export default listFamilyMemberSchema
