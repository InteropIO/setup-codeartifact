import * as core from '@actions/core'
import * as io from '@actions/io'
import * as codeartifact from './codeartifact'
import * as maven from './maven'
import { CodeartifactClient } from '@aws-sdk/client-codeartifact'
import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const domain: string = core.getInput('domain', { required: true })
    const domainOwner: string = core.getInput('domain-owner', {
      required: true
    })
    const region: string = core.getInput('region', { required: true })
    const duration: string = core.getInput('duration', { required: false })

    const client = new CodeartifactClient({ region })
    const token = await codeartifact.getToken(client, {
      domain,
      domainOwner,
      duration
    })
    core.info('got CodeArtifact authorization token')
    core.setOutput('token', token)
    core.setSecret(token)

    const mavenSettings = core.getInput('maven-settings', { required: false })
    if (mavenSettings) {
      const settingsDirectory = path.join(os.homedir(), '.m2')
      await io.mkdirP(settingsDirectory)
      const settings = maven.settings(
        { domain, domainOwner, region, token },
        JSON.parse(mavenSettings)
      )
      const location = path.join(settingsDirectory, 'settings.xml')
      if (!fs.existsSync(location)) {
        fs.writeFileSync(location, settings)
        core.info(`Writing ${location}`)
      }
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
