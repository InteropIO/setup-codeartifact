/**
 * Unit tests for the action's main functionality, src/main.ts
 */
import * as core from '@actions/core'
import * as main from '../src/main'
import * as codeartifact from '../src/codeartifact'

// Mock the GitHub Actions core library
let infoMock: jest.SpyInstance
let getInputMock: jest.SpyInstance
let setFailedMock: jest.SpyInstance
let setOutputMock: jest.SpyInstance
let getTokenMock: jest.SpyInstance

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Other utilities
const tokenRegex = /[\w.\-+\\]+/

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    infoMock = jest.spyOn(core, 'info').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
    getTokenMock = jest.spyOn(codeartifact, 'getToken').mockImplementation()
  })

  it('sets the token output', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'domain':
          return 'interopio'
        case 'domain-owner':
          return '389653476181'
        case 'region':
          return 'eu-central-1'
        default:
          return ''
      }
    })
    getTokenMock.mockImplementation(async () => 'token')

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all the core library functions were called correctly
    expect(infoMock).toHaveBeenNthCalledWith(
      1,
      'got CodeArtifact authorization token'
    )
    // expect(debugMock).toHaveBeenNthCalledWith(
    //   2,
    //   expect.stringMatching(timeRegex)
    // )
    // expect(debugMock).toHaveBeenNthCalledWith(
    //   3,
    //   expect.stringMatching(timeRegex)
    // )
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'token',
      expect.stringMatching(tokenRegex)
    )
  })

  it('sets a failed status', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'region':
          return 'eu-central-1'
        case 'duration':
          return 'this is not a number'
        default:
          return ''
      }
    })
    getTokenMock = jest
      .spyOn(codeartifact, 'getToken')
      .mockImplementation(async () => {
        throw new Error('Token Error')
      })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(1, 'Token Error')
  })

  it('fails if no input is provided', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string) => {
      switch (name) {
        case 'domain':
        case 'domain-owner':
        case 'region':
          throw new Error(`Input required and not supplied: ${name}`)
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'Input required and not supplied: domain'
    )
  })
})
