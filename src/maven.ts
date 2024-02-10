import { create } from 'xmlbuilder2'

export type MavenRepository = {
  id: string
  url: string
  snapshots?: {
    enabled?: boolean
  }
}

export type MavenServer = { id: string; username: string; password: string }

export type MavenSettings = {
  repositories?: (MavenRepository | string)[]
  pluginRepositories?: (MavenRepository | string)[]
  servers?: (MavenServer | string)[]
}

export type CodeartifactSettings = {
  domain: string
  domainOwner: string
  region: string
  token: string
}

function codeartifactRepository(
  codeartifact: CodeartifactSettings,
  id: string
): MavenRepository {
  return {
    id,
    snapshots: { enabled: id.toUpperCase().includes('SNAPSHOT') },
    url: `https://${codeartifact.domain}-${codeartifact.domainOwner}.d.codeartifact.${codeartifact.region}.amazonaws.com/maven/${id}/`
  }
}

function codeartifactServer(
  codeartifact: CodeartifactSettings,
  id: string
): MavenServer {
  return { id, username: 'aws', password: codeartifact.token }
}

/**
 * Generate Maven Settings.
 *
 * @param {CodeartifactSettings} codeartifact AWS CodeArtifact Settings.
 * @param {MavenSettings} maven Maven settings.
 * @returns {string} Generated settings.xml contents.
 */
export function settings(
  codeartifact: CodeartifactSettings,
  maven: MavenSettings
): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const xml: { [key: string]: any } = {
    settings: {
      '@xmlns': 'http://maven.apache.org/SETTINGS/1.2.0',
      '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      '@xsi:schemaLocation':
        'http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd'
    }
  }
  if (maven.repositories) {
    const repositories: MavenRepository[] = maven.repositories.map(
      (repository: MavenRepository | string): MavenRepository => {
        if (typeof repository === 'string') {
          return codeartifactRepository(codeartifact, repository)
        }
        return repository
      }
    )
    xml.settings.repositories = { repository: repositories }
  }

  if (maven.pluginRepositories) {
    const pluginRepositories: MavenRepository[] = maven.pluginRepositories.map(
      (repository: MavenRepository | string): MavenRepository => {
        if (typeof repository === 'string') {
          return codeartifactRepository(codeartifact, repository)
        }
        return repository
      }
    )
    xml.settings.pluginRepositories = { pluginRepository: pluginRepositories }
  }

  if (maven.servers) {
    const servers: MavenServer[] = maven.servers.map(
      (server: MavenServer | string): MavenServer => {
        if (typeof server === 'string') {
          return codeartifactServer(codeartifact, server)
        }
        return server
      }
    )
    xml.settings.servers = { server: servers }
  }

  return create(xml).end({ headless: true, prettyPrint: true, width: 80 })
}
