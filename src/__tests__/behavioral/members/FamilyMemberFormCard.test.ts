import { formAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'
import SpyFamilyMemberFormCard from './SpyFamilyMemberFormCard'

@fake.login()
export default class FamilyMemberFormCardTest extends AbstractEightBitTest {
    private static vc: SpyFamilyMemberFormCard

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
    protected static async headerTitleUpdatesWhyTyping() {}

    private static get formVc() {
        return this.vc.getFormVc()
    }
}
