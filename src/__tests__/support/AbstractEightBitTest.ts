import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import { assert } from '@sprucelabs/test-utils'
import FamiliesStore from '../../family/Families.store'
import EventFaker from './EventFaker'

export default abstract class AbstractEightBitTest extends AbstractSpruceFixtureTest {
    protected static eventFaker: EventFaker
    protected static families: FamiliesStore

    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()
        this.eventFaker = new EventFaker()
        this.families = await this.stores.getStore('families')
    }

    protected static async getFirstFamily() {
        const family = await this.families.findOne({})
        assert.isTruthy(family)
        return family
    }
}
