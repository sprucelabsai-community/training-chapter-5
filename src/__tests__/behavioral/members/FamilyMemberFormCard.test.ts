import { formAssert, vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { eventFaker, fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import { PublicFamilyMember } from '../../../eightbitstories.types'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'
import { CreateFamilyMemberTargetAndPayload } from '../../support/EventFaker'
import FakeFamilyMemberFormCard from './FakeFamilyMemberFormCard'

@fake.login()
export default class FamilyMemberFormCardTest extends AbstractEightBitTest {
    private static vc: FakeFamilyMemberFormCard

    private static readonly defailtAddingTitle = 'Add Family Member!'
    private static wasOnSubmitHandlerInvoked: boolean
    private static fakedFamilyMember?: PublicFamilyMember

    protected static async beforeEach() {
        await super.beforeEach()

        delete this.fakedFamilyMember
        this.wasOnSubmitHandlerInvoked = false

        this.views.setController(
            'eightbitstories.family-member-form-card',
            FakeFamilyMemberFormCard
        )
        this.vc = this.Vc()
    }

    @test()
    protected static async rendersForm() {
        formAssert.cardRendersForm(this.vc)
    }

    @test()
    protected static async rendersExpectedFields() {
        formAssert.formRendersFields(this.formVc, ['name', 'bio'])
    }

    @test()
    protected static async rendersBioFieldAsTextArea() {
        formAssert.formFieldRendersAs(this.formVc, 'bio', 'textarea')
    }

    @test()
    protected static async headerTitleUpdatesWhileTyping() {
        this.assertHeaderTitleEquals(this.defailtAddingTitle)
        await this.setName('Hello')
        this.assertHeaderTitleEquals('Add Hello!')
        await this.setName('There')
        this.assertHeaderTitleEquals('Add There!')
        await this.setName('')
        this.assertHeaderTitleEquals(this.defailtAddingTitle)
    }

    @test()
    protected static async submittingFormEmitsAddFamilyMemberEvent() {
        let passedPayload:
            | CreateFamilyMemberTargetAndPayload['payload']
            | undefined

        await this.eventFaker.fakeCreateFamilyMember(({ payload }) => {
            passedPayload = payload
        })

        const values = await this.fillOutForm()

        await this.submit()

        assert.isEqualDeep(passedPayload, {
            familyMember: values,
        })
    }

    @test()
    protected static async rendersAlertIfCreateEventThrows() {
        await this.makeCreateEventThrow()
        await this.fillOutFormSubmitAndAssertRendersAlert()
        assert.isFalse(
            this.wasOnSubmitHandlerInvoked,
            `Invoked on submit handler and should not have!`
        )
    }

    @test()
    protected static async emitsGetFamilyMemberIfConstructedWithOne() {
        this.fakedFamilyMember =
            this.eventFaker.generatePublicFamilyMemberValues()
        this.vc = this.Vc()

        let wasHit = false
        await this.eventFaker.fakeGetFamilyMember(() => {
            wasHit = true
        })

        await this.vc.load()
        assert.isTrue(wasHit, `You gotta emit get-family-member on load!`)
    }

    private static async fillOutFormSubmitAndAssertRendersAlert() {
        await this.fillOutForm()
        await vcAssert.assertRendersAlert(this.vc, () => this.submit())
    }

    private static async makeCreateEventThrow() {
        await eventFaker.makeEventThrow(
            'eightbitstories.create-family-member::v2024_09_19'
        )
    }

    private static async submit() {
        await this.vc.submit()
    }

    private static async fillOutForm() {
        return this.vc.fillOutForm()
    }

    private static async setName(value: string) {
        await this.formVc.setValue('name', value)
    }

    private static assertHeaderTitleEquals(expected: string) {
        const { header } = this.views.render(this.vc)
        assert.isEqual(
            header?.title,
            expected,
            `Title header does not equal what I expected!`
        )
    }

    private static get formVc() {
        return this.vc.getFormVc()
    }

    private static Vc(): FakeFamilyMemberFormCard {
        return this.views.Controller(
            'eightbitstories.family-member-form-card',
            {
                familyMember: this.fakedFamilyMember,
                onSubmit: () => {
                    this.wasOnSubmitHandlerInvoked = true
                },
            }
        ) as FakeFamilyMemberFormCard
    }
}
