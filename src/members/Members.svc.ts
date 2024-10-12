import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
    CardViewController,
    SkillViewControllerLoadOptions,
    Router,
    ListViewController,
    ListRow,
} from '@sprucelabs/heartwood-view-controllers'

export default class MembersSkillViewController extends AbstractSkillViewController {
    public static id = 'members'

    protected cardVc: CardViewController
    protected listVc: ListViewController

    private router?: Router

    public constructor(options: ViewControllerOptions) {
        super(options)

        this.listVc = this.ListVc()
        this.cardVc = this.CardVc()
    }

    private CardVc(): CardViewController {
        return this.Controller('card', {
            header: {
                title: 'Family Members',
            },
            body: {
                sections: [
                    {
                        list: this.listVc.render(),
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
    }

    private ListVc(): ListViewController {
        return this.Controller('list', {
            rows: [],
        })
    }

    private renderNoResultsRow(): ListRow {
        return {
            id: 'no-results',
            cells: [
                {
                    text: {
                        content: `You have not created any family members! Do that now! 👇`,
                    },
                },
            ],
        }
    }

    private async handleClickDone() {
        await this.router?.redirect('eightbitstories.root')
    }

    public async load(options: SkillViewControllerLoadOptions) {
        const { router } = options
        this.router = router

        const client = await this.connectToApi()
        const [{ familyMembers }] = await client.emitAndFlattenResponses(
            'eightbitstories.list-family-members::v2024_09_19'
        )

        if (familyMembers.length === 0) {
            this.listVc.addRow(this.renderNoResultsRow())
            return
        }

        for (const member of familyMembers) {
            this.listVc.addRow({ id: member.id, cells: [] })
        }
    }

    public render(): SkillView {
        return {
            layouts: [
                {
                    cards: [this.cardVc.render()],
                },
            ],
        }
    }
}
