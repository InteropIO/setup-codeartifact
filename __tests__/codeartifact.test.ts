/**
 * Unit tests for the codeartifact functionality, src/codeartifact.ts
 */

import * as codeartifact from '@aws-sdk/client-codeartifact'
import { getToken } from '../src/codeartifact'

let sendMock: jest.SpyInstance
describe('codeartifact', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sendMock = jest
      .spyOn(codeartifact.CodeartifactClient.prototype, 'send')
      .mockImplementation()
  })
  it('getToken', async () => {
    const client = new codeartifact.CodeartifactClient({ region: 'us-east-1' })
    const result: codeartifact.GetAuthorizationTokenCommandOutput = {
      authorizationToken: 'token',
      $metadata: {}
    }
    sendMock.mockImplementation(async () => result)
    const token = await getToken(client, {
      domain: 'domain',
      domainOwner: 'domainOwner',
      duration: '1800'
    })

    expect(sendMock).toHaveBeenCalled()
    expect(token).toEqual(result.authorizationToken)
  })
  it('throw error', async () => {
    const client = new codeartifact.CodeartifactClient({ region: 'us-east-1' })
    const result: codeartifact.GetAuthorizationTokenCommandOutput = {
      $metadata: { httpStatusCode: 401, requestId: 'testRequestId' }
    }
    sendMock.mockImplementation(async () => result)

    await expect(
      async () =>
        await getToken(client, {
          domain: 'domain',
          domainOwner: 'domainOwner',
          duration: '1800'
        })
    ).rejects.toThrow('Auth Failed: 401 (testRequestId)')
  })
})
