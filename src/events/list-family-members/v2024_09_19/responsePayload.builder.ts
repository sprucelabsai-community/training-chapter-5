import { buildSchema, dropPrivateFields } from '@sprucelabs/schema'
import familyMemberBuilder from '../../../schemas/v2024_09_19/familyMember.builder'

const listFamilyMembersResponsePayloadBuilder = buildSchema({
    id: 'listFamilyMembersResponsePayload',
    fields: {
        familyMembers: {
            type: 'schema',
            isArray: true,
            isRequired: true,
            minArrayLength: 0,
            options: {
                schema: buildSchema({
                    id: 'listFamilyMember',
                    fields: {
                        ...dropPrivateFields(familyMemberBuilder.fields),
                    },
                }),
            },
        },
    },
})

export default listFamilyMembersResponsePayloadBuilder
