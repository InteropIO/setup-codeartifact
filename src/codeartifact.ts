import {
  CodeartifactClient,
  GetAuthorizationTokenCommand
} from '@aws-sdk/client-codeartifact'

export type GetTokenOptions = {
  domain: string | undefined
  domainOwner: string
  duration: string
}

export async function getToken(
  client: CodeartifactClient,
  options: GetTokenOptions
): Promise<string> {
  const durationSeconds = parseInt(
    options.duration === '' ? '1800' : options.duration,
    10
  )

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
