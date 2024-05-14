import SSH from '../../services/ssh.js'

export default async function showVlanPortCmd(connection: SSH): Promise<any> {
  const response = await connection.exec('show vlan port')
  return parse(response)
}

function parse(raw: string): any {
  const rows = raw.split('\n')

  const regexPortName = /^[a-z]+\.[0-9]+\.[0-9]+/gm
  const regexPortVlan = /(?<=(^[a-z]*\.[0-9]+\.[0-9]+\s+))[0-9]+/gm
  const regexUntagged = /(?<=untagged:\s)[0-9]+/gm
  const regexTagged = /(?<=\stagged:\s)[0-9,]+/gm

  const response = rows
    .map((row) => {
      const portName = row.match(regexPortName) ?? []
      const portVlan = row.match(regexPortVlan) ?? []
      const untagged = row.match(regexUntagged) ?? []
      const tagged = row.match(regexTagged)?.map((t) => t.split(',')) ?? []

      return {
        portName: portName[0],
        portVlan: portVlan[0] ?? '',
        untagged: untagged[0] ?? '',
        tagged: tagged[0] ?? [],
      }
    })
    .filter((port) => port.portName !== undefined)

  return response
}
