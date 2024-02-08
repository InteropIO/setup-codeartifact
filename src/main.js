const core = require('@actions/core')
const codeArtifact = require('@aws-sdk/client-codeartifact')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const domain = core.getInput('domain', { required: true })
    const domainOwner = core.getInput('domain-owner', { required: true })
    const region = core.getInput('region', { required: true })
    const duration = core.getInput('duration', { required: false })

    const durationSeconds = parseInt(duration === '' ? '1800' : duration, 10)

    // const credentials = new
    const client = new codeArtifact.CodeartifactClient({ region })
    const authCommand = new codeArtifact.GetAuthorizationTokenCommand({
      domain,
      domainOwner,
      durationSeconds
    })

    const response = await client.send(authCommand)
    const authToken = response.authorizationToken
    if (response.authorizationToken === undefined) {
      throw Error(
        `Auth Failed: ${response.$metadata.httpStatusCode} (${response.$metadata.requestId})`
      )
    }
    core.info('got CodeArtifact authorization token')
    core.setOutput('token', authToken)
    core.setSecret(authToken)
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}

module.exports = {
  run
}
