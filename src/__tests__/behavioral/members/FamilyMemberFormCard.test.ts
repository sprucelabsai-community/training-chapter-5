import { formAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import FamilyMemberFormCardViewController from '../../../viewControllers/FamilyMemberFormCard.vc'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

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

    private static get formVc() {
        return this.vc.getFormVc()
    }
}

class SpyFamilyMemberFormCard extends FamilyMemberFormCardViewController {
    public getFormVc() {
        return this.formVc
    }
}
