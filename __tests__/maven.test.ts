/**
 * Unit tests for src/maven.ts
 */
import { settings } from '../src/maven'
import { expect } from '@jest/globals'

describe('maven.ts', () => {
  it('generates settings.xml with server', () => {
    const codeartifact = {
      domain: 'interopio',
      domainOwner: '389653476181',
      region: 'eu-central-1',
      token: 'token'
    }
    const maven = { servers: ['codeartifact'] }
    const xml = settings(codeartifact, maven)

    expect(xml)
      .toEqual(`<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">
  <profiles>
    <profile>
      <id>aws</id>
    </profile>
  </profiles>
  <activeProfiles>
    <activeProfile>aws</activeProfile>
  </activeProfiles>
  <servers>
    <server>
      <id>codeartifact</id>
      <username>aws</username>
      <password>token</password>
    </server>
  </servers>
</settings>`)
  })

  it('generates settings.xml with repositories', () => {
    const codeartifact = {
      domain: 'interopio',
      domainOwner: '389653476181',
      region: 'eu-central-1',
      token: 'token'
    }
    const maven = {
      repositories: [
        'maven-release',
        'maven-snapshot',
        { id: 'clojars', url: 'https://repo.clojars.org' }
      ],
      pluginRepositories: ['maven-release']
    }
    const xml = settings(codeartifact, maven)
    expect(xml)
      .toEqual(`<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">
  <profiles>
    <profile>
      <id>aws</id>
      <repositories>
        <repository>
          <id>maven-release</id>
          <snapshots>
            <enabled>false</enabled>
          </snapshots>
          <url>https://interopio-389653476181.d.codeartifact.eu-central-1.amazonaws.com/maven/maven-release/</url>
        </repository>
        <repository>
          <id>maven-snapshot</id>
          <snapshots>
            <enabled>true</enabled>
          </snapshots>
          <url>https://interopio-389653476181.d.codeartifact.eu-central-1.amazonaws.com/maven/maven-snapshot/</url>
        </repository>
        <repository>
          <id>clojars</id>
          <url>https://repo.clojars.org</url>
        </repository>
      </repositories>
      <pluginRepositories>
        <pluginRepository>
          <id>maven-release</id>
          <snapshots>
            <enabled>false</enabled>
          </snapshots>
          <url>https://interopio-389653476181.d.codeartifact.eu-central-1.amazonaws.com/maven/maven-release/</url>
        </pluginRepository>
      </pluginRepositories>
    </profile>
  </profiles>
  <activeProfiles>
    <activeProfile>aws</activeProfile>
  </activeProfiles>
</settings>`)
  })
})
