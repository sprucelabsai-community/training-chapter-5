import { interactor } from '@sprucelabs/heartwood-view-controllers'
import { generateId } from '@sprucelabs/test-utils'
import FamilyMemberFormCardViewController from '../../../viewControllers/FamilyMemberFormCard.vc'

export default class FakeFamilyMemberFormCard extends FamilyMemberFormCardViewController {
    public getFormVc() {
        return this.formVc
    }

    public async fillOutForm() {
        const values = {
            name: generateId(),
            bio: generateId(),
        }

        await this.formVc.setValues(values)
        return values
    }

    public async submit() {
        await interactor.submitForm(this.formVc)
    }

    public async fillOutFormAndSubmit() {
        await this.fillOutForm()
        await this.submit()
    }
}
