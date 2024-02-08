import * as core from '@actions/core'
import * as codeartifact from './codeartifact'
import { CodeartifactClient } from '@aws-sdk/client-codeartifact'

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
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
