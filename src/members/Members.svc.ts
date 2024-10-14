import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
    SkillViewControllerLoadOptions,
    Router,
    buildActiveRecordCard,
    ActiveRecordCardViewController,
    ListRow,
} from '@sprucelabs/heartwood-view-controllers'
import { PublicFamilyMember } from '../eightbitstories.types'

export default class MembersSkillViewController extends AbstractSkillViewController {
    public static id = 'members'

    private router?: Router
    protected activeCardVc: ActiveRecordCardViewController

    public constructor(options: ViewControllerOptions) {
        super(options)
        this.activeCardVc = this.ActiveRecordCard()
    }

    private ActiveRecordCard(): ActiveRecordCardViewController {
        return this.Controller(
            'active-record-card',
            buildActiveRecordCard({
                eventName: 'eightbitstories.list-family-members::v2024_09_19',
                responseKey: 'familyMembers',
                header: {
                    title: 'Family Members',
                    image: 'https://s3.amazonaws.com/storybook.sprucelabs.ai/members.jpg',
                },
                rowTransformer: this.renderRow.bind(this),
                columnWidths: ['fill'],
                noResultsRow: {
                    height: 'content',
                    cells: [
                        {
                            text: {
                                content: `You have not created any family members! Do that now! 👇`,
                            },
                        },
                    ],
                },
                footer: {
                    buttons: [
                        {
                            id: 'add',
                            label: 'Add Family Member',
                            onClick: this.handleClickAddMember.bind(this),
                        },
                        {
                            id: 'done',
                            label: 'Done',
                            type: 'primary',
                            onClick: this.handleClickDone.bind(this),
                        },
                    ],
                },
            })
        )
    }

    private renderRow(familyMember: PublicFamilyMember): ListRow {
        return {
            id: familyMember.id,
            cells: [
                {
                    text: {
                        content: familyMember.name,
                    },
                    subText: {
                        content: familyMember.bio,
                    },
                },
                {
                    button: {
                        id: 'delete',
                        lineIcon: 'user-delete',
                        type: 'destructive',
                        onClick: this.handleClickDelete.bind(
                            this,
                            familyMember
                        ),
                    },
                },
            ],
        }
    }

    private async handleClickDelete(member: PublicFamilyMember) {
        await this.confirm({
            isDestructive: true,
            message: `Are you sure you want to delete ${member.name}?`,
        })

        const client = await this.connectToApi()
        await client.emitAndFlattenResponses(
            'eightbitstories.delete-family-member::v2024_09_19'
        )
    }

    private async handleClickAddMember() {
        const vc = this.Controller('eightbitstories.family-member-form-card', {
            onCancel: async () => {
                await dialogVc.hide()
            },
            onSubmit: async () => {
                await dialogVc.hide()
                await this.activeCardVc.refresh()
            },
        })

        const dialogVc = this.renderInDialog(vc.render())
    }

    private async handleClickDone() {
        await this.router?.redirect('eightbitstories.root')
    }

    public async load(options: SkillViewControllerLoadOptions) {
        const { router } = options
        this.router = router

        await this.activeCardVc.load()
    }

    public render(): SkillView {
        return {
            layouts: [
                {
                    cards: [this.activeCardVc.render()],
                },
            ],
        }
    }
}
