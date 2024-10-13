import {
    AbstractViewController,
    ViewControllerOptions,
    Card,
    CardViewController,
    buildForm,
    FormViewController,
} from '@sprucelabs/heartwood-view-controllers'
import familyMemberSchema from '#spruce/schemas/eightbitstories/v2024_09_19/familyMember.schema'
import { FamilyMemberSchema } from '../eightbitstories.types'

export default class FamilyMemberFormCardViewController extends AbstractViewController<Card> {
    public static id = 'family-member-form-card'
    private cardVc: CardViewController

    protected formVc: FormViewController<FamilyMemberSchema>

    public constructor(options: ViewControllerOptions) {
        super(options)

        this.formVc = this.FormVc()
        this.cardVc = this.CardVc()
    }

    private CardVc(): CardViewController {
        return this.Controller('card', {
            header: {
                title: 'Add Family Member!',
            },
            body: {
                sections: [
                    {
                        form: this.formVc.render(),
                    },
                ],
            },
        })
    }

    private FormVc() {
        return this.Controller(
            'form',
            buildForm({
                schema: familyMemberSchema,
                sections: [
                    {
                        fields: ['name', { name: 'bio', renderAs: 'textarea' }],
                    },
                ],
            })
        )
    }

    public render() {
        return this.cardVc.render()
    }
}
