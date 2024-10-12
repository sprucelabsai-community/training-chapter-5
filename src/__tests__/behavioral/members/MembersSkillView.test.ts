import {
    buttonAssert,
    interactor,
    listAssert,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { assert, test } from '@sprucelabs/test-utils'
import { ListFamilyMember } from '../../../eightbitstories.types'
import MembersSkillViewController from '../../../members/Members.svc'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'

@fake.login()
export default class MembersSkillViewTest extends AbstractEightBitTest {
    private static vc: SpyMembersSkillView
    private static fakedFamilyMembers: ListFamilyMember[]

    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()

        this.fakedFamilyMembers = []

        await this.eventFaker.fakeListFamilyMembers(
            () => this.fakedFamilyMembers
        )

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
        await this.load()

        await vcAssert.assertActionRedirects({
            action: () => interactor.clickButton(this.cardVc, 'done'),
            router: this.views.getRouter(),
            destination: {
                id: 'eightbitstories.root',
            },
        })
    }

    @test()
    protected static async emitsListFamilyMembersOnLoad() {
        let wasHit = false

        await this.eventFaker.fakeListFamilyMembers(() => {
            wasHit = true
        })

        await this.load()

        assert.isTrue(
            wasHit,
            `You did not emit the list family members event on load`
        )
    }

    @test()
    protected static async rendersNoResultsRowIfNoFamilyMembers() {
        this.assertDoesNotRenderNoResultsRow()
        await this.load()
        this.assertListRendersRow('no-results')
    }

    @test()
    protected static async doesNotRenderNoResultsRowIfReturnsFamilyMember() {
        this.seedFamilyMember()
        await this.load()
        this.assertDoesNotRenderNoResultsRow()
    }

    @test()
    protected static async rendersRowForFamilyMember() {
        const familyMember = this.seedFamilyMember()
        await this.load()
        this.assertListRendersRow(familyMember.id)
    }

    @test()
    protected static async rendersRowForEachFamilyMember() {
        this.seedFamilyMember()
        this.seedFamilyMember()
        await this.load()
        this.assertListRendersRow(this.fakedFamilyMembers[1].id)
    }

    private static seedFamilyMember() {
        const familyMember = this.eventFaker.generateListFamilyMemberValues()
        this.fakedFamilyMembers.push(familyMember)
        return familyMember
    }

    private static assertListRendersRow(id: string) {
        listAssert.listRendersRow(this.listVc, id)
    }

    private static assertDoesNotRenderNoResultsRow() {
        listAssert.listDoesNotRenderRow(this.listVc, 'no-results')
    }

    private static get listVc() {
        return this.vc.getListVc()
    }

    private static async load() {
        await this.views.load(this.vc)
    }

    private static get cardVc() {
        return this.vc.getCardVc()
    }
}

class SpyMembersSkillView extends MembersSkillViewController {
    public getListVc() {
        return this.listVc
    }
    public getCardVc() {
        return this.cardVc
    }
}
