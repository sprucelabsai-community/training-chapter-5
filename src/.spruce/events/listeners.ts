import { EventFeatureListener } from '@sprucelabs/spruce-event-utils'

const listeners: EventFeatureListener[] = [
    {
        eventName: 'did-boot',
        eventNamespace: 'skill',
        version: 'v2024_09_19',
        callback: require('../../listeners/skill/did-boot.v2024_09_19.listener').default,
        isGlobal: require('../../listeners/skill/did-boot.v2024_09_19.listener').isGlobal,
    },
    {
        eventName: 'get-family',
        eventNamespace: 'eightbitstories',
        version: 'v2024_09_19',
        callback: require('../../family/listeners/eightbitstories/get-family.v2024_09_19.listener').default,
        isGlobal: require('../../family/listeners/eightbitstories/get-family.v2024_09_19.listener').isGlobal,
    },
    {
        eventName: 'save-family',
        eventNamespace: 'eightbitstories',
        version: 'v2024_09_19',
        callback: require('../../family/listeners/eightbitstories/save-family.v2024_09_19.listener').default,
        isGlobal: require('../../family/listeners/eightbitstories/save-family.v2024_09_19.listener').isGlobal,
    },
    {
        eventName: 'submit-feedback',
        eventNamespace: 'eightbitstories',
        version: 'v2024_09_19',
        callback: require('../../family/listeners/eightbitstories/submit-feedback.v2024_09_19.listener').default,
        isGlobal: require('../../family/listeners/eightbitstories/submit-feedback.v2024_09_19.listener').isGlobal,
    },
]

export default listeners
