import {
  CodeartifactClient,
  GetAuthorizationTokenCommand
} from '@aws-sdk/client-codeartifact'

export type GetTokenOptions = {
  domain: string
  domainOwner: string
  duration: string
  authorizationToken?: string
}

export async function getToken(
  client: CodeartifactClient,
  options: GetTokenOptions
): Promise<string> {
  const userProvidedToken = options.authorizationToken
  if (userProvidedToken) {
    return Promise.resolve(userProvidedToken)
  }
  const durationSeconds = parseInt(
    options.duration === '' ? '1800' : options.duration,
    10
  )
  if (isNaN(durationSeconds)) {
    throw new Error('duration is not a number')
  }

  const input = {
    domain: options.domain,
    domainOwner: options.domainOwner,
    durationSeconds
  }
  const authCommand = new GetAuthorizationTokenCommand(input)

  const response = await client.send(authCommand)
  const authToken = response.authorizationToken
  if (authToken === undefined) {
    throw Error(
      `Auth Failed: ${response.$metadata.httpStatusCode} (${response.$metadata.requestId})`
    )
  }
  return authToken
}
