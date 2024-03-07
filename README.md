# InteropIO Setup Codeartifact Action

[![GitHub Super-Linter](https://github.com/InteropIO/setup-codeartifact/actions/workflows/linter.yml/badge.svg)](https://github.com/marketplace/actions/super-linter)
![CI](https://github.com/InteropIO/setup-codeartifact/actions/workflows/ci.yml/badge.svg)

InteropIO/setup-codeartifact is GitHub Action that sets up AWS Codeartifact for
use in a workflow.

## Usage

### Maven Example

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v4
  - name: Run Setup Codeartifact
    uses: InteropIO/setup-codeartifact@v1.1
    with:
      domain: '<domain>'
      domain-owner: '<domain-owner>'
      region: '<region>'
      maven-settings:
        '["repositories":["maven-release", "maven-snapshot"],
        "pluginRepositories":["maven-release"], "servers": ["codeartifact"]]'
  - name: Run Setup Java
    uses: actions/setup-java@v4
    with:
      distribution: 'temurin'
      java-version: '17'
      overwrite-settings: false
  - name: Run Maven
    run:
      ./mvnw -B clean deploy
      -DaltSnapshotDeploymentRepository=codeartifact::https://<domain>-<domain-owner>.d.codeartifact.<region>.amazonaws.com/maven/maven-snapshot-local
      -DaltReleaseDeploymentRepository=codeartifact::https://<domain>-<domain-owner>.d.codeartifact.<region>.amazonaws.com/maven/maven-release-local
```
