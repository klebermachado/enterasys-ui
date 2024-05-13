import SSH from '../../services/ssh.js'

export default async function showHostVlanCmd(connection: SSH): Promise<any> {
  const response = await connection.exec('show host vlan')
  return parse(response)
}

function parse(raw: string): any {
  const regexHostVlan = /(?<=is\s)[0-9]+/gm

  const hostVlan = raw.match(regexHostVlan) ?? []
  const response = {
    hostVlan: hostVlan[0],
  }

  return response
}
