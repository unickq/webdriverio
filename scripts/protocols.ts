import fs from 'node:fs/promises'
import url from 'node:url'
import path from 'node:path'

import webdriver from '../packages/wdio-protocols/src/protocols/webdriver.js'
import appium from '../packages/wdio-protocols/src/protocols/appium.js'
import mjsonwp from '../packages/wdio-protocols/src/protocols/mjsonwp.js'
import chromium from '../packages/wdio-protocols/src/protocols/chromium.js'
import gecko from '../packages/wdio-protocols/src/protocols/gecko.js'
import saucelabs from '../packages/wdio-protocols/src/protocols/saucelabs.js'
import selenium from '../packages/wdio-protocols/src/protocols/selenium.js'

import type { Protocol } from '../packages/wdio-protocols/src/types.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export const PROTOCOL_NAMES = {
    appium: 'Appium',
    chromium: 'Chromium',
    gecko: 'Firefox',
    mjsonwp: 'Mobile JSON Wire Protocol',
    saucelabs: 'Sauce Labs',
    selenium: 'Selenium Standalone',
    webdriver: 'WebDriver Protocol',
    webdriverBidi: 'WebDriver Bidi Protocol'
} as const

export type { Protocol }
export type ProtocolKeys = keyof typeof PROTOCOL_NAMES
export type Protocols = Record<ProtocolKeys, Protocol>

const bidiTypesPath = path.resolve(__dirname, '..', 'packages', 'wdio-protocols', 'src', 'protocols', 'webdriverBidi.ts')
const hasBidiTypesGenerated = await fs.access(bidiTypesPath).then(() => true, () => false)
const webdriverBidi = hasBidiTypesGenerated
    ? (await import(url.pathToFileURL(bidiTypesPath).pathname)).default
    : {}

export const PROTOCOLS: Protocols = {
    appium, chromium, gecko, mjsonwp,
    saucelabs, selenium, webdriver, webdriverBidi
}

export const MOBILE_PROTOCOLS = ['appium', 'mjsonwp']
export const VENDOR_PROTOCOLS = ['chromium']
export const IGNORED_SUBPACKAGES_FOR_DOCS = [
    'eslint-plugin-wdio',
    'wdio-smoke-test-service',
    'wdio-smoke-test-reporter',
    'wdio-smoke-test-cjs-service'
]

export const EDIT_WARNING = `// -------------------- ATTENTION --------------------
// Do not edit this file as it gets auto-generated!
// For edits modify /scripts/templates/*.tpl.d.ts
// Check CONTRIBUTING.md for more details.
// --------------------------------------------------
//
`

export const SAUCE_API_DESCRIPTION = /*md*/`
All commands are only supported on Chrome using Sauce Labs
[Extended Debugging](https://docs.saucelabs.com/insights/debug/#enabling-extended-debugging)
capabilities. You can enable these by setting the following Sauce options:\n\n
\`\`\`js
{
    browserName: 'Chrome',
    browserVersion: 'latest',
    platformName: 'Windows 10',
    'sauce:options': {
        extendedDebugging: true
    }
}
\`\`\`
`

export const BIDI_API_DESCRIPTION = /*md*/`
These protocol commands are generated based on the current living
[WebDriver Bidi](https://w3c.github.io/webdriver-bidi/) specification. To enable the protocol
for your test make sure to have \`webSocketUrl: true\` set in your capabilities.

:::caution Use with Caution!

Browser support is not guaranteed and interfaces can change in the future. The standard
is currently under development and browser vendors will add these capabilities based on their
own timelines.

:::

Last Updated: ${(new Date()).toString()}
`

export const PROTOCOL_API_DESCRIPTION = {
    'saucelabs': SAUCE_API_DESCRIPTION,
    'webdriverBidi': BIDI_API_DESCRIPTION
}
