import { formAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'
import SpyFamilyMemberFormCard from './SpyFamilyMemberFormCard'

@fake.login()
export default class FamilyMemberFormCardTest extends AbstractEightBitTest {
    private static vc: SpyFamilyMemberFormCard

    private static readonly defailtAddingTitle = 'Add Family Member!'

    protected static async beforeEach() {
        await super.beforeEach()

        this.views.setController(
            'eightbitstories.family-member-form-card',
            SpyFamilyMemberFormCard
        )
        this.vc = this.views.Controller(
            'eightbitstories.family-member-form-card',
            {}
        ) as SpyFamilyMemberFormCard
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
    protected static async headerTitleUpdatesWhyTyping() {
        this.assertHeaderTitleEquals(this.defailtAddingTitle)
        await this.setName('Hello')
        this.assertHeaderTitleEquals('Add Hello!')
        await this.setName('There')
        this.assertHeaderTitleEquals('Add There!')
        await this.setName('')
        this.assertHeaderTitleEquals(this.defailtAddingTitle)
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
}
