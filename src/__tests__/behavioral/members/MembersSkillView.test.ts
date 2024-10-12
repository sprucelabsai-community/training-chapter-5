import {
    buttonAssert,
    interactor,
    listAssert,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test } from '@sprucelabs/test-utils'
import MembersSkillViewController from '../../../members/Members.svc'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class MembersSkillViewTest extends AbstractEightBitTest {
    private static vc: SpyMembersSkillView

    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()

        this.views.setController('eightbitstories.members', SpyMembersSkillView)
        this.vc = this.views.Controller(
            'eightbitstories.members',
            {}
        ) as SpyMembersSkillView
    }

    @test()
    protected static rendersCard() {
        vcAssert.assertSkillViewRendersCard(this.vc)
    }

    @test()
    protected static cardRendersExpectedButtons() {
        buttonAssert.cardRendersButtons(this.cardVc, ['done', 'add'])
    }

    @test()
    protected static rendersMembersList() {
        listAssert.cardRendersList(this.cardVc)
    }

    @test()
    protected static async doneButtonRedirectsToRoot() {
        await this.views.load(this.vc)

        await vcAssert.assertActionRedirects({
            action: () => interactor.clickButton(this.cardVc, 'done'),
            router: this.views.getRouter(),
            destination: {
                id: 'eightbitstories.root',
            },
        })
    }

    private static get cardVc() {
        return this.vc.getCardVc()
    }
}

class SpyMembersSkillView extends MembersSkillViewController {
    public getCardVc() {
        return this.cardVc
    }
}
