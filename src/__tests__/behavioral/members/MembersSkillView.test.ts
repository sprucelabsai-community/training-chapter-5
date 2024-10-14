import {
    activeRecordCardAssert,
    buttonAssert,
    interactor,
    listAssert,
    MockActiveRecordCard,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { assert, test } from '@sprucelabs/test-utils'
import { PublicFamilyMember } from '../../../eightbitstories.types'
import MembersSkillViewController from '../../../members/Members.svc'
import FamilyMemberFormCardViewController from '../../../viewControllers/FamilyMemberFormCard.vc'
import AbstractEightBitTest from '../../support/AbstractEightBitTest'
import FakeFamilyMemberFormCard from './FakeFamilyMemberFormCard'

@fake.login()
export default class MembersSkillViewTest extends AbstractEightBitTest {
    private static vc: SpyMembersSkillView
    private static fakedFamilyMembers: PublicFamilyMember[]

    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()

        this.fakedFamilyMembers = []

        await this.eventFaker.fakeCreateFamilyMember()
        await this.eventFaker.fakeListFamilyMembers(
            () => this.fakedFamilyMembers
        )

        this.views.setController(
            'eightbitstories.family-member-form-card',
            FakeFamilyMemberFormCard
        )
        this.views.setController('active-record-card', MockActiveRecordCard)
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
        buttonAssert.cardRendersButtons(this.activeCardVc, ['done', 'add'])
    }

    @test()
    protected static rendersMembersList() {
        listAssert.cardRendersList(this.activeCardVc)
    }

    @test()
    protected static async doneButtonRedirectsToRoot() {
        await this.load()

        await vcAssert.assertActionRedirects({
            action: () => interactor.clickButton(this.activeCardVc, 'done'),
            router: this.views.getRouter(),
            destination: {
                id: 'eightbitstories.root',
            },
        })
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

    @test()
    protected static async cardRendersAsActiveRecordCard() {
        activeRecordCardAssert.rendersAsActiveRecordCard(this.activeCardVc)
    }

    @test()
    protected static async rendersDialogWhenClickingAdd() {
        await this.clickAddAndAssertDialog()
    }

    @test()
    protected static async cancellingFormInFamilyMemberFormCardHidesDialog() {
        const { dialogVc, familyMemberFormCardVc } =
            await this.clickAddAndAssertDialog()

        await interactor.cancelForm(familyMemberFormCardVc.getFormVc())
        assert.isFalse(
            dialogVc.getIsVisible(),
            'Cancelling the form did not hide the dialog'
        )
    }

    @test()
    protected static async submittingAddFamilyHidesDialog() {
        await this.load()
        const { dialogVc, familyMemberFormCardVc } =
            await this.clickAddAndAssertDialog()

        await familyMemberFormCardVc.fillOutFormAndSubmit()

        assert.isFalse(
            dialogVc.getIsVisible(),
            'Submitting form did not hide the dialog'
        )
    }

    @test()
    protected static async refreshesMembersAfterCreating() {
        await this.load()
        let wasHit = false
        await this.eventFaker.fakeListFamilyMembers(() => {
            wasHit = true
        })
        const { familyMemberFormCardVc } = await this.clickAddAndAssertDialog()

        assert.isFalse(wasHit, 'You refreshed too soon!')

        await familyMemberFormCardVc.fillOutFormAndSubmit()

        assert.isTrue(wasHit, 'Did not try and list family members')
    }

    @test()
    protected static async familyMemberRowRendersDeleteButton() {
        const member = await this.loadWithOneFamilyMember()
        this.activeCardVc.assertRowRendersButton(member.id, 'delete')
    }

    @test()
    protected static async clickingDeleteMemberRendersConfirm() {
        await this.loadWithOneFamilyMember()
        await this.clickDeleteMemberAndAssertConfirm()
    }

    @test()
    protected static async clickingDeleteEmitsDeleteFamilyMemberEvent() {
        let wasHit = false
        await this.eventFaker.fakeDeleteFamilyMember(() => {
            wasHit = true
        })

        await this.loadWithOneFamilyMember()
        const confirmVc = await this.clickDeleteMemberAndAssertConfirm()
        await confirmVc.accept()

        assert.isTrue(wasHit, `Did not emit delete family member event!`)
    }

    private static async clickDeleteMemberAndAssertConfirm() {
        return await vcAssert.assertRendersConfirm(this.vc, () =>
            interactor.clickButtonInRow(
                this.activeCardVc.getListVc(),
                0,
                'delete'
            )
        )
    }

    private static async loadWithOneFamilyMember() {
        const familyMember = this.seedFamilyMember()
        await this.load()
        return familyMember
    }

    private static async clickAddAndAssertDialog() {
        const dialogVc = await vcAssert.assertRendersDialog(this.vc, () =>
            interactor.clickButton(this.activeCardVc, 'add')
        )

        const familyMemberFormCardVc = vcAssert.assertRendersAsInstanceOf(
            dialogVc,
            FamilyMemberFormCardViewController
        ) as FakeFamilyMemberFormCard

        return {
            dialogVc,
            familyMemberFormCardVc,
        }
    }

    private static seedFamilyMember() {
        const familyMember = this.eventFaker.generatePublicFamilyMemberValues()
        this.fakedFamilyMembers.push(familyMember)
        return familyMember
    }

    private static assertListRendersRow(id: string) {
        this.activeCardVc.assertRendersRow(id)
    }

    private static assertDoesNotRenderNoResultsRow() {
        this.activeCardVc.assertDoesNotRenderRow('no-results')
    }

    private static async load() {
        await this.views.load(this.vc)
    }

    private static get activeCardVc() {
        return this.vc.getActiveCardVc()
    }
}

class SpyMembersSkillView extends MembersSkillViewController {
    public getActiveCardVc() {
        return this.activeCardVc as MockActiveRecordCard
    }
}
