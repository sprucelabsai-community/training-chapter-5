import {
    interactor,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { generateId } from '@sprucelabs/test-utils'
import { PublicFamilyMember } from '../../../eightbitstories.types'
import FamilyMemberFormCardViewController, {
    FamilyMemberFormCardOptions,
} from '../../../viewControllers/FamilyMemberFormCard.vc'

export default class FakeFamilyMemberFormCard extends FamilyMemberFormCardViewController {
    private memberFromConstructor?: PublicFamilyMember

    public constructor(
        options: ViewControllerOptions & FamilyMemberFormCardOptions
    ) {
        super(options)
        this.memberFromConstructor = options.familyMember
    }

    public getFormVc() {
        return this.formVc
    }

    public getMemberPassedToConstructor() {
        return this.memberFromConstructor
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
