import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
    CardViewController,
    SkillViewControllerLoadOptions,
    Router,
    ListViewController,
} from '@sprucelabs/heartwood-view-controllers'

export default class MembersSkillViewController extends AbstractSkillViewController {
    public static id = 'members'
    protected cardVc: CardViewController
    private router?: Router
    private listVc: ListViewController

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
        return this.Controller('list', {})
    }

    private async handleClickDone() {
        await this.router?.redirect('eightbitstories.root')
    }

    public async load(options: SkillViewControllerLoadOptions) {
        const { router } = options
        this.router = router
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
