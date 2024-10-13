import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
    SkillViewControllerLoadOptions,
    Router,
    buildActiveRecordCard,
    ActiveRecordCardViewController,
} from '@sprucelabs/heartwood-view-controllers'

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
                },
                rowTransformer: (familyMember) => ({
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
                    ],
                }),
                noResultsRow: {
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
