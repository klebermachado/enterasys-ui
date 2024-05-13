import SSH from '../../services/ssh.js'

export default async function showSystemCmd(connection: SSH): Promise<any> {
  const response = await connection.exec('show system')
  return parse(response)
}

function parse(raw: string): any {
  const regexSystemName = /(?<=(System\sname:\s+))[a-zA-Z0-9\-\\_\#]+/gm
  const regexSystemLocation = /(?<=(System\slocation:\s+))[a-zA-Z0-9\-\\_\#]+/gm

  const systemName = raw.match(regexSystemName) ?? []
  const systemLocation = raw.match(regexSystemLocation) ?? []

  const response = {
    systemName: systemName[0],
    systemLocation: systemLocation[0],
  }

  return response
}
