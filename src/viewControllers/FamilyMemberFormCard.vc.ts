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
    private onCancelHandler?: OnCancelHandler

    public constructor(
        options: ViewControllerOptions & FamilyMemberFormCardOptions
    ) {
        super(options)

        const { onCancel } = options

        this.onCancelHandler = onCancel
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
                onCancel: this.handleCancel.bind(this),
                onChange: this.handleChangeForm.bind(this),
                sections: [
                    {
                        fields: ['name', { name: 'bio', renderAs: 'textarea' }],
                    },
                ],
            })
        )
    }

    private async handleChangeForm() {
        const name = this.formVc.getValue('name')
        this.cardVc.setHeaderTitle(`Add ${name || 'Family Member'}!`)
    }

    private async handleCancel() {
        await this.onCancelHandler?.()
    }

    public render() {
        return this.cardVc.render()
    }
}

type OnCancelHandler = () => void | Promise<void>

interface FamilyMemberFormCardOptions {
    onCancel?: OnCancelHandler
}
