import {
    AbstractViewController,
    ViewControllerOptions,
    Card,
    CardViewController,
    buildForm,
    FormViewController,
} from '@sprucelabs/heartwood-view-controllers'
import publicFamilyMemberSchema from '#spruce/schemas/eightbitstories/v2024_09_19/publicFamilyMember.schema'
import {
    FamilyMemberSchema,
    PublicFamilyMember,
} from '../eightbitstories.types'

export default class FamilyMemberFormCardViewController extends AbstractViewController<Card> {
    public static id = 'family-member-form-card'

    private cardVc: CardViewController

    protected formVc: FormViewController<FamilyMemberSchema>
    private onCancelHandler?: OnCancelHandler
    private onSubmitHandler?: OnSubmitHandler
    private familyMember?: PublicFamilyMember

    public constructor(
        options: ViewControllerOptions & FamilyMemberFormCardOptions
    ) {
        super(options)

        const { onCancel, onSubmit, familyMember } = options

        this.onCancelHandler = onCancel
        this.onSubmitHandler = onSubmit
        this.familyMember = familyMember

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
                schema: publicFamilyMemberSchema,
                onCancel: this.handleCancel.bind(this),
                onChange: this.handleChangeForm.bind(this),
                onSubmit: this.handleSubmit.bind(this),
                sections: [
                    {
                        fields: ['name', { name: 'bio', renderAs: 'textarea' }],
                    },
                ],
            })
        )
    }

    private async handleSubmit() {
        try {
            const values = this.formVc.getValues()
            const client = await this.connectToApi()
            await client.emitAndFlattenResponses(
                'eightbitstories.create-family-member::v2024_09_19',
                {
                    payload: {
                        familyMember: values as PublicFamilyMember,
                    },
                }
            )
            await this.onSubmitHandler?.()
        } catch (err: any) {
            this.log.error(`failed to create family member`, err)
            await this.alert({
                message: err.message ?? 'Adding your family member failed!',
            })
        }
    }

    private async handleChangeForm() {
        const name = this.formVc.getValue('name')
        this.cardVc.setHeaderTitle(`Add ${name || 'Family Member'}!`)
    }

    private async handleCancel() {
        await this.onCancelHandler?.()
    }

    public async load() {
        const client = await this.connectToApi()
        await client.emitAndFlattenResponses(
            'eightbitstories.get-family-member::v2024_09_19',
            {
                target: {
                    familyMemberId: this.familyMember.id,
                },
            }
        )
    }

    public render() {
        return this.cardVc.render()
    }
}

type OnCancelHandler = () => void | Promise<void>
type OnSubmitHandler = () => void | Promise<void>

export interface FamilyMemberFormCardOptions {
    onCancel?: OnCancelHandler
    onSubmit?: OnSubmitHandler
    familyMember?: PublicFamilyMember
}
